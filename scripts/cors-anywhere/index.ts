// Based on cors-anywhere
//   © 2013 - 2016 Rob Wu <rob@robwu.nl>
//   Released under the MIT license
import http from 'http';
import url from 'url';
import { ProxyServer, type ProxyServerOptions } from './http-proxy/index';
import { parseURL, withCORS } from './util';
import type { CorsAnywhereOptions, CorsAnywhereRequestState, CorsServerRequest } from './types';
import type { ProxyRequest, ProxyResponse } from './http-proxy/types';

/**
 * Create server with default and given values.
 * Creator still needs to call `.listen()`.
 *
 * Server usage:
 * Requesting `/<url>` creates a request to `<url>`, and includes CORS headers in the response.
 *
 * Cookies are disabled and stripped from requests.
 * Redirects are NOT followed in this version.
 *
 * - Demo          :   https://robwu.nl/cors-anywhere.html
 * - Source code   :   https://github.com/Rob--W/cors-anywhere/
 * - Documentation :   https://github.com/Rob--W/cors-anywhere/#documentation
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

    if (!requestState.redirectCount) {
      res.setHeader('x-request-url', requestState.location.href);
    }

    const statusCode = proxyRes.statusCode;
    if ([301, 302, 303, 307, 308].includes(statusCode || 0)) {
      if (redirect({ proxy, proxyReq, proxyRes, req, res })) {
        return;
      }
      // To 404 on redirects:
      // res.setHeader('location', requestState.proxyBaseUrl + '/' + proxyRes.headers.location);
      // res.writeHead(404, 'Redirect not supported', requestState.corsHeaders);
      // res.end(
      //   `Returned a redirect (${statusCode}, ${proxyRes.statusMessage}) to ${proxyRes.headers.location}`,
      // );
      // return;
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
    maxRedirects: 5,
    redirectSameOrigin: false,
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

    proxyRequest(req, res, proxy);
  });
}

/**
 * Performs the actual proxy request.
 */
function proxyRequest(req: CorsServerRequest, res: http.ServerResponse, proxy: ProxyServer) {
  const location = req.corsAnywhereRequestState.location;
  req.url = location.path!;

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
}

/**
 * Handle a redirect status.
 * Returns true if a new redirect request was sent.
 */
function redirect(params: {
  proxy: ProxyServer;
  proxyReq: ProxyRequest;
  proxyRes: ProxyResponse;
  req: CorsServerRequest;
  res: http.ServerResponse;
}): boolean {
  const { proxy, proxyReq, proxyRes, req, res } = params;
  const requestState = req.corsAnywhereRequestState;
  const statusCode = proxyRes.statusCode || 0;

  let locationHeader = proxyRes.headers.location;
  let parsedLocation: url.Url | null = null;
  if (locationHeader) {
    locationHeader = url.resolve(requestState.location.href, locationHeader);
    parsedLocation = parseURL(locationHeader);
  }
  if (parsedLocation) {
    // Exclude 307 & 308, because they are rare, and require preserving the method + request body
    if (statusCode !== 307 && statusCode !== 308) {
      requestState.redirectCount++;
      if (requestState.redirectCount <= requestState.maxRedirects) {
        // Handle redirects within the server, because some clients (e.g. Android Stock Browser)
        // cancel redirects.
        // Set header for debugging purposes. Do not try to parse it!
        res.setHeader(
          'X-CORS-Redirect-' + requestState.redirectCount,
          `${statusCode} ${locationHeader}`,
        );

        req.method = 'GET';
        req.headers['content-length'] = '0';
        delete req.headers['content-type'];
        requestState.location = parsedLocation;

        // Remove all listeners (=reset events to initial state)
        req.removeAllListeners();

        // Remove the error listener so that the ECONNRESET "error" that
        // may occur after aborting a request does not propagate to res.
        // https://github.com/nodejitsu/node-http-proxy/blob/v1.11.1/lib/http-proxy/passes/web-incoming.js#L134
        proxyReq.removeAllListeners('error');
        proxyReq.once('error', function catchAndIgnoreError() {});
        proxyReq.destroy();

        // Initiate a new proxy request.
        proxyRequest(req, res, proxy);
        return true;
      }
    }
    proxyRes.headers.location = `${requestState.proxyBaseUrl}/${locationHeader}`;
  }
  return false;
}
