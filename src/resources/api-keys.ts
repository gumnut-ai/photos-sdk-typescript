// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';

export class APIKeys extends APIResource {}

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

export declare namespace APIKeys {
  export { type APIKeyResponse as APIKeyResponse };
}
