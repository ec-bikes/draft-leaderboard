import type http from 'http';
import url from 'url';

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
  //                              ^^^^^^^          ^^^^^^^^      ^^^^^^^                ^^^^^^^^^^^^
  //                            1:protocol       3:hostname     4:port                 5:path + query string
  //                                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //                                            2:host
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
