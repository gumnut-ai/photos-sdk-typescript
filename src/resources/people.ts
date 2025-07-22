// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../core/pagination';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class People extends APIResource {
  /**
   * Creates a new person entry.
   */
  create(body: PersonCreateParams, options?: RequestOptions): APIPromise<PersonResponse> {
    return this._client.post('/api/people', { body, ...options });
  }

  /**
   * Retrieves details for a specific person.
   */
  retrieve(personID: string, options?: RequestOptions): APIPromise<PersonResponse> {
    return this._client.get(path`/api/people/${personID}`, options);
  }

  /**
   * Updates the details of a specific person.
   */
  update(personID: string, body: PersonUpdateParams, options?: RequestOptions): APIPromise<PersonResponse> {
    return this._client.patch(path`/api/people/${personID}`, { body, ...options });
  }

  /**
   * Retrieves a paginated list of people, ordered by creation time, descending.
   */
  list(
    query: PersonListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<PersonResponsesCursorPage, PersonResponse> {
    return this._client.getAPIList('/api/people', CursorPage<PersonResponse>, { query, ...options });
  }

  /**
   * Deletes a specific person. Associated faces will have their person_id set to the
   * closest matching person, or null if no one matches.
   */
  delete(personID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/api/people/${personID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export type PersonResponsesCursorPage = CursorPage<PersonResponse>;

/**
 * Represents a person identified through face clustering and recognition.
 */
export interface PersonResponse {
  /**
   * Unique person identifier with 'person\_' prefix
   */
  id: string;

  /**
   * When this person record was created
   */
  created_at: string;

  /**
   * Whether this person is marked as a favorite
   */
  is_favorite: boolean;

  /**
   * Whether this person should be hidden from the UI
   */
  is_hidden: boolean;

  /**
   * When this person record was last updated
   */
  updated_at: string;

  /**
   * Optional birth date of this person
   */
  birth_date?: string | null;

  /**
   * Optional name assigned to this person
   */
  name?: string | null;

  /**
   * ID of the face resource used as this person's thumbnail
   */
  thumbnail_face_id?: string | null;

  /**
   * URL for this person's profile thumbnail image
   */
  thumbnail_face_url?: string | null;
}

export interface PersonCreateParams {
  birth_date?: string | null;

  is_favorite?: boolean | null;

  is_hidden?: boolean | null;

  library_id?: string | null;

  name?: string | null;

  thumbnail_face_id?: string | null;
}

export interface PersonUpdateParams {
  birth_date?: string | null;

  is_favorite?: boolean | null;

  is_hidden?: boolean | null;

  name?: string | null;

  thumbnail_face_id?: string | null;
}

export interface PersonListParams extends CursorPageParams {
  /**
   * Include only people associated with this album ID
   */
  album_id?: string | null;

  /**
   * Include only people associated with this asset ID
   */
  asset_id?: string | null;

  /**
   * Library ID (required if user has multiple libraries)
   */
  library_id?: string | null;
}

export declare namespace People {
  export {
    type PersonResponse as PersonResponse,
    type PersonResponsesCursorPage as PersonResponsesCursorPage,
    type PersonCreateParams as PersonCreateParams,
    type PersonUpdateParams as PersonUpdateParams,
    type PersonListParams as PersonListParams,
  };
}
