// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../core/pagination';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class People extends APIResource {
  /**
   * Creates a new person. Most people are auto-created by face clustering, so this
   * tool is typically used only when the user explicitly wants to introduce a new
   * identity before any faces are attached.
   *
   * To assign an existing face to an existing person, use `update_face` with the
   * target `person_id`.
   */
  create(body: PersonCreateParams, options?: RequestOptions): APIPromise<PersonResponse> {
    return this._client.post('/api/people', { body, ...options });
  }

  /**
   * Fetches one person's metadata (name, asset count, thumbnail, etc.). Use this
   * when you already have a `person_id`. To find photos that contain this person,
   * use `search_assets` with `person_ids` or `list_assets` with `person_id`.
   */
  retrieve(personID: string, options?: RequestOptions): APIPromise<PersonResponse> {
    return this._client.get(path`/api/people/${personID}`, options);
  }

  /**
   * Updates metadata on an existing person. Only the fields included in the request
   * body are changed. Typical use: assigning a name ('name this face cluster
   * "Alice"') or choosing a better thumbnail.
   *
   * This tool does not move faces between people — use `update_face` with a new
   * `person_id` for that.
   */
  update(personID: string, body: PersonUpdateParams, options?: RequestOptions): APIPromise<PersonResponse> {
    return this._client.patch(path`/api/people/${personID}`, { body, ...options });
  }

  /**
   * Returns a paginated list of people (named identities that group one or more
   * faces), ordered by creation time (newest first). Use this to enumerate who
   * appears in the library, to resolve a user-typed name to a `person_id`, or to
   * find who appears in a specific asset or album.
   *
   * By default only **named** people are returned; pass `name_filter=all` or
   * `name_filter=unnamed` to include clusters that haven't been named yet.
   *
   * To list the underlying faces for a specific person, use `list_faces` with
   * `person_id`.
   *
   * **Pagination** is cursor-based: when `has_more` is true, pass the `id` of the
   * last person in `data` as `starting_after_id` to fetch the next page.
   */
  list(
    query: PersonListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<PersonResponsesCursorPage, PersonResponse> {
    return this._client.getAPIList('/api/people', CursorPage<PersonResponse>, { query, ...options });
  }

  /**
   * Deletes the person. The faces that were attached to this person are not deleted
   * — they become unassigned and will be re-clustered on the next clustering pass.
   *
   * Use `update_face` with `person_id=null` to detach a specific face without
   * deleting the whole person. Use `delete_face` to remove a face detection
   * entirely.
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
   * Number of unique photos this person appears in, or null if not computed
   */
  asset_count?: number | null;

  /**
   * Asset variants from this person's thumbnail face. May be null when embedded in
   * an AssetResponse; use /api/people endpoints for full person data.
   */
  asset_urls?: { [key: string]: PersonResponse.AssetURLs } | null;

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
}

export namespace PersonResponse {
  /**
   * A single image variant with its URL, MIME type, and target width.
   */
  export interface AssetURLs {
    /**
     * MIME type of the served image
     */
    mimetype: string;

    /**
     * URL to fetch this image variant
     */
    url: string;

    /**
     * Target width in pixels (null if unknown)
     */
    width?: number | null;
  }
}

export interface PersonCreateParams {
  /**
   * Optional birth date (ISO 8601 date, YYYY-MM-DD) for this person.
   */
  birth_date?: string | null;

  /**
   * If true, the person is marked as a favorite. Defaults to false.
   */
  is_favorite?: boolean | null;

  /**
   * If true, the person is hidden from default listings. Defaults to false.
   */
  is_hidden?: boolean | null;

  /**
   * Library to create the person in. Optional if the user has a single library;
   * required when they have multiple.
   */
  library_id?: string | null;

  /**
   * Display name for the new person (e.g., 'Alice'). Optional — unnamed people can
   * be named later via `update_person`.
   */
  name?: string | null;

  /**
   * ID of the face to use as this person's thumbnail (with `face_` prefix).
   * Typically set after the person has at least one associated face — get face IDs
   * from `list_faces`.
   */
  thumbnail_face_id?: string | null;
}

export interface PersonUpdateParams {
  /**
   * New birth date (ISO 8601 date). Omit to leave unchanged.
   */
  birth_date?: string | null;

  /**
   * Mark or unmark this person as a favorite. Omit to leave unchanged.
   */
  is_favorite?: boolean | null;

  /**
   * Hide or unhide this person. Omit to leave unchanged.
   */
  is_hidden?: boolean | null;

  /**
   * New display name. Omit to leave unchanged.
   */
  name?: string | null;

  /**
   * New thumbnail face ID for this person. Omit to leave unchanged. Get face IDs
   * from `list_faces`.
   */
  thumbnail_face_id?: string | null;
}

export interface PersonListParams extends CursorPageParams {
  /**
   * Return only people who appear in at least one asset of this album. Useful for
   * 'who is in this album?'.
   */
  album_id?: string | null;

  /**
   * Return only people who have at least one face in this asset. Useful for 'who is
   * in this photo?'.
   */
  asset_id?: string | null;

  /**
   * Look up specific people by ID (max 100; each ID has the `person_` prefix). When
   * set, `name_filter` defaults to `all` so unnamed clusters are included in the
   * lookup.
   */
  ids?: Array<string> | null;

  /**
   * Library to list from. Optional if the user has a single library; required when
   * they have multiple.
   */
  library_id?: string | null;

  /**
   * Filter by name using case-insensitive substring matching. Use this to resolve a
   * user-supplied name like 'Alice' into a `person_id`, then pass that ID into
   * `search_assets.person_ids` or `list_assets.person_id`.
   */
  name?: string | null;

  /**
   * Filter by name status: `named` returns only people with a name; `unnamed`
   * returns only nameless face clusters awaiting a name; `all` returns both.
   * Defaults to `named` (or `all` when `ids` is provided).
   */
  name_filter?: 'named' | 'unnamed' | 'all' | null;
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
