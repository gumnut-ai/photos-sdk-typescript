// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as AssetsAPI from './assets';
import { APIPromise } from '../core/api-promise';
import { type Uploadable } from '../core/uploads';
import { RequestOptions } from '../internal/request-options';
import { multipartFormRequestOptions } from '../internal/uploads';

export class Search extends APIResource {
  /**
   * Searches for assets using semantic (CLIP-based) image-content matching and/or
   * typed structured filters on albums, people, and date range. Use this tool when
   * the user describes _what's in_ the photos they want — subjects, scenes, places,
   * activities, moods, objects — optionally narrowed by album, person, date, or
   * location.
   *
   * Prefer typed filters for anything the request states exactly: `album_ids` for
   * album membership, `person_ids` for people, `captured_before`/`captured_after`
   * for date ranges, and `center` + `radius` for location. There is no typed camera
   * or place-name filter — pass those terms in the free-text `query`; matching is
   * semantic (CLIP embeddings), not an exact EXIF predicate, so results are
   * best-effort. For example, 'photos of my kids at the beach last summer' becomes
   * `query='kids at the beach'` + `captured_after=2025-06-01` +
   * `captured_before=2025-09-01`.
   *
   * **Use `list_assets` instead** for a plain browse a single exact filter can
   * answer (one album, one person, a date range, or IDs) with no content `query` —
   * it's cheaper and more deterministic than semantic search.
   *
   * Location filtering is by coordinate radius only: pass `center` + `radius`
   * together to keep only assets within that circle (a filter that narrows
   * candidates — the semantic/date ordering is unchanged).
   *
   * At least one of `query`, `album_ids`, `person_ids`, `captured_before`, or
   * `captured_after` must be provided; the radius is an additional filter, not a
   * search criterion on its own.
   */
  search(
    query: SearchSearchParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SearchResponse> {
    return this._client.get('/api/search', { query, ...options });
  }

  /**
   * Searches for assets using semantic similarity and/or metadata filters. Results
   * include asset metadata, faces, and people. At least one search criterion must be
   * provided. Can search by text query, uploaded image, or both combined.
   */
  searchAssets(
    params: SearchSearchAssetsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SearchResponse> {
    const { include, ...body } = params ?? {};
    return this._client.post(
      '/api/search',
      multipartFormRequestOptions({ query: { include }, body, ...options }, this._client),
    );
  }
}

export interface SearchResponse {
  /**
   * Matching assets ordered by semantic distance (closest first) when `query` is
   * set.
   */
  data: Array<SearchResultItem>;
}

export interface SearchResultItem {
  /**
   * The matching asset.
   */
  asset: AssetsAPI.AssetResponse;

  /**
   * Semantic distance from `query` (0.0 = identical, 1.0 = unrelated); lower is more
   * similar — inverted from the usual 'similarity score' convention. Null when no
   * semantic `query` was provided (structured-filter-only search).
   */
  distance: number | null;
}

export interface SearchSearchParams {
  /**
   * Filter to assets in ALL of these album IDs (intersection, not union). Accepts
   * multiple `album_ids=` query params or a single comma-delimited value (e.g.,
   * `album_123,album_abc`). Get album IDs from `list_albums`. Plural on this tool;
   * the sibling `list_assets` uses `album_id` (singular).
   */
  album_ids?: Array<string> | null;

  /**
   * Only include assets captured strictly after this instant (ISO 8601; exclusive).
   * Equivalent in purpose to `local_datetime_after` on `list_assets` (naming
   * inconsistency is tracked as a follow-up).
   */
  captured_after?: string | null;

  /**
   * Only include assets captured strictly before this instant (ISO 8601; exclusive).
   * Equivalent in purpose to `local_datetime_before` on `list_assets` (naming
   * inconsistency is tracked as a follow-up).
   */
  captured_before?: string | null;

  /**
   * Center point of a radius location filter: two comma-separated decimal-degree
   * numbers `longitude,latitude`, e.g. `-77.05,38.95`. Supply with `radius`.
   */
  center?: string | null;

  /**
   * Opt-in expansion fields. Supported values: `metadata` (camera/EXIF/GPS and
   * location names), `faces`, `people`, `metrics` (ML quality scores), `file_data`
   * (a group token populating the nested `file_data` object with the file/provenance
   * scalars `device_asset_id`, `device_id`, `file_created_at`, `file_modified_at`,
   * `checksum`, `checksum_sha1`, `file_size_bytes`), and `variants` (the
   * non-thumbnail `asset_urls` size variants; without it `asset_urls` carries only
   * its lean rung — `thumbnail`, or `thumbnail_image` for a video with an extracted
   * still, or `original` for a still-less video — so callers that render
   * non-thumbnail variants must pass it). Accepts multiple `include=` query params
   * or a single comma-delimited value (e.g. `include=faces,people`). Unknown values
   * return 422. When omitted, only the lean core is returned (`id`, `mime_type`,
   * `local_datetime`, dimensions, `description`, `thumbhash`, `asset_urls`) and each
   * data field above is null/absent until you request it.
   */
  include?: Array<string> | null;

  /**
   * Library to search. Optional if the user has a single library; required when they
   * have multiple. Use `list_libraries` to enumerate available libraries.
   */
  library_id?: string | null;

  /**
   * Maximum number of results per page (1–200). Defaults to 20.
   */
  limit?: number;

  /**
   * 1-indexed page number. `search_assets` uses page-number pagination; the sibling
   * `list_assets` uses cursor pagination via `starting_after_id`. Increment `page`
   * to fetch subsequent pages.
   */
  page?: number;

  /**
   * Filter to assets containing ALL of these person IDs (intersection, not union).
   * Accepts multiple `person_ids=` query params or a single comma-delimited value
   * (e.g., `person_123,person_abc`). Get person IDs from `list_people`. Plural on
   * this tool; the sibling `list_assets` uses `person_id` (singular).
   */
  person_ids?: Array<string> | null;

  /**
   * Natural-language description of the image content to search for. Matched against
   * CLIP image embeddings, so it works best with concrete visual concepts: subjects,
   * scenes, objects, settings ('beach sunset', 'birthday cake', 'mountain hike').
   *
   * Prefer structured params when available: use `album_ids` for albums (not album
   * names in `query`), `person_ids` for people (not names in `query`), and
   * `captured_before`/`captured_after` for dates (not phrases like 'in 2023' in
   * `query`).
   */
  query?: string | null;

  /**
   * Radius of the `center` location filter, in meters (greater than 0, at most
   * 50,000).
   */
  radius?: number | null;

  /**
   * Maximum semantic distance for a result to be included (0.0 = identical, 1.0 =
   * unrelated). Lower values return fewer, more confident matches; higher values
   * return more results with looser matching. Default 0.8 is moderate — try 0.6 for
   * high-precision queries, 0.9 for exploratory searches. **Note:** this is inverted
   * from the usual 'similarity score' convention where higher means more similar.
   */
  threshold?: number;
}

export interface SearchSearchAssetsParams {
  /**
   * Query param: Opt-in expansion fields. Supported values: `metadata`
   * (camera/EXIF/GPS and location names), `faces`, `people`, `metrics` (ML quality
   * scores), `file_data` (a group token populating the nested `file_data` object
   * with the file/provenance scalars `device_asset_id`, `device_id`,
   * `file_created_at`, `file_modified_at`, `checksum`, `checksum_sha1`,
   * `file_size_bytes`), and `variants` (the non-thumbnail `asset_urls` size
   * variants; without it `asset_urls` carries only its lean rung — `thumbnail`, or
   * `thumbnail_image` for a video with an extracted still, or `original` for a
   * still-less video — so callers that render non-thumbnail variants must pass it).
   * Accepts multiple `include=` query params or a single comma-delimited value (e.g.
   * `include=faces,people`). Unknown values return 422. When omitted, only the lean
   * core is returned (`id`, `mime_type`, `local_datetime`, dimensions,
   * `description`, `thumbhash`, `asset_urls`) and each data field above is
   * null/absent until you request it.
   */
  include?: Array<string> | null;

  /**
   * Body param: Filter to assets in ALL of these album IDs (intersection, not
   * union). Accepts multiple `album_ids=` form fields or a single comma-delimited
   * value (e.g., `album_123,album_abc`). Get album IDs from `list_albums`.
   */
  album_ids?: Array<string> | null;

  /**
   * Body param: Filter to only include assets captured after this date (ISO format).
   */
  captured_after?: string | null;

  /**
   * Body param: Filter to only include assets captured before this date (ISO
   * format).
   */
  captured_before?: string | null;

  /**
   * Body param: Center point of a radius location filter: two comma-separated
   * decimal-degree numbers `longitude,latitude`, e.g. `-77.05,38.95`. Supply with
   * `radius`.
   */
  center?: string | null;

  /**
   * Body param: Image file to search for similar assets. Can be combined with text
   * query.
   */
  image?: Uploadable | null;

  /**
   * Body param: Library to search assets from (optional)
   */
  library_id?: string | null;

  /**
   * Body param: Number of results per page (1-200)
   */
  limit?: number;

  /**
   * Body param: Page number
   */
  page?: number;

  /**
   * Body param: Filter to assets containing ALL of these person IDs (intersection,
   * not union). Accepts multiple `person_ids=` form fields or a single
   * comma-delimited value (e.g., `person_123,person_abc`). Get person IDs from
   * `list_people`.
   */
  person_ids?: Array<string> | null;

  /**
   * Body param: The text query to search for. If you want to search for a specific
   * person or set of people, use the person_ids parameter instead.If you want to
   * search for a photos taken during a specific date range, use the captured_before
   * and captured_after parameters instead.
   */
  query?: string | null;

  /**
   * Body param: Radius of the `center` location filter, in meters (greater than 0,
   * at most 50,000).
   */
  radius?: number | null;

  /**
   * Body param: Similarity threshold (lower means more similar)
   */
  threshold?: number;
}

export declare namespace Search {
  export {
    type SearchResponse as SearchResponse,
    type SearchResultItem as SearchResultItem,
    type SearchSearchParams as SearchSearchParams,
    type SearchSearchAssetsParams as SearchSearchAssetsParams,
  };
}
