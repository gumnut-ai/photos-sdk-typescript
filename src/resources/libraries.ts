// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Libraries extends APIResource {
  /**
   * Returns details of a specific library owned by the authenticated user.
   */
  retrieve(libraryID: string, options?: RequestOptions): APIPromise<LibraryResponse> {
    return this._client.get(path`/api/libraries/${libraryID}`, options);
  }

  /**
   * Updates the name and/or description of a library owned by the authenticated
   * user.
   */
  update(
    libraryID: string,
    body: LibraryUpdateParams,
    options?: RequestOptions,
  ): APIPromise<LibraryResponse> {
    return this._client.patch(path`/api/libraries/${libraryID}`, { body, ...options });
  }

  /**
   * Returns all libraries owned by the authenticated user.
   */
  list(options?: RequestOptions): APIPromise<LibraryListResponse> {
    return this._client.get('/api/libraries', options);
  }

  /**
   * Deletes a library and all its associated data (assets, albums, people, faces).
   * Cannot delete the user's only library.
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

export interface LibraryUpdateParams {
  description?: string | null;

  name?: string | null;
}

export declare namespace Libraries {
  export {
    type LibraryResponse as LibraryResponse,
    type LibraryListResponse as LibraryListResponse,
    type LibraryUpdateParams as LibraryUpdateParams,
  };
}
