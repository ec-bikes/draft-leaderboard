// Based on cors-anywhere https://github.com/Rob--W/cors-anywhere/
//   © 2013 - 2016 Rob Wu <rob@robwu.nl>
//   Released under the MIT license
import http from 'http';
import { ProxyServer, type ProxyServerOptions } from './http-proxy/index';
import { parseURL, withCORS } from './util';
import type { CorsAnywhereOptions, CorsAnywhereRequestState, CorsServerRequest } from './types';

/**
 * Create server with default and given values.
 * Creator still needs to call `.listen()`.
 *
 * Server usage:
 * Requesting `/<url>` creates a request to `<url>`, and includes CORS headers in the response.
 *
 * Cookies are disabled and stripped from requests.
 * Redirects are NOT followed in this version.
 */
export function createCorsServer(
  options: CorsAnywhereOptions & {
    httpProxyOptions?: ProxyServerOptions;
  } = {},
) {
  const httpProxyOptions: ProxyServerOptions = {
    xfwd: true, // Append X-Forwarded-* headers
    ...options.httpProxyOptions,
  };

  const proxy = new ProxyServer(httpProxyOptions);
  const server = createHttpServer(options, proxy);

  proxy.onEvent('proxyRes', (proxyReq, proxyRes, _req, res) => {
    const req = _req as CorsServerRequest;
    const requestState = req.corsAnywhereRequestState;

    res.setHeader('x-request-url', requestState.location.href);

    // Redirect support was removed for simplicity (look at history)
    const statusCode = proxyRes.statusCode;
    if ([301, 302, 303, 307, 308].includes(statusCode || 0)) {
      // Note: ending the request here will disable the final processing (outgoingPasses)
      // in the proxy server.
      res.setHeader('location', requestState.proxyBaseUrl + '/' + proxyRes.headers.location);
      res.writeHead(404, 'Redirect not supported', requestState.corsHeaders);
      res.end(
        `Returned a redirect (${statusCode}, ${proxyRes.statusMessage}) to ${proxyRes.headers.location}`,
      );
      return;
    }

    // Strip cookies
    delete proxyRes.headers['set-cookie'];
    delete proxyRes.headers['set-cookie2'];

    proxyRes.headers['x-final-url'] = requestState.location.href;

    withCORS(proxyRes.headers, req);
  });

  proxy.onEvent('end', (req, res) => {
    console.dir(res.getHeaders());
  });

  // When the server fails, just show a 404 instead of Internal server error
  proxy.onEvent('error', (err, req, res) => {
    if (res.headersSent) {
      // This could happen when a protocol error occurs when an error occurs
      // after the headers have been received (and forwarded). Do not write
      // the headers because it would generate an error.
      // Prior to Node 13.x, the stream would have ended.
      // As of Node 13.x, we must explicitly close it.
      if (res.writableEnded === false) {
        res.end();
      }
      return;
    }

    const { url, method, headers } = req;
    const reqStr = JSON.stringify({ url, method, headers }, null, 2);

    // When the error occurs after setting headers but before writing the response,
    // then any previously set headers must be removed.
    for (const name of res.getHeaderNames()) {
      res.removeHeader(name);
    }

    res.writeHead(404, { 'Access-Control-Allow-Origin': '*' });
    res.end(
      [
        `Not found because of proxy error: ${(err as Error).stack || err}`,
        `Request: ${reqStr}`,
      ].join('\n\n'),
    );
  });

  return server;
}

function createHttpServer(options: CorsAnywhereOptions, proxy: ProxyServer) {
  const corsAnywhere: Required<CorsAnywhereOptions> = {
    setHeaders: {},
    corsMaxAge: 0,
    ...options,
    removeHeaders: [...(options.removeHeaders || [], 'cookie', 'cookie2')],
  };

  return http.createServer((_req, res) => {
    const req = _req as CorsServerRequest;
    const corsState = (req.corsAnywhereRequestState = {
      corsMaxAge: corsAnywhere.corsMaxAge,
    } as CorsAnywhereRequestState);

    const corsHeaders = (corsState.corsHeaders = withCORS({}, req));
    if (req.method === 'OPTIONS') {
      // Pre-flight request. Reply successfully:
      res.writeHead(200, corsHeaders);
      res.end();
      return;
    }

    if (!req.url) {
      console.error('Request URL not set');
      return;
    }

    // remove the leading /
    // NOTE: removed a check for a very long top-level domain regex
    const location = parseURL(req.url.slice(1));
    if (!location || !/^\/https?:/.test(req.url)) {
      res.writeHead(404, 'Missing or invalid URL', corsHeaders);
      res.end('Missing or invalid URL: ' + req.url);
      return;
    }

    const proxyBaseUrl = 'http://' + req.headers.host;

    corsAnywhere.removeHeaders.forEach(function (header) {
      delete req.headers[header];
    });

    Object.keys(corsAnywhere.setHeaders).forEach(function (header) {
      req.headers[header] = corsAnywhere.setHeaders[header];
    });

    corsState.location = location;
    corsState.proxyBaseUrl = proxyBaseUrl;

    req.url = location.path || '';

    // Start proxying the request
    try {
      proxy.proxyRequest(req, res, {
        target: location,
        headers: {
          host: location.host!,
        },
      });
    } catch (err) {
      proxy.emitEvent('error', err, req, res, location);
    }
  });
}
