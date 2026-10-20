// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * The authenticated user's profile.
 */
export class Users extends APIResource {
  /**
   * Updates preferences on the authenticated user's own account. Only the fields
   * included in the request body are changed. This endpoint does not accept a user
   * ID; it always updates the authenticated caller. Returns 404, without changing
   * anything, when `immich_library_id` names a library the caller cannot choose; the
   * response is the same whether or not that library exists. `home_country`,
   * `home_subdivision` and `face_detection_preference` can be changed only from a
   * signed-in app session: an API key or OAuth credential that sends any of them
   * gets 403 and nothing changes. Setting `face_detection_preference` to true
   * returns 409, which is not retryable, when automatic face detection is not
   * available for the home region. Declaring such a home region sets the preference
   * to false. Changing these settings keeps face data already stored.
   */
  update(body: UserUpdateParams, options?: RequestOptions): APIPromise<UserResponse> {
    return this._client.patch('/api/users/me', { body, ...options });
  }

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
   * Whether demo-mode person-name presentation is enabled. Defaults to false.
   */
  demo_mode_enabled: boolean;

  /**
   * Whether automatic face detection can be turned on for this user. False when the
   * declared home region is one where it is not offered; `face_detection_preference`
   * is then false and cannot be set to true.
   */
  face_detection_available: boolean;

  /**
   * Whether automatic face detection is on for the libraries this user owns: true is
   * on, false is off, null means the user has not chosen yet. Faces are currently
   * detected automatically when this is true or null.
   */
  face_detection_preference: boolean | null;

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
   * The user's declared home country as an ISO 3166-1 alpha-2 code (e.g. 'US'); null
   * until declared
   */
  home_country?: string | null;

  /**
   * The user's declared home state or province: an ISO 3166-2 code without its
   * country prefix (e.g. 'CA' for US-CA); null when not declared
   */
  home_subdivision?: string | null;

  /**
   * The user's stored preferred library, or null to use the default. Reported as
   * stored: the library may since have been trashed, or the user's access to it may
   * have changed.
   */
  immich_library_id?: string | null;

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

export interface UserUpdateParams {
  /**
   * Enable demo-mode person-name presentation. Omit to leave unchanged; send false
   * to disable. Explicit null is not accepted.
   */
  demo_mode_enabled?: boolean;

  /**
   * Turn automatic face detection on (true) or off (false) for the libraries the
   * user owns. Omit to leave unchanged; explicit null is not accepted. The setting
   * applies to photos processed from then on; face data already stored is kept.
   */
  face_detection_preference?: boolean | null;

  /**
   * Presentation a user prefers for the favorite/rating control.
   *
   * - `favorite`: a heart — filled at the top rating, empty otherwise.
   * - `rating`: a 0-5 star control.
   */
  favorite_display_mode?: 'favorite' | 'rating' | null;

  /**
   * Home country as an uppercase ISO 3166-1 alpha-2 code (e.g. 'US'). Omit to leave
   * unchanged; explicit null is not accepted. Changing the country clears
   * `home_subdivision` unless the same request sets it.
   */
  home_country?: string | null;

  /**
   * Home state or province: an ISO 3166-2 code without its country prefix (e.g. 'CA'
   * for US-CA). Required when the home country is 'US'. Omit to leave unchanged;
   * send `null` to clear it.
   */
  home_subdivision?: string | null;

  /**
   * Preferred library. Must be a live library the caller owns or has the
   * collaborator role in, and that the request's credential can access; any other id
   * returns 404. Omit to leave unchanged; send `null` to clear the preference and
   * use the default.
   */
  immich_library_id?: string | null;
}

export declare namespace Users {
  export { type UserResponse as UserResponse, type UserUpdateParams as UserUpdateParams };
}
