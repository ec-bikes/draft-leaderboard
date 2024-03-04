import type { OutgoingPassFunction } from '../types';

/**
 * Array of passes.
 *
 * A `pass` is just a function that is executed on `req, res, options`
 * so that you can easily add new checks while still keeping the base
 * flexible.
 */
export const webOutgoing: OutgoingPassFunction[] = [
  /**
   * If is a HTTP 1.0 request, remove chunk headers
   */
  function removeChunked(req, res, proxyRes) {
    if (req.httpVersion === '1.0') {
      delete proxyRes.headers['transfer-encoding'];
    }
  },

  /**
   * If is a HTTP 1.0 request, set the correct connection header
   * or if connection header not present, then use `keep-alive`
   */
  function setConnection(req, res, proxyRes) {
    if (req.httpVersion === '1.0') {
      proxyRes.headers.connection = req.headers.connection || 'close';
    } else if (req.httpVersion !== '2.0' && !proxyRes.headers.connection) {
      proxyRes.headers.connection = req.headers.connection || 'keep-alive';
    }
  },

  /**
   * Copy headers from proxyResponse to response.
   */
  function writeHeaders(req, res, proxyRes) {
    Object.keys(proxyRes.headers).forEach(function (key) {
      const header = proxyRes.headers[key];
      if (header === undefined) return;
      res.setHeader(String(key).trim(), header);
    });
  },

  /**
   * Set the statusCode from the proxyResponse
   */
  function writeStatusCode(req, res, proxyRes) {
    if (proxyRes.statusMessage) {
      res.statusCode = proxyRes.statusCode || 500;
      res.statusMessage = proxyRes.statusMessage || 'proxy error';
    } else {
      res.statusCode = proxyRes.statusCode || 500;
    }
  },
];
