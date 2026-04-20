// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Libraries extends APIResource {
  /**
   * Creates a new, empty library. A library is the top-level container for assets,
   * albums, people, and faces — most users have exactly one. Only create a new
   * library when the user explicitly asks for a separate container.
   */
  create(body: LibraryCreateParams, options?: RequestOptions): APIPromise<LibraryResponse> {
    return this._client.post('/api/libraries', { body, ...options });
  }

  /**
   * Fetches one library's metadata (name, description, asset count). Use when you
   * already have a specific `library_id`; for enumerating a user's libraries prefer
   * `list_libraries`.
   */
  retrieve(libraryID: string, options?: RequestOptions): APIPromise<LibraryResponse> {
    return this._client.get(path`/api/libraries/${libraryID}`, options);
  }

  /**
   * Updates the `name` and/or `description` of an existing library. Only the fields
   * included in the request body are changed. Library contents (assets, albums,
   * people, faces) are not affected.
   */
  update(
    libraryID: string,
    body: LibraryUpdateParams,
    options?: RequestOptions,
  ): APIPromise<LibraryResponse> {
    return this._client.patch(path`/api/libraries/${libraryID}`, { body, ...options });
  }

  /**
   * Returns every library the user owns (no pagination — users typically have one or
   * a handful). Call this when another tool's `library_id` parameter is required but
   * you don't yet know which libraries exist. A single-library user can usually omit
   * `library_id` on other tools entirely.
   */
  list(options?: RequestOptions): APIPromise<LibraryListResponse> {
    return this._client.get('/api/libraries', options);
  }

  /**
   * Deletes the library and all its associated database records — assets, albums,
   * people, and faces — via cascading foreign-key delete. This is irreversible and
   * should be used only when the user explicitly confirms they want to destroy an
   * entire library.
   *
   * **Does not delete asset files from object storage.** The library's underlying
   * asset files will be orphaned in storage. To purge files as well, call
   * `delete_asset` on each asset first (that endpoint removes both the database
   * record and the stored file), then delete the library.
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

export declare namespace Libraries {
  export {
    type LibraryResponse as LibraryResponse,
    type LibraryListResponse as LibraryListResponse,
    type LibraryCreateParams as LibraryCreateParams,
    type LibraryUpdateParams as LibraryUpdateParams,
  };
}
