// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';

export class Ping extends APIResource {
  /**
   * Unauthenticated health-check endpoint for uptime monitoring. Returns 'pong'.
   */
  get(options?: RequestOptions): APIPromise<string> {
    return this._client.get('/api/server/ping', {
      ...options,
      headers: buildHeaders([{ Accept: 'text/plain' }, options?.headers]),
    });
  }
}

export type PingGetResponse = string;

export declare namespace Ping {
  export { type PingGetResponse as PingGetResponse };
}
