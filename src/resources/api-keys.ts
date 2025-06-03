// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class APIKeys extends APIResource {
  /**
   * Creates a new API key for the current user
   */
  create(options?: RequestOptions): APIPromise<APIKeyCreateResponse> {
    return this._client.post('/api-keys/', options);
  }

  /**
   * Retrieves a list of all API keys for the current user
   */
  list(options?: RequestOptions): APIPromise<APIKeyListResponse> {
    return this._client.get('/api-keys/', options);
  }

  /**
   * Deletes a specific API key
   */
  delete(keyID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/api-keys/${keyID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export type APIKeyCreateResponse = Record<string, unknown>;

export type APIKeyListResponse = Array<Record<string, unknown>>;

export declare namespace APIKeys {
  export { type APIKeyCreateResponse as APIKeyCreateResponse, type APIKeyListResponse as APIKeyListResponse };
}
