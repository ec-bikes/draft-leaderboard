import type http from 'http';
import type url from 'url';

export interface CorsAnywhereOptions {
  /** If set, an Access-Control-Max-Age header with this value (in seconds) will be added */
  corsMaxAge?: number;
  /** Strip these request headers */
  removeHeaders?: string[];
  /** Set these request headers */
  setHeaders?: Record<string, string>;
}

export interface CorsAnywhereRequestState
  extends Required<Pick<CorsAnywhereOptions, 'corsMaxAge'>> {
  /** Base URL of the CORS API endpoint */
  proxyBaseUrl: string;
  location: url.Url;
  corsHeaders: http.IncomingHttpHeaders;
}

/** Incoming HTTP request, augmented with property corsAnywhereRequestState */
export type CorsServerRequest = http.IncomingMessage & {
  corsAnywhereRequestState: CorsAnywhereRequestState;
};
