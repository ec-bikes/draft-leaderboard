import type http from 'http';
import type url from 'url';

export interface ProxyRequestOptions {
  /** Requested URL */
  target: url.Url;
  /** Object with extra headers to be added to target requests */
  headers?: { [header: string]: string };
  /** Timeout (in milliseconds) when proxy receives no response from target. Default: 120000 (2 minutes) */
  proxyTimeout?: number;
  /** Timeout (in milliseconds) for incoming requests */
  timeout?: number;
  method?: string;
}

export type ProxyParams = {
  req: http.IncomingMessage;
  res: http.ServerResponse & { req: ProxyParams['req'] };
  proxyReq: http.ClientRequest;
  proxyRes: http.IncomingMessage & { req: ProxyParams['proxyReq'] };
  options: ProxyRequestOptions;
  err: unknown;
  target: url.Url;
};

export type ProxyEvents = {
  error: [Pick<ProxyParams, 'err' | 'req' | 'res' | 'target'>];
  econnreset: [Pick<ProxyParams, 'err' | 'req' | 'res' | 'target'>];
  proxyReq: [Pick<ProxyParams, 'req' | 'res' | 'proxyReq' | 'options'>];
  proxyRes: [Pick<ProxyParams, 'req' | 'res' | 'proxyReq' | 'proxyRes' | 'target'>];
  start: [Pick<ProxyParams, 'req' | 'res' | 'target'>];
  end: [Pick<ProxyParams, 'req' | 'res' | 'proxyRes'>];
};
