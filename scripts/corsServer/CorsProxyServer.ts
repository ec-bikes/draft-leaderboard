// Modified and greatly simplified from http-proxy and cors-anywhere.
// And turned out to be completely unnecessary.
// https://github.com/http-party/node-http-proxy
// https://github.com/Rob--W/cors-anywhere/
import EventEmitter from 'events';
import http from 'http';
import https from 'https';
import type url from 'url';
import {
  getPort,
  hasEncryptedConnection,
  getProxyHttpRequestOptions,
  prepareResponse,
  withCORS,
  parseURL,
} from './util.js';
import type { ProxyEvents, ProxyParams } from './types.js';

type CorsRequest = ProxyParams['req'] & {
  requestState: {
    /** Base URL of the CORS API endpoint */
    corsHeaders: http.IncomingHttpHeaders;
    target: url.Url;
    proxyBaseUrl: string;
  };
};

/**
 * Create a server to proxy CORS requests.
 * Creator still needs to call `.listen()`.
 *
 * Server usage:
 * Requesting `/<url>` creates a request to `<url>`, and includes CORS headers in the response.
 *
 * Cookies are disabled and stripped from requests.
 * Redirects are NOT followed in this version.
 */
export class CorsProxyServer extends EventEmitter<ProxyEvents> {
  private _server: http.Server;

  constructor() {
    super();
    this._server = http.createServer((req, res) => {
      try {
        this._onRequest({ req, res });
      } catch (err) {
        this.emit('error', { err, req, res });
      }
    });
  }

  public listen(port: number, hostname: string, callback?: () => void): this {
    this._server.listen(port, hostname, callback);
    return this;
  }

  public close(callback?: (err?: Error) => void) {
    this._server.close((...args: any[]) => {
      this._server = undefined as any;
      callback?.(...args);
    });
  }

  private _onRequest(params: Pick<ProxyParams, 'req' | 'res'>) {
    const req = params.req as CorsRequest;
    const res = params.res;

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
      res.writeHead(400, 'Invalid URL', corsHeaders);
      res.end('Invalid URL: ' + req.url);
      return;
    }

    req.url = target.path || '';

    delete req.headers.cookie;
    delete req.headers.cookie2;

    req.requestState = {
      corsHeaders,
      target,
      proxyBaseUrl: 'http://' + req.headers.host,
    };

    // Set `content-length` to '0' if request is of OPTIONS type.
    if (req.method === 'OPTIONS' && !req.headers['content-length']) {
      req.headers['content-length'] = '0';
      delete req.headers['transfer-encoding'];
    }

    // Set timeout in request socket if it was specified in options.
    // req.socket.setTimeout(options.timeout);

    // Set `x-forwarded-*` headers
    const forwardHeaders = {
      for: req.socket.remoteAddress,
      port: getPort(req),
      proto: hasEncryptedConnection(req) ? 'https' : 'http',
    };
    for (const [key, newValue] of Object.entries(forwardHeaders)) {
      const header = 'x-forwarded-' + key;
      const oldValue = req.headers[header];
      req.headers[header] = (oldValue ? oldValue + ',' : '') + newValue;
    }
    req.headers['x-forwarded-host'] ||= req.headers['host'] || '';

    // Request initalization
    // (need to use https here if the user-requested target URL is https)
    const proxyReq = (target.protocol === 'https:' ? https : http).request(
      getProxyHttpRequestOptions({ target, req }),
    );

    // proxyReq.setTimeout(options.proxyTimeout, () => {
    //   proxyReq.destroy();
    // });

    // Ensure we abort proxy if request is aborted
    req.on('aborted', () => {
      proxyReq.destroy();
    });

    // handle errors in proxy and incoming request
    const proxyError = (err: unknown) => {
      if (req.socket.destroyed && (err as any).code === 'ECONNRESET') {
        return proxyReq.destroy();
      }
      this._onProxyError({ err, req, res });
    };
    req.on('error', proxyError);
    proxyReq.on('error', proxyError);

    // Send the request
    req.pipe(proxyReq);

    proxyReq.on('response', (_res) => {
      const proxyRes = _res as ProxyParams['proxyRes'];
      this._onProxyResponse({ proxyRes, req, res });
    });
  }

  private _onProxyResponse(params: Pick<ProxyParams, 'req' | 'res' | 'proxyRes'>) {
    const { proxyRes, req, res } = params;
    const { requestState } = req as CorsRequest;

    // Disable caching of responses (mainly for development, prior to redirect handling)
    res.setHeader('cache-control', 'no-store, must-revalidate');

    // Redirect support was removed for simplicity (look at history)
    const statusCode = proxyRes.statusCode;
    if ([301, 302, 303, 307, 308].includes(statusCode || 0)) {
      res.setHeader('location', requestState.proxyBaseUrl + '/' + proxyRes.headers.location);
      res.writeHead(404, 'Resource moved', requestState.corsHeaders);
      res.end(
        `Resource moved to ${proxyRes.headers.location} (${statusCode}, ${proxyRes.statusMessage}).\n` +
          'Please update the URL and try again (automatic redirects are not supported).',
      );
      return;
    }

    prepareResponse({ req, res, proxyRes });
    proxyRes.pipe(res);
  }

  // When the server fails, just show a 404 instead of Internal server error
  private _onProxyError = ({ err, req, res }: ProxyEvents['error'][0]) => {
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
  };
}
