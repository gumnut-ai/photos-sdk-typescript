// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as AssetsAPI from './assets';
import { APIPromise } from '../core/api-promise';
import { type Uploadable } from '../core/uploads';
import { RequestOptions } from '../internal/request-options';
import { multipartFormRequestOptions } from '../internal/uploads';

export class Search extends APIResource {
  /**
   * Searches for assets using rank fusion across dense visual retrieval and
   * authoritative-metadata full-text retrieval, with typed structured filters on
   * albums, people, and date range. Use this tool when the user describes _what's
   * in_ the photos they want — subjects, scenes, places, activities, moods, objects
   * — optionally narrowed by album, person, date, or location.
   *
   * Prefer typed filters for anything the request states exactly: `album_id` for
   * album membership, `person_ids` for people,
   * `local_datetime_before`/`local_datetime_after` for date ranges, and `center` +
   * `radius` or `bbox` for location. There is no typed camera or place-name filter —
   * pass those terms in the free-text `query`; the metadata full-text stage can
   * match those terms, while dense retrieval adds visual-semantic matches. For
   * example, 'photos of my kids at the beach last summer' becomes
   * `query='kids at the beach'` + `local_datetime_after=2025-06-01` +
   * `local_datetime_before=2025-09-01`.
   *
   * **Use `list_assets` instead** for a plain structured browse that album, person,
   * date-range, location, or asset-ID filters can answer with no content `query` —
   * it's cheaper and more deterministic than semantic search.
   *
   * **Location filtering is by coordinate,** in two mutually-exclusive modes: a
   * radius (`center` + `radius`) or a bounding box (`bbox`).
   *
   * At least one of `query`, `album_id`, `person_ids`, `local_datetime_before`, or
   * `local_datetime_after` must be provided; a location filter only narrows those
   * results and is not a search criterion on its own.
   */
  search(
    query: SearchSearchParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SearchResponse> {
    return this._client.get('/api/search', { query, ...options });
  }

  /**
   * Searches for assets using Reciprocal Rank Fusion across independent dense-text,
   * dense-image, and authoritative-metadata full-text stages plus structured
   * filters. Results include asset metadata, faces, and people. At least one search
   * criterion must be provided. Text and uploaded-image signals stay independent
   * when both are provided. Location filtering is by coordinate in two
   * mutually-exclusive modes: a radius (`center` + `radius`) or a bounding box
   * (`bbox`); it narrows candidates and is not a search criterion on its own.
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

  /**
   * Opt-in per-stage ranks and scores for evaluation attribution.
   */
  debug?: SearchResponse.Debug | null;
}

export namespace SearchResponse {
  /**
   * Opt-in per-stage ranks and scores for evaluation attribution.
   */
  export interface Debug {
    dense_image: Array<Debug.DenseImage>;

    dense_text: Array<Debug.DenseText>;

    fused: Array<Debug.Fused>;

    reranked: Array<Debug.Reranked>;

    reranker: Debug.Reranker;

    selected_ordering: string;

    sparse: Array<Debug.Sparse>;
  }

  export namespace Debug {
    export interface DenseImage {
      asset_id: string;

      distance: number;

      rank: number;
    }

    export interface DenseText {
      asset_id: string;

      distance: number;

      rank: number;
    }

    export interface Fused {
      asset_id: string;

      rank: number;

      score: number;

      dense_image_rank?: number | null;

      dense_text_rank?: number | null;

      sparse_rank?: number | null;
    }

    export interface Reranked {
      asset_id: string;

      fused_rank: number;

      rank: number;

      score: number | null;
    }

    export interface Reranker {
      attempted: boolean;

      duration_ms: number;

      fallback_reason: string | null;

      model_revision: string;

      outcome: string;
    }

    export interface Sparse {
      asset_id: string;

      matched_categories: Array<string>;

      rank: number;

      score: number;
    }
  }
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
   * `min_longitude` exceeds `max_longitude` (antimeridian-crossing) is accepted but
   * matches nothing — split it client-side.
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
   * have multiple.
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
   * pages by number rather than by cursor because it ranks a fixed top-200 fused
   * candidate population by relevance, so pages beyond that population are empty.
   * The sibling `list_assets` cursors with `starting_after_id` over a stable
   * capture-time ordering.
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
   * @deprecated Deprecated compatibility parameter. Accepted and validated during
   * the transition window but ignored because rank-fused results do not have one
   * meaningful cosine-distance cutoff.
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
   * Body param: Return only assets in this album — the album's `album_` ID, not its
   * name.
   */
  album_id?: string | null;

  /**
   * Body param: Bounding-box (map viewport) location filter: four comma-separated
   * decimal-degree numbers `min_longitude,min_latitude,max_longitude,max_latitude`
   * (west,south,east,north), e.g. `-77.1,38.9,-77.0,39.0`. A box whose
   * `min_longitude` exceeds `max_longitude` (antimeridian-crossing) is accepted but
   * matches nothing — split it client-side.
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
   * Body param: Library to search assets from (optional)
   */
  library_id?: string | null;

  /**
   * Body param: Number of results per page (1-200)
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
   * Body param: Page number
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
   * @deprecated Body param: Deprecated compatibility parameter. Accepted and
   * validated but ignored because rank-fused results have no meaningful
   * cosine-distance cutoff.
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
