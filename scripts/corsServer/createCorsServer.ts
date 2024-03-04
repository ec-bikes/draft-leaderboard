// Based on cors-anywhere https://github.com/Rob--W/cors-anywhere/
//   © 2013 - 2016 Rob Wu <rob@robwu.nl>
//   Released under the MIT license
import http from 'http';
import url from 'url';
import { ProxyHandler } from './ProxyHandler';

/** Incoming HTTP request, augmented with state */
type CorsServerRequest = http.IncomingMessage & {
  corsAnywhereRequestState: {
    /** Base URL of the CORS API endpoint */
    proxyBaseUrl: string;
    target: url.Url;
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
  const proxy = new ProxyHandler();

  // Handle proxy server responses
  proxy.on('proxyRes', ({ proxyRes, req: _req, res }) => {
    const req = _req as CorsServerRequest;
    const requestState = req.corsAnywhereRequestState;

    // Disable caching of responses (mainly for development)
    res.setHeader('cache-control', 'no-store, must-revalidate');

    // Redirect support was removed for simplicity (look at history)
    const statusCode = proxyRes.statusCode;
    if ([301, 302, 303, 307, 308].includes(statusCode || 0)) {
      // Note: ending the request here will disable the final processing in the proxy server.
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
  proxy.on('error', ({ err, req, res }) => {
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
    const target = parseURL(req.url.slice(1)); // // remove the leading /
    if (!target || !/^\/https?:/.test(req.url)) {
      res.writeHead(404, 'Invalid URL', corsHeaders);
      res.end('Invalid URL: ' + req.url);
      return;
    }

    delete req.headers.cookie;
    delete req.headers.cookie2;

    req.corsAnywhereRequestState = {
      corsHeaders,
      target: target,
      proxyBaseUrl: 'http://' + req.headers.host,
    };

    req.url = target.path || '';

    // Start proxying the request
    try {
      proxy.proxyRequest({
        req,
        res,
        options: {
          target,
          headers: { host: target.host || '' },
        },
      });
    } catch (err) {
      proxy.emit('error', { err, req, res, target });
    }
  });
}

/**
 * Adds CORS headers to the response headers.
 */
function withCORS(headers: http.IncomingHttpHeaders, request: http.IncomingMessage) {
  headers['access-control-allow-origin'] = '*';
  if (request.headers['access-control-request-method']) {
    headers['access-control-allow-methods'] = request.headers['access-control-request-method'];
    delete request.headers['access-control-request-method'];
  }
  if (request.headers['access-control-request-headers']) {
    headers['access-control-allow-headers'] = request.headers['access-control-request-headers'];
    delete request.headers['access-control-request-headers'];
  }

  headers['access-control-expose-headers'] = Object.keys(headers).join(',');

  return headers;
}

function parseURL(reqUrl: string) {
  const match = reqUrl.match(
    /^(?:(https?:)?\/\/)?(([^/?]+?)(?::(\d{0,5})(?=[/?]|$))?)([/?][\S\s]*|$)/i,
  );
  //      ^^^^^^^          ^^^^^^^^      ^^^^^^^                ^^^^^^^^^^^^
  //    1:protocol       3:hostname     4:port                 5:path + query string
  //                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //                    2:host
  if (!match) {
    return null;
  }
  if (!match[1]) {
    if (/^https?:/i.test(reqUrl)) {
      // The pattern at top could mistakenly parse "http:///" as host="http:" and path=///.
      return null;
    }
    // Scheme is omitted.
    if (reqUrl.lastIndexOf('//', 0) === -1) {
      // "//" is omitted.
      reqUrl = '//' + reqUrl;
    }
    reqUrl = (match[4] === '443' ? 'https:' : 'http:') + reqUrl;
  }
  const parsed = url.parse(reqUrl);
  if (!parsed.hostname) {
    // "http://:1/" and "http:/notenoughslashes" could end up here.
    return null;
  }
  return parsed;
}
