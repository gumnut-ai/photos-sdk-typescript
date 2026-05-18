// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Libraries extends APIResource {
  /**
   * Creates a new, empty photo library for the authenticated user. A library is the
   * top-level container for assets, albums, people, and faces — most users have
   * exactly one. Only create a new library when the user explicitly asks for a
   * separate container.
   */
  create(body: LibraryCreateParams, options?: RequestOptions): APIPromise<LibraryResponse> {
    return this._client.post('/api/libraries', { body, ...options });
  }

  /**
   * Fetches one library's metadata by ID. Returns the library regardless of trash
   * state.
   */
  retrieve(libraryID: string, options?: RequestOptions): APIPromise<LibraryResponse> {
    return this._client.get(path`/api/libraries/${libraryID}`, options);
  }

  /**
   * Renames a library or changes its description. Only the fields included in the
   * request body are changed. Library contents (assets, albums, people, faces) are
   * not affected.
   */
  update(
    libraryID: string,
    body: LibraryUpdateParams,
    options?: RequestOptions,
  ): APIPromise<LibraryResponse> {
    return this._client.patch(path`/api/libraries/${libraryID}`, { body, ...options });
  }

  /**
   * Returns libraries owned by the authenticated user (no pagination — users
   * typically have one or a handful). Call this when another tool's `library_id`
   * parameter is required but you don't yet know which libraries exist. A
   * single-library user can usually omit `library_id` on other tools entirely.
   *
   * By default trashed libraries are excluded. Pass `state=trashed` to list the
   * trash drawer (ordered by most recently trashed) or `state=all` for both.
   */
  list(
    query: LibraryListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<LibraryListResponse> {
    return this._client.get('/api/libraries', { query, ...options });
  }

  /**
   * Expedites the background purge on a **trashed** library: the 90-day undo window
   * is waived and the drain begins claiming this library on the next scheduled tick.
   * Returns 204 immediately; the drain proceeds asynchronously in bounded batches
   * and does not block on completion. Restore still works until the drain finishes
   * purging all assets, but past this point it will recover only the assets the
   * drain hasn't gotten to yet. Returns 409 if the library has not been trashed yet;
   * trash it first.
   */
  delete(libraryID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/api/libraries/${libraryID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

/**
 * Represents a user's photo library.
 */
export interface LibraryResponse {
  /**
   * Unique library identifier with 'lib\_' prefix
   */
  id: string;

  /**
   * Total number of assets in this library
   */
  asset_count: number;

  /**
   * When this library was created
   */
  created_at: string;

  /**
   * Display name of the library
   */
  name: string;

  /**
   * When this library was last updated
   */
  updated_at: string;

  /**
   * ID of the user who owns this library
   */
  user_id: string;

  /**
   * Optional description text for the library
   */
  description?: string | null;
}

export type LibraryListResponse = Array<LibraryResponse>;

export interface LibraryCreateParams {
  /**
   * Display name for the new library. Required.
   */
  name: string;

  /**
   * Optional free-form description shown alongside the library name.
   */
  description?: string | null;
}

export interface LibraryUpdateParams {
  /**
   * New free-form description for the library. Omit to leave unchanged.
   */
  description?: string | null;

  /**
   * New display name for the library. Omit to leave unchanged.
   */
  name?: string | null;
}

export interface LibraryListParams {
  /**
   * Which set of libraries to return: `live` (default — excludes trashed), `trashed`
   * (only trashed, ordered by most recently trashed), or `all` (both).
   */
  state?: 'live' | 'trashed' | 'all';
}

export declare namespace Libraries {
  export {
    type LibraryResponse as LibraryResponse,
    type LibraryListResponse as LibraryListResponse,
    type LibraryCreateParams as LibraryCreateParams,
    type LibraryUpdateParams as LibraryUpdateParams,
    type LibraryListParams as LibraryListParams,
  };
}
