// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as AssetsAPI from './assets/assets';
import { APIPromise } from '../core/api-promise';
import { type Uploadable } from '../core/uploads';
import { RequestOptions } from '../internal/request-options';
import { multipartFormRequestOptions } from '../internal/uploads';

/**
 * Content-based search over a library's assets, with album, person, date, and location filters.
 */
export class Search extends APIResource {
  /**
   * Searches for assets by content, by typed structured filters on albums, people,
   * date range, and location, or both. Content searches are ranked by relevance;
   * filter-only searches return matches newest-first. Use this tool when the user
   * describes _what's in_ the photos they want — subjects, scenes, places,
   * activities, moods, objects — optionally narrowed by album, person, rating, date,
   * or location.
   *
   * Prefer typed filters for anything the request states exactly: `album_id` for
   * album membership, `person_ids` for people, `ratings` for exact effective
   * ratings, `local_datetime_before`/`local_datetime_after` for date ranges, and
   * `center` + `radius` or `bbox` for location. There is no typed camera or
   * place-name filter — pass those terms in the free-text `query`; the metadata
   * full-text stage can match those terms, while dense retrieval adds
   * visual-semantic matches. For example, 'photos of my kids at the beach last
   * summer' becomes `query='kids at the beach'` +
   * `local_datetime_after=2025-06-01` + `local_datetime_before=2025-09-01`.
   *
   * **Use `list_assets` instead** for a plain structured browse that album, person,
   * rating, media-type, date-range, location, or asset-ID filters can answer with no
   * content `query` — it's cheaper and more deterministic than semantic search.
   * There is no media-type filter here, so 'show me all my videos' is a
   * `list_assets` browse with `media_type=video`.
   *
   * **Location filtering is by coordinate,** in two mutually-exclusive modes: a
   * radius (`center` + `radius`) or a bounding box (`bbox`).
   *
   * At least one of `query`, `album_id`, `person_ids`, `ratings`,
   * `local_datetime_before`, or `local_datetime_after` must be provided; a location
   * filter only narrows those results and is not a search criterion on its own.
   */
  search(
    query: SearchSearchParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SearchResponse> {
    return this._client.get('/api/search', { query, ...options });
  }

  /**
   * Searches for assets by content, by typed structured filters on albums, people,
   * date range, and location, or both. Content searches are ranked by relevance;
   * filter-only searches return matches newest-first. An uploaded `image` adds
   * visual-similarity search; text and uploaded-image signals stay independent when
   * both are provided.
   *
   * At least one search criterion, including `ratings`, must be provided. Location
   * filtering is by coordinate in two mutually-exclusive modes: a radius (`center` +
   * `radius`) or a bounding box (`bbox`); it narrows candidates and is not a search
   * criterion on its own.
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
   * Text-query matches use the configured reranker over the first 50 Reciprocal Rank
   * Fusion candidates, with fail-open RRF ordering. Image-only matches use RRF
   * across available stages. Structured-filter-only searches retain newest-first
   * capture-date ordering.
   */
  data: Array<SearchResultItem>;
}

export interface SearchResultItem {
  /**
   * The matching asset.
   */
  asset: AssetsAPI.AssetResponse;

  /**
   * Best available dense-stage cosine distance (lower is more similar). This is
   * attribution only: text results use reranker order when reranking succeeds and
   * RRF order on fallback; image-only results use RRF. Results are never ordered by
   * this distance. Null for sparse-only and structured-filter-only matches.
   */
  distance: number | null;
}

export interface SearchSearchParams {
  /**
   * Return only assets in this album — the album's `album_` ID, not its name.
   */
  album_id?: string | null;

  /**
   * Bounding-box (map viewport) location filter: four comma-separated decimal-degree
   * numbers `min_longitude,min_latitude,max_longitude,max_latitude`
   * (west,south,east,north), e.g. `-77.1,38.9,-77.0,39.0`. A box whose
   * `min_longitude` exceeds `max_longitude` crosses the antimeridian: it selects the
   * band running east from `min_longitude` over ±180° to `max_longitude`, so there
   * is no need to split it client-side. Longitude order is therefore significant —
   * transposed corners read as a crossing viewport, not as an error. A viewport 360°
   * or wider must be sent as the full range `-180,...,180,...`, which the wrapped
   * form cannot express.
   */
  bbox?: string | null;

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
   * `checksum`, `checksum_sha1`, `file_size_bytes`), and `variants` (every
   * `asset_urls` rung beyond the lean one. Without it `asset_urls` carries only its
   * lean rung — `thumbnail` for an image, or `thumbnail_image` for a video — so
   * callers that render non-thumbnail variants or download the current rendering
   * must pass it). Accepts multiple `include=` query params or a single
   * comma-delimited value (e.g. `include=faces,people`). Unknown values return 422.
   * When omitted, only the lean core is returned (`id`, `mime_type`,
   * `local_datetime`, dimensions, `description`, `thumbhash`, `asset_urls`, `kind`,
   * `current_version_id`) and each data field above is null/absent until you request
   * it.
   */
  include?: Array<string> | null;

  /**
   * Library to search. Optional if the user has a single live (non-trashed) library;
   * required when they have multiple.
   */
  library_id?: string | null;

  /**
   * Maximum number of results per page (1–200). Defaults to 20.
   */
  limit?: number;

  /**
   * Only include assets captured strictly after this instant (ISO 8601; exclusive).
   * Convert a relative or natural-language date phrase ('in 2023') into an explicit
   * bound before sending. `local_datetime` is the photo's wall-clock time in the
   * device's own timezone. Naive values compare directly against `local_datetime`.
   * Timezone-aware values: assets with a known offset are compared in UTC
   * (`local_datetime - offset`); assets without an offset fall back to wall-clock
   * comparison against `local_datetime`.
   */
  local_datetime_after?: string | null;

  /**
   * Only include assets captured strictly before this instant (ISO 8601; exclusive).
   * Same conversion requirement and awareness/offset semantics as
   * `local_datetime_after`.
   */
  local_datetime_before?: string | null;

  /**
   * 1-indexed page number; increment it to fetch subsequent pages. `search_assets`
   * pages by number rather than by cursor. A search with a content criterion ranks a
   * fixed top-200 candidate population by relevance, so pages beyond that population
   * are empty. A structured-filter-only search (album, people, date range — no
   * content criterion) returns the full matching set newest-first, paginated without
   * that cap.
   */
  page?: number;

  /**
   * Filter to assets containing ALL of these person IDs (intersection, not union).
   * Accepts multiple `person_ids=` query params or a single comma-delimited value
   * (e.g., `person_123,person_abc`). Person IDs are carried by the entries of an
   * asset's `people` field (returned with `include=people`).
   */
  person_ids?: Array<string> | null;

  /**
   * Natural-language search text. It runs independently through dense visual
   * retrieval and authoritative-metadata full-text retrieval, then the ranked lists
   * are fused. Concrete visual concepts work well in the dense stage, while exact
   * metadata terms can match through full-text search.
   *
   * Resolve album and people names to IDs and pass them as `album_id` and
   * `person_ids`; convert date phrases like 'in 2023' into ISO 8601 bounds on
   * `local_datetime_after`/`local_datetime_before` (here, `2023-01-01` and
   * `2024-01-01`). None of those belong in `query`.
   */
  query?: string | null;

  /**
   * Radius of the `center` location filter, in meters (greater than 0, at most
   * 50,000).
   */
  radius?: number | null;

  /**
   * Return assets whose effective rating is one of these exact values. Values must
   * be integers from `0` through `5`; `5` is a favorite. `0` matches every unrated
   * form: an explicit zero, a null or legacy out-of-range effective rating, or an
   * asset with no metadata. Accepts repeated `ratings=` parameters or one
   * comma-delimited value. Omit the parameter for no rating filter.
   */
  ratings?: Array<number> | null;
}

export interface SearchSearchAssetsParams {
  /**
   * Query param: Opt-in expansion fields. Supported values: `metadata`
   * (camera/EXIF/GPS and location names), `faces`, `people`, `metrics` (ML quality
   * scores), `file_data` (a group token populating the nested `file_data` object
   * with the file/provenance scalars `device_asset_id`, `device_id`,
   * `file_created_at`, `file_modified_at`, `checksum`, `checksum_sha1`,
   * `file_size_bytes`), and `variants` (every `asset_urls` rung beyond the lean one.
   * Without it `asset_urls` carries only its lean rung — `thumbnail` for an image,
   * or `thumbnail_image` for a video — so callers that render non-thumbnail variants
   * or download the current rendering must pass it). Accepts multiple `include=`
   * query params or a single comma-delimited value (e.g. `include=faces,people`).
   * Unknown values return 422. When omitted, only the lean core is returned (`id`,
   * `mime_type`, `local_datetime`, dimensions, `description`, `thumbhash`,
   * `asset_urls`, `kind`, `current_version_id`) and each data field above is
   * null/absent until you request it.
   */
  include?: Array<string> | null;

  /**
   * Body param: Return only assets in this album — the album's `album_` ID, not its
   * name.
   */
  album_id?: string | null;

  /**
   * Body param: Bounding-box (map viewport) location filter: four comma-separated
   * decimal-degree numbers `min_longitude,min_latitude,max_longitude,max_latitude`
   * (west,south,east,north), e.g. `-77.1,38.9,-77.0,39.0`. A box whose
   * `min_longitude` exceeds `max_longitude` crosses the antimeridian: it selects the
   * band running east from `min_longitude` over ±180° to `max_longitude`, so there
   * is no need to split it client-side. Longitude order is therefore significant —
   * transposed corners read as a crossing viewport, not as an error. A viewport 360°
   * or wider must be sent as the full range `-180,...,180,...`, which the wrapped
   * form cannot express.
   */
  bbox?: string | null;

  /**
   * Body param: Center point of a radius location filter: two comma-separated
   * decimal-degree numbers `longitude,latitude`, e.g. `-77.05,38.95`. Supply with
   * `radius`.
   */
  center?: string | null;

  /**
   * Body param: Image file for an independent dense-image retrieval stage. When text
   * is also provided, the stage ranks are fused rather than blending their
   * embeddings.
   */
  image?: Uploadable | null;

  /**
   * Body param: Library to search. Optional if the user has a single live
   * (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;

  /**
   * Body param: Maximum number of results per page (1–200). Defaults to 20.
   */
  limit?: number;

  /**
   * Body param: Only include assets captured strictly after this instant (ISO 8601;
   * exclusive). Convert a relative or natural-language date phrase ('in 2023') into
   * an explicit bound before sending. `local_datetime` is the photo's wall-clock
   * time in the device's own timezone. Naive values compare directly against
   * `local_datetime`. Timezone-aware values: assets with a known offset are compared
   * in UTC (`local_datetime - offset`); assets without an offset fall back to
   * wall-clock comparison against `local_datetime`.
   */
  local_datetime_after?: string | null;

  /**
   * Body param: Only include assets captured strictly before this instant (ISO 8601;
   * exclusive). Same conversion requirement and awareness/offset semantics as
   * `local_datetime_after`.
   */
  local_datetime_before?: string | null;

  /**
   * Body param: 1-indexed page number; increment it to fetch subsequent pages.
   * `search_assets` pages by number rather than by cursor. A search with a content
   * criterion ranks a fixed top-200 candidate population by relevance, so pages
   * beyond that population are empty. A structured-filter-only search (album,
   * people, date range — no content criterion) returns the full matching set
   * newest-first, paginated without that cap.
   */
  page?: number;

  /**
   * Body param: Filter to assets containing ALL of these person IDs (intersection,
   * not union). Accepts multiple `person_ids=` form fields or a single
   * comma-delimited value (e.g., `person_123,person_abc`). Person IDs are carried by
   * the entries of an asset's `people` field (returned with `include=people`).
   */
  person_ids?: Array<string> | null;

  /**
   * Body param: Natural-language search text, matched against image embeddings and
   * authoritative metadata. Album and people names belong in `album_id` and
   * `person_ids`, and date ranges in `local_datetime_before`/`local_datetime_after`,
   * not here.
   */
  query?: string | null;

  /**
   * Body param: Radius of the `center` location filter, in meters (greater than 0,
   * at most 50,000).
   */
  radius?: number | null;

  /**
   * Body param: Return assets whose effective rating is one of these exact values.
   * Values must be integers from `0` through `5`; `5` is a favorite. `0` matches
   * every unrated form: an explicit zero, a null or legacy out-of-range effective
   * rating, or an asset with no metadata. Accepts repeated `ratings=` parameters or
   * one comma-delimited value. Omit the parameter for no rating filter.
   */
  ratings?: Array<number> | null;
}

export declare namespace Search {
  export {
    type SearchResponse as SearchResponse,
    type SearchResultItem as SearchResultItem,
    type SearchSearchParams as SearchSearchParams,
    type SearchSearchAssetsParams as SearchSearchAssetsParams,
  };
}
