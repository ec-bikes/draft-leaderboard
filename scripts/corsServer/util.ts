import type http from 'http';
import type https from 'https';
import url from 'url';
import type { ProxyParams } from './types';

const upgradeHeader = /(^|,)\s*upgrade\s*($|,)/i;
const isSSL = /^https|wss/;

/**
 * Creates an outgoing HTTP request options object with the right headers copied from
 * `options` and `req`.
 */
export function getProxyHttpRequestOptions(
  params: Pick<ProxyParams, 'options' | 'req'>,
): http.RequestOptions {
  const { options, req } = params;

  const target = options.target;
  const outgoing: http.RequestOptions & https.RequestOptions = {
    port: target.port || (isSSL.test(target.protocol || '') ? 443 : 80),
    host: target.host,
    hostname: target.hostname,
    method: options.method || req.method,
    auth: target.auth,
    agent: false,
  };
  // make sure TS knows this is set
  outgoing.headers = { ...req.headers, ...options.headers };

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
