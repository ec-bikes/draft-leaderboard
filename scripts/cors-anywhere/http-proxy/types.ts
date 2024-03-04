import type http from 'http';
import type url from 'url';
import type stream from 'stream';
import type { ProxyServer } from './ProxyServer';

export interface ProxyServerOptions {
  /** Adds x- forward headers. */
  xfwd?: boolean;
  /** object with extra headers to be added to target requests. */
  headers?: { [header: string]: string };
  /** Timeout (in milliseconds) when proxy receives no response from target. Default: 120000 (2 minutes) */
  proxyTimeout?: number;
  /** Timeout (in milliseconds) for incoming requests */
  timeout?: number;
  /** If set to true, none of the webOutgoing passes are called and it's your responsibility to appropriately return the response by listening and acting on the proxyRes event */
  selfHandleResponse?: boolean;
  /** Once the proxy request is ready, pipe it here instead of to the original request. */
  pipeProxyRequest?: stream.Writable['pipe'];
}

export interface ProxyServerRequestOptions extends ProxyServerOptions {
  target: url.Url;
  method?: string;
}

export type OriginalRequest = http.IncomingMessage;
export type OriginalResponse = http.ServerResponse & { req: OriginalRequest };
export type ProxyRequest = http.ClientRequest;
export type ProxyResponse = http.IncomingMessage & { req: ProxyRequest };

export type IncomingPassFunction = (
  req: OriginalRequest,
  res: OriginalResponse,
  options: ProxyServerRequestOptions,
  server: ProxyServer,
  callback: PassCallback | undefined,
) => void;

export type OutgoingPassFunction = (
  req: OriginalRequest,
  res: OriginalResponse,
  proxyRes: ProxyResponse,
  options: ProxyServerRequestOptions,
) => void;

export type PassCallback = (
  err: unknown,
  req: OriginalRequest,
  res: OriginalResponse,
  url: url.Url,
) => void;

type ProxyErrorCallback = (
  err: unknown,
  req: OriginalRequest,
  res: OriginalResponse,
  target: url.Url,
) => void;

export type ProxyEvents = {
  error: ProxyErrorCallback;
  proxyReq: (
    proxyReq: ProxyRequest,
    req: OriginalRequest,
    res: OriginalResponse,
    options: ProxyServerOptions,
  ) => void;
  proxyRes: (
    proxyRes: ProxyResponse,
    req: OriginalRequest,
    res: OriginalResponse,
    location: url.Url,
  ) => void;
  econnreset: ProxyErrorCallback;
  start: (req: OriginalRequest, res: OriginalResponse, target: url.Url) => void;
  end: (req: OriginalRequest, res: OriginalResponse, proxyRes: OriginalRequest) => void;
};
