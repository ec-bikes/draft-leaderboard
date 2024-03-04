import EventEmitter3 from 'eventemitter3';
import { webPasses } from './passes/web-incoming';
import type {
  ProxyServerOptions,
  OriginalRequest,
  OriginalResponse,
  PassCallback,
  ProxyServerRequestOptions,
  ProxyEvents,
} from './types';

export class ProxyServer extends EventEmitter3 {
  // private _server: http.Server | undefined;

  constructor(private options: ProxyServerOptions) {
    super();
  }

  // listen = (port?: number, hostname?: string) => {
  //   this._server = http.createServer(this.proxyRequest);
  //   this._server.listen(port, hostname);
  // };

  // close = (callback?: (err?: Error) => void) => {
  //   this._server?.close((...args: any[]) => {
  //     this._server = undefined;
  //     callback?.(...args);
  //   });
  // };

  proxyRequest = (
    req: OriginalRequest,
    res: OriginalResponse,
    opts?: ProxyServerRequestOptions,
    callback?: PassCallback,
  ) => {
    const requestOptions = {
      ...this.options,
      ...opts,
    } as ProxyServerRequestOptions;

    for (const pass of webPasses) {
      pass(req, res, requestOptions, this, callback);
    }
  };

  /**
   * Add a listener with proper types.
   * Returns the listener for convenience (like if you want to remove it later).
   *
   * For some events (notably `proxyRes`), returning true from the listener will override
   * the default handling from ProxyServer.
   */
  onEvent = <TEvent extends keyof ProxyEvents>(event: TEvent, listener: ProxyEvents[TEvent]) => {
    this.on(event, listener);
    return listener;
  };

  /** Emit an event with proper types. Returns the result of `this.emit(...)`. */
  emitEvent = <TEvent extends keyof ProxyEvents>(
    event: TEvent,
    ...args: Parameters<ProxyEvents[TEvent]>
  ): boolean => {
    return this.emit(event, ...args);
  };
}
