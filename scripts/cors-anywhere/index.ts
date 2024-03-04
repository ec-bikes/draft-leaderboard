// Based on cors-anywhere https://github.com/Rob--W/cors-anywhere/
//   © 2013 - 2016 Rob Wu <rob@robwu.nl>
//   Released under the MIT license
import http from 'http';
import type url from 'url';
import { ProxyServer } from './http-proxy/index';
import { parseURL, withCORS } from './util';

/** Incoming HTTP request, augmented with state */
type CorsServerRequest = http.IncomingMessage & {
  corsAnywhereRequestState: {
    /** Base URL of the CORS API endpoint */
    proxyBaseUrl: string;
    location: url.Url;
    corsHeaders: http.IncomingHttpHeaders;
  };
};

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
export function createCorsServer() {
  const proxy = new ProxyServer({
    xfwd: true, // Append X-Forwarded-* headers
  });

  // Handle proxy server responses
  proxy.onEvent('proxyRes', (proxyReq, proxyRes, _req, res) => {
    const req = _req as CorsServerRequest;
    const requestState = req.corsAnywhereRequestState;

    // Disable caching of responses (mainly for development)
    res.setHeader('cache-control', 'no-store, must-revalidate');

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

    withCORS(proxyRes.headers, req);
  });

  // When the server fails, just show a 404 instead of Internal server error
  proxy.onEvent('error', (err, req, res) => {
    if (res.headersSent) {
      // This could happen when a protocol error occurs when an error occurs
      // after the headers have been received (and forwarded). Do not write
      // the headers because it would generate an error.
      if (!res.writableEnded) {
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

  // Start the server
  return http.createServer((_req, res) => {
    const req = _req as CorsServerRequest;
    const corsHeaders = withCORS({}, req);

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

    // Check basic URL validity
    const location = parseURL(req.url.slice(1)); // // remove the leading /
    if (!location || !/^\/https?:/.test(req.url)) {
      res.writeHead(404, 'Invalid URL', corsHeaders);
      res.end('Invalid URL: ' + req.url);
      return;
    }

    delete req.headers.cookie;
    delete req.headers.cookie2;

    req.corsAnywhereRequestState = {
      corsHeaders,
      location,
      proxyBaseUrl: 'http://' + req.headers.host,
    };

    req.url = location.path || '';

    // Start proxying the request
    try {
      proxy.proxyRequest(req, res, {
        target: location,
        headers: {
          host: location.host || '',
        },
      });
    } catch (err) {
      proxy.emitEvent('error', err, req, res, location);
    }
  });
}
