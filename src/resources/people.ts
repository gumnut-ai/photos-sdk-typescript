// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../core/pagination';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class People extends APIResource {
  /**
   * Creates a new person record (a named identity for grouping faces). Most people
   * are auto-created by face clustering, so this tool is typically used only when
   * the user explicitly wants to introduce a new identity before any faces are
   * attached.
   *
   * To assign an existing face to an existing person, use `update_face` with the
   * target `person_id`.
   */
  create(body: PersonCreateParams, options?: RequestOptions): APIPromise<PersonResponse> {
    return this._client.post('/api/people', { body, ...options });
  }

  /**
   * Fetches one person's metadata by ID (name, asset count, thumbnail, etc.). Use
   * this when you already have a `person_id`. The JSON response is metadata only; to
   * get the photos that contain this person, use `search_assets` with `person_ids`
   * or `list_assets` with `person_ids`.
   */
  retrieve(
    personID: string,
    query: PersonRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PersonResponse> {
    return this._client.get(path`/api/people/${personID}`, { query, ...options });
  }

  /**
   * Updates a person's name, birth date, visibility, or thumbnail. Only the fields
   * included in the request body are changed. Typical use: assigning a name ('name
   * this face cluster "Alice"') or choosing a better thumbnail.
   *
   * This tool does not move faces between people — use `update_face` with a new
   * `person_id` for that.
   */
  update(personID: string, body: PersonUpdateParams, options?: RequestOptions): APIPromise<PersonResponse> {
    return this._client.patch(path`/api/people/${personID}`, { body, ...options });
  }

  /**
   * Returns a paginated list of people (named identities that group one or more
   * faces), ordered according to `sort` (newest first by default), optionally
   * filtered by asset, album, name, or ID. Use this to enumerate who appears in the
   * library, to resolve a user-typed name to a `person_id`, or to find who appears
   * in a specific asset or album.
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
   * Deletes the person record; the faces that were attached to this person are not
   * deleted — they become unassigned and will be re-clustered on the next clustering
   * pass.
   *
   * Use `update_face` with `person_id=null` to detach a specific face without
   * deleting the whole person. Use `delete_face` to remove a face detection
   * entirely.
   *
   * If a concurrent change to the person's faces collides with the deletion, it
   * returns 409 and nothing is deleted; retry the request unchanged.
   */
  delete(personID: string, options?: RequestOptions): APIPromise<PersonDeleteResponse> {
    return this._client.delete(path`/api/people/${personID}`, options);
  }

  /**
   * Merges one or more source people into the primary person identified by the URL.
   * All faces from source people are reassigned to the primary person. Source people
   * are permanently deleted (this cannot be undone). The primary person's centroid
   * embedding is recalculated.
   *
   * In the degenerate case where the primary and all sources are unnamed and have
   * zero faces, the primary is auto-deleted by the post-merge centroid recompute
   * (GUM-681) and the response is `204 No Content`.
   */
  merge(personID: string, body: PersonMergeParams, options?: RequestOptions): APIPromise<PersonResponse> {
    return this._client.post(path`/api/people/${personID}/merge`, { body, ...options });
  }
}

export type PersonResponsesCursorPage = CursorPage<PersonResponse>;

/**
 * Cohesion metrics for a Person's face cluster — surfaced via
 * `include=cluster_metrics` on the people endpoints. These describe how tight the
 * cluster is in embedding space (lower = more cohesive) and drive both the
 * production face-assignment cohesion gate and the operator-facing face cleanup
 * dashboard.
 */
export interface ClusterMetricsResponse {
  /**
   * Number of faces that fed into the centroid and pairwise metrics. This is the
   * cluster-membership count, **not** the same as `asset_count` — `face_count`
   * counts every face row, while `asset_count` counts distinct assets (one asset can
   * contribute multiple faces of the same person).
   */
  face_count: number;

  /**
   * Mean pairwise cosine distance between faces in this person's cluster.
   */
  pairwise_mean: number;

  /**
   * 90th-percentile pairwise cosine distance between faces in this person's cluster.
   * Lower = more cohesive cluster; loose clusters (higher pairwise_p90) are gated
   * out of the face-assignment path to prevent further drift.
   */
  pairwise_p90: number;
}

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
  asset_urls?: { [key: string]: Shared.AssetVariant } | null;

  /**
   * Optional birth date of this person
   */
  birth_date?: string | null;

  /**
   * Cohesion metrics for a Person's face cluster — surfaced via
   * `include=cluster_metrics` on the people endpoints. These describe how tight the
   * cluster is in embedding space (lower = more cohesive) and drive both the
   * production face-assignment cohesion gate and the operator-facing face cleanup
   * dashboard.
   */
  cluster_metrics?: ClusterMetricsResponse | null;

  /**
   * Optional name assigned to this person
   */
  name?: string | null;

  /**
   * ID of the face resource used as this person's thumbnail
   */
  thumbnail_face_id?: string | null;
}

/**
 * Acknowledgment body returned by destructive endpoints (delete / trash / restore
 * / permanently delete / remove-from-album / empty-trash).
 *
 * Carries no fields — the HTTP 200 + empty JSON object is itself the success
 * signal. Exists so MCP tools generated from these endpoints have a real
 * `outputSchema` (rather than the null schema FastMCP emits for 204 responses),
 * which ChatGPT's MCP submission tooling requires.
 */
export interface PersonDeleteResponse {}

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
   * ID of the face to use as this person's thumbnail (with `face_` prefix). Carried
   * by the entries of an asset's `faces` field (returned with `include=faces`). The
   * face need not already be assigned to a person.
   */
  thumbnail_face_id?: string | null;
}

export interface PersonRetrieveParams {
  /**
   * Opt-in expansion fields. See `list_people` for supported values. Accepts
   * multiple `include=` query params or a single comma-delimited value.
   */
  include?: Array<string> | null;
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
   * New thumbnail face ID for this person. Omit to leave unchanged. Enumerate a
   * person's faces with `list_faces` and `person_id`.
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
   * Look up specific people by ID (max 200; each ID has the `person_` prefix).
   * Accepts multiple `ids=` query params or a single comma-delimited value (e.g.,
   * `ids=person_1,person_2`). When set, `name_filter` defaults to `all` so unnamed
   * clusters are included in the lookup.
   */
  ids?: Array<string> | null;

  /**
   * Opt-in expansion fields. Supported values: `cluster_metrics` (adds the nested
   * `cluster_metrics` object — `pairwise_p90`, `pairwise_mean`, `face_count` — for
   * each Person with a populated centroid). Accepts multiple `include=` query params
   * or a single comma-delimited value. Unknown values return 422.
   */
  include?: Array<string> | null;

  /**
   * Library to list from. Optional if the user has a single library; required when
   * they have multiple.
   */
  library_id?: string | null;

  /**
   * Filter by name using case-insensitive substring matching. Use this to resolve a
   * user-supplied name like 'Alice' into a `person_id`, then pass that ID into
   * `search_assets.person_ids` or `list_assets.person_ids`.
   */
  name?: string | null;

  /**
   * Filter by name status: `named` returns only people with a name; `unnamed`
   * returns only nameless face clusters awaiting a name; `all` returns both.
   * Defaults to `named` (or `all` when `ids` is provided).
   */
  name_filter?: 'named' | 'unnamed' | 'all' | null;

  /**
   * Sort order for results: `created_at_desc` (newest people first; default) /
   * `created_at_asc`, `name_asc` / `name_desc` (alphabetical by name, locale-aware;
   * unnamed people always sort last), or `asset_count_desc` / `asset_count_asc` (by
   * number of photos the person appears in). Name sorts cannot be combined with
   * `name_filter=unnamed`.
   */
  sort?:
    | 'created_at_desc'
    | 'created_at_asc'
    | 'name_asc'
    | 'name_desc'
    | 'asset_count_desc'
    | 'asset_count_asc';
}

export interface PersonMergeParams {
  /**
   * IDs of the people to merge into the primary person. These people will be deleted
   * after their faces are moved.
   */
  source_person_ids: Array<string>;
}

export declare namespace People {
  export {
    type ClusterMetricsResponse as ClusterMetricsResponse,
    type PersonResponse as PersonResponse,
    type PersonDeleteResponse as PersonDeleteResponse,
    type PersonResponsesCursorPage as PersonResponsesCursorPage,
    type PersonCreateParams as PersonCreateParams,
    type PersonRetrieveParams as PersonRetrieveParams,
    type PersonUpdateParams as PersonUpdateParams,
    type PersonListParams as PersonListParams,
    type PersonMergeParams as PersonMergeParams,
  };
}
