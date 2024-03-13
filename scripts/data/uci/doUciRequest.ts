import fetch, { type RequestInit } from 'node-fetch';
import { formatQueryParams } from '../../../common/uciUrls.js';
import { logWarning } from '../../log.js';

/** Response from UCI APIs taking POST requests with paging */
interface UciApiResult<T> {
  data: T[];
  total: number;
}

const pageSize = 40;

/**
 * Do a request to a UCI API with paging.
 * Returns the result array or an error string.
 */
export async function doUciRequest<TResult>(params: {
  url: string;
  /** Body data for POST request. Assumes a GET request if not set. */
  postData?: Record<string, string | number>;
  /** Limit on number of items to fetch (default infinity) */
  limit?: number;
  /** If true, assume the response is a complete array of items (not paged) */
  isPlainArray?: boolean;
  isRetry?: boolean;
}): Promise<TResult[] | string> {
  const { url, postData, limit = Infinity, isPlainArray, isRetry } = params;
  let data: TResult[] = [];

  // Get multiple pages if needed, up to the limit, or until all data is fetched.
  // (the loop includes some breaks internally)
  for (let page = 1; data.length < limit; page++) {
    let requestInit: RequestInit;
    if (postData) {
      requestInit = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: formatQueryParams({
          ...postData,
          take: pageSize,
          skip: (page - 1) * pageSize,
          page,
          pageSize,
        }),
      };
    } else {
      requestInit = { method: 'GET' };
    }
    // time out after 10s
    requestInit.signal = AbortSignal.timeout(10000);
    const requestDesc = `${requestInit.method} ${url} ${requestInit.body || ''}`;

    try {
      const result = await fetch(url, requestInit);
      if (!result.ok) {
        return `Got ${result.status} ${result.statusText} for ${requestDesc}`;
      }

      const text = await result.text();
      const json = JSON.parse(text);
      if (isPlainArray) {
        // for a plain array response, there's just one page, so stop now
        data = json;
        break;
      }

      // add this page's data and stop if there's no more
      const pageData = json as UciApiResult<TResult>;
      data = data.concat(pageData.data);
      if (data.length >= pageData.total) {
        break;
      }
    } catch (err) {
      let message: string;
      if (err instanceof SyntaxError) {
        message = `Got a non-JSON response (probably an error page) from ${requestDesc}`;
      } else {
        message = `Error while requesting ${requestDesc} - ${(err as Error).message || err}`;
      }

      if (isRetry) {
        return message;
      }
      logWarning(`⚠️ First fetch attempt failed (will retry): ${message}`);
      return doUciRequest({ ...params, isRetry: true });
    }
  }

  return data;
}
