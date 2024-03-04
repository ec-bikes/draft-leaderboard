// Modified and greatly simplified from http-proxy.
// https://github.com/http-party/node-http-proxy
import EventEmitter from 'events';
import http from 'http';
import https from 'https';
import {
  getPort,
  hasEncryptedConnection,
  getProxyHttpRequestOptions,
  prepareResponse,
} from './util';
import type { ProxyEvents, ProxyParams } from './types';

/**
 * Handles the proxying of a request.
 * It's a class because it can emit events.
 */
export class ProxyHandler extends EventEmitter<ProxyEvents> {
  public proxyRequest(params: Pick<ProxyParams, 'req' | 'res' | 'options'>) {
    const { req, res, options } = params;
    const { target } = options;

    // Set `content-length` to '0' if request is of OPTIONS type.
    if (req.method === 'OPTIONS' && !req.headers['content-length']) {
      req.headers['content-length'] = '0';
      delete req.headers['transfer-encoding'];
    }

    // Set timeout in request socket if it was specified in options.
    if (options.timeout) {
      req.socket.setTimeout(options.timeout);
    }

    // Set `x-forwarded-*` headers
    const headers = {
      for: req.socket.remoteAddress,
      port: getPort(req),
      proto: hasEncryptedConnection(req) ? 'https' : 'http',
    };
    for (const [key, newValue] of Object.entries(headers)) {
      const header = 'x-forwarded-' + key;
      const oldValue = req.headers[header];
      req.headers[header] = (oldValue ? oldValue + ',' : '') + newValue;
    }
    req.headers['x-forwarded-host'] ||= req.headers['host'] || '';

    // And we begin!
    this.emit('start', { req, res, target });

    // Request initalization
    // (need to use https here if the user-requested target URL is https)
    const proxyReq = (target.protocol === 'https:' ? https : http).request(
      getProxyHttpRequestOptions({ options, req }),
    );

    // Enable developers to modify the proxyReq before headers are sent
    proxyReq.on('socket', () => {
      if (!proxyReq.getHeader('expect')) {
        this.emit('proxyReq', { proxyReq, req, res, options });
      }
    });

    // allow outgoing socket to timeout so that we could
    // show an error page at the initial request
    if (options.proxyTimeout) {
      proxyReq.setTimeout(options.proxyTimeout, () => {
        proxyReq.destroy();
      });
    }

    // Ensure we abort proxy if request is aborted
    req.on('aborted', () => {
      proxyReq.destroy();
    });

    // handle errors in proxy and incoming request, just like for forward proxy
    const proxyError = (err: unknown) => {
      if (req.socket.destroyed && (err as any).code === 'ECONNRESET') {
        this.emit('econnreset', { err, req, res, target });
        return proxyReq.destroy();
      }
      this.emit('error', { err, req, res, target });
    };
    req.on('error', proxyError);
    proxyReq.on('error', proxyError);

    // Send the request
    req.pipe(proxyReq);

    proxyReq.on('response', (_res) => {
      const proxyRes = _res as ProxyParams['proxyRes'];
      this.emit('proxyRes', { proxyReq, proxyRes, req, res, target });

      if (!res.headersSent) {
        prepareResponse({ req, res, proxyRes });
      }

      if (res.writableEnded) {
        this.emit('end', { req, res, proxyRes });
      } else {
        // Allow us to listen when the proxy has completed
        proxyRes.on('end', () => {
          this.emit('end', { req, res, proxyRes });
        });
        proxyRes.pipe(res);
      }
    });
  }
}
