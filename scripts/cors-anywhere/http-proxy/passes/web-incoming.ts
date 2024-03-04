import http from 'http';
import https from 'https';
import { webOutgoing } from './web-outgoing';
import { getPort, hasEncryptedConnection, setupOutgoing } from '../common';
import type { IncomingPassFunction, ProxyResponse } from '../types';

/**
 * Array of passes.
 *
 * A `pass` is just a function that is executed on `req, res, options`
 * so that you can easily add new checks while still keeping the base
 * flexible.
 */
export const webPasses: IncomingPassFunction[] = [
  /**
   * Sets `content-length` to '0' if request is of OPTIONS type.
   */
  function deleteLength(req) {
    if (req.method === 'OPTIONS' && !req.headers['content-length']) {
      req.headers['content-length'] = '0';
      delete req.headers['transfer-encoding'];
    }
  },

  /**
   * Sets timeout in request socket if it was specified in options.
   */
  function timeout(req, res, options) {
    if (options.timeout) {
      req.socket.setTimeout(options.timeout);
    }
  },

  /**
   * Sets `x-forwarded-*` headers if specified in config.
   */
  function XHeaders(req, res, options) {
    if (!options.xfwd) return;

    const values = {
      for: req.socket.remoteAddress,
      port: getPort(req),
      proto: hasEncryptedConnection(req) ? 'https' : 'http',
    };

    for (const header of ['for', 'port', 'proto'] as const) {
      const oldValue = req.headers['x-forwarded-' + header];
      req.headers['x-forwarded-' + header] = (oldValue ? oldValue + ',' : '') + values[header];
    }

    req.headers['x-forwarded-host'] ||= req.headers['host'] || '';
  },

  /**
   * Does the actual proxying.
   */
  function stream(req, res, options, server, callback) {
    // And we begin!
    server.emitEvent('start', req, res, options.target);

    // Request initalization
    // (need to use https here if the user-requested target URL is https)
    const proxyReq = (options.target.protocol === 'https:' ? https : http).request(
      setupOutgoing(options, req),
    );

    // Enable developers to modify the proxyReq before headers are sent
    proxyReq.on('socket', function () {
      if (!proxyReq.getHeader('expect')) {
        server.emitEvent('proxyReq', proxyReq, req, res, options);
      }
    });

    // allow outgoing socket to timeout so that we could
    // show an error page at the initial request
    if (options.proxyTimeout) {
      proxyReq.setTimeout(options.proxyTimeout, function () {
        proxyReq.destroy();
      });
    }

    // Ensure we abort proxy if request is aborted
    req.on('aborted', function () {
      proxyReq.destroy();
    });

    // handle errors in proxy and incoming request, just like for forward proxy
    const proxyError = function proxyError(err: unknown) {
      if (req.socket.destroyed && (err as any).code === 'ECONNRESET') {
        server.emitEvent('econnreset', err, req, res, options.target);
        return proxyReq.destroy();
      }

      if (callback) {
        callback(err, req, res, options.target);
      } else {
        server.emitEvent('error', err, req, res, options.target);
      }
    };
    req.on('error', proxyError);
    proxyReq.on('error', proxyError);

    req.pipe(proxyReq);

    proxyReq.on('response', function (_res) {
      const proxyRes = _res as ProxyResponse;
      server.emitEvent('proxyRes', proxyReq, proxyRes, req, res, options.target);

      if (!res.headersSent) {
        for (const outgoing of webOutgoing) {
          outgoing(req, res, proxyRes, options);
        }
      }

      if (!res.writableEnded) {
        // Allow us to listen when the proxy has completed
        proxyRes.on('end', function () {
          server.emitEvent('end', req, res, proxyRes);
        });
        proxyRes.pipe(res);
      } else {
        server.emitEvent('end', req, res, proxyRes);
      }
    });
  },
];
