import type http from 'http';
import type https from 'https';
import url from 'url';
import type { ProxyParams } from './types.js';

const upgradeHeader = /(^|,)\s*upgrade\s*($|,)/i;
const isSSL = /^https|wss/;

/**
 * Creates an outgoing HTTP request options object with the right headers, method, etc.
 */
export function getProxyHttpRequestOptions(
  params: Pick<ProxyParams, 'req'> & { target: url.Url },
): http.RequestOptions {
  const { target, req } = params;

  const outgoing: http.RequestOptions & https.RequestOptions = {
    port: target.port || (isSSL.test(target.protocol || '') ? 443 : 80),
    host: target.host,
    hostname: target.hostname,
    method: req.method,
    auth: target.auth,
    agent: false,
  };
  // make sure TS knows this is set
  outgoing.headers = { ...req.headers, host: target.host || '' };

  if (isSSL.test(target.protocol || '')) {
    outgoing.rejectUnauthorized = true;
    // outgoing.rejectUnauthorized = (typeof options.secure === "undefined") ? true : options.secure;
  }

  // Remark: If we are false and not upgrading, set the connection: close. This is the right thing to do
  // as node core doesn't handle this COMPLETELY properly yet.
  if (
    typeof outgoing.headers.connection !== 'string' ||
    !upgradeHeader.test(outgoing.headers.connection)
  ) {
    outgoing.headers.connection = 'close';
  }

  outgoing.path = url.parse(req.url || '').path || '';

  return outgoing;
}

/**
 * Prepare the proxy response and the original response to be sent to the client.
 */
export function prepareResponse(params: Pick<ProxyParams, 'req' | 'res' | 'proxyRes'>) {
  const { req, res, proxyRes } = params;

  // Strip cookies
  delete proxyRes.headers['set-cookie'];
  delete proxyRes.headers['set-cookie2'];

  // Add CORS headers
  withCORS(proxyRes.headers, req);

  // Set the appropriate connection header.
  // If is a HTTP 1.0 request, also remove chunk headers
  if (req.httpVersion === '1.0') {
    proxyRes.headers.connection ??= 'close';
    delete proxyRes.headers['transfer-encoding'];
  } else if (req.httpVersion !== '2.0' && !proxyRes.headers.connection) {
    proxyRes.headers.connection ??= 'keep-alive';
  }

  // Copy headers from proxyResponse to response.
  for (const [key, header] of Object.entries(proxyRes.headers)) {
    header !== undefined && res.setHeader(key.trim(), header);
  }

  // Set the statusCode from the proxyResponse
  if (proxyRes.statusCode) {
    res.statusCode = proxyRes.statusCode;
    if (proxyRes.statusMessage) {
      res.statusMessage = proxyRes.statusMessage;
    }
  } else {
    // added code to handle this (not sure how it could happen but there was an issue about it)
    res.statusCode = 500;
    res.statusMessage = 'proxyRes.statusCode not set';
  }
}

/**
 * Get the port number from the host. Or guess it based on the connection type.
 */
export function getPort(req: http.IncomingMessage): string {
  const match = req.headers.host?.match(/:(\d+)/);
  return match ? match[1] : hasEncryptedConnection(req) ? '443' : '80';
}

export function hasEncryptedConnection(req: http.IncomingMessage) {
  const maybeTlsSocket = req.socket as any;
  // not sure where .pair comes from (not on tls.TLSSocket)
  return !!(maybeTlsSocket.encrypted || maybeTlsSocket.pair);
}

/**
 * Adds CORS headers to the response headers.
 */
export function withCORS(headers: http.IncomingHttpHeaders, request: http.IncomingMessage) {
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

export function parseURL(reqUrl: string) {
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
