import type http from 'http';
import type https from 'https';
import url from 'url';
import type { OriginalRequest, ProxyServerRequestOptions } from './types';
import type { RequestOptions } from 'http';

const upgradeHeader = /(^|,)\s*upgrade\s*($|,)/i;
const isSSL = /^https|wss/;

/**
 * Copies the right headers from `options` and `req` to
 * `outgoing` which is then used to fire the proxied request.
 *
 * @param options Config object passed to the proxy
 * @param forward String to select forward or target
 *
 * @return Outgoing Object with all required properties set
 */
export function setupOutgoing(options: ProxyServerRequestOptions, req: OriginalRequest) {
  const target = options.target;
  const outgoing: RequestOptions & https.RequestOptions = {
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
 * Get the port number from the host. Or guess it based on the connection type.
 */
export function getPort(req: OriginalRequest): string {
  const match = req.headers.host?.match(/:(\d+)/);
  return match ? match[1] : hasEncryptedConnection(req) ? '443' : '80';
}

export function hasEncryptedConnection(req: http.IncomingMessage) {
  const maybeTlsSocket = req.socket as any;
  // not sure where .pair comes from (not on tls.TLSSocket)
  return !!(maybeTlsSocket.encrypted || maybeTlsSocket.pair);
}
