// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * The authenticated user's profile.
 */
export class Users extends APIResource {
  /**
   * Returns the profile of the authenticated user (the caller). Use this at the
   * start of a session to ground subsequent calls (e.g., to confirm the caller's
   * identity before making destructive changes). This tool does not accept a user
   * ID; it always returns the authenticated caller.
   */
  me(options?: RequestOptions): APIPromise<UserResponse> {
    return this._client.get('/api/users/me', options);
  }
}

/**
 * Represents a user account with profile information.
 */
export interface UserResponse {
  /**
   * Unique user identifier with 'intuser\_' prefix
   */
  id: string;

  /**
   * When this user account was created
   */
  created_at: string;

  /**
   * The user's effective favorite/rating display mode, defaulting to `favorite` when
   * they have never selected one.
   */
  favorite_display_mode: 'favorite' | 'rating';

  /**
   * Whether this user account is currently active
   */
  is_active: boolean;

  /**
   * Whether this user has superuser/admin privileges
   */
  is_superuser: boolean;

  /**
   * Whether the account is marked verified. An internal account flag, not proof of
   * email verification — it can be true even when `email` is null
   */
  is_verified: boolean;

  /**
   * Maximum bytes of assets the user may store
   */
  storage_limit_bytes: number;

  /**
   * Total bytes of assets the user is currently storing
   */
  storage_used_bytes: number;

  /**
   * When this user account was last updated
   */
  updated_at: string;

  /**
   * User's email address
   */
  email?: string | null;

  /**
   * User's first name
   */
  first_name?: string | null;

  /**
   * User's last name
   */
  last_name?: string | null;

  /**
   * User's home timezone as an IANA zone id (e.g. 'America/Los_Angeles'); null until
   * a home zone is captured
   */
  timezone?: string | null;
}

export declare namespace Users {
  export { type UserResponse as UserResponse };
}
