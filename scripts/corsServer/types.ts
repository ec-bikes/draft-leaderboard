import type http from 'http';

/** Params used by various internal methods */
export type ProxyParams = {
  req: http.IncomingMessage;
  res: http.ServerResponse & { req: ProxyParams['req'] };
  proxyReq: http.ClientRequest;
  proxyRes: http.IncomingMessage & { req: ProxyParams['proxyReq'] };
};

/** Event types emitted by CorsProxyServer */
export type ProxyEvents = {
  error: [Pick<ProxyParams, 'req' | 'res'> & { err: unknown }];
};
