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
  create(body: APIKeyCreateParams, options?: RequestOptions): APIPromise<APIKeyCreateResponse> {
    return this._client.post('/api-keys/', { body, ...options });
  }

  /**
   * Updates the name of a specific API key
   */
  update(keyID: string, body: APIKeyUpdateParams, options?: RequestOptions): APIPromise<APIKeyResponse> {
    return this._client.patch(path`/api-keys/${keyID}`, { body, ...options });
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

/**
 * Represents an API key for authentication (without exposing the actual key).
 */
export interface APIKeyResponse {
  /**
   * Unique API key identifier with 'apikey\_' prefix
   */
  id: string;

  /**
   * When this API key was created
   */
  created_at: string;

  /**
   * Whether this API key is currently valid and can be used
   */
  is_active: boolean;

  /**
   * When this API key was last used for authentication
   */
  last_used_at?: string | null;

  /**
   * Optional descriptive name for this API key
   */
  name?: string | null;
}

/**
 * Response when creating a new API key - includes the actual key value.
 *
 * This is the only time the raw API key is exposed. After creation, only the
 * hashed version is stored and the raw key cannot be retrieved.
 */
export interface APIKeyCreateResponse {
  /**
   * Unique API key identifier with 'apikey\_' prefix
   */
  id: string;

  /**
   * The actual API key value - store this securely as it cannot be retrieved later
   */
  api_key: string;

  /**
   * When this API key was created
   */
  created_at: string;

  /**
   * Whether this API key is currently valid and can be used
   */
  is_active: boolean;

  /**
   * When this API key was last used for authentication
   */
  last_used_at?: string | null;

  /**
   * Optional descriptive name for this API key
   */
  name?: string | null;
}

export type APIKeyListResponse = Array<APIKeyResponse>;

export interface APIKeyCreateParams {
  name: string;
}

export interface APIKeyUpdateParams {
  name: string;
}

export declare namespace APIKeys {
  export {
    type APIKeyResponse as APIKeyResponse,
    type APIKeyCreateResponse as APIKeyCreateResponse,
    type APIKeyListResponse as APIKeyListResponse,
    type APIKeyCreateParams as APIKeyCreateParams,
    type APIKeyUpdateParams as APIKeyUpdateParams,
  };
}
