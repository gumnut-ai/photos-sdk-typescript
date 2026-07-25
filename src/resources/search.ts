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
   * Prefer typed filters for anything the request states exactly: `album_ids` for
   * album membership, `person_ids` for people, `captured_before`/`captured_after`
   * for date ranges, and `center` + `radius` or `bbox` for location. There is no
   * typed camera or place-name filter — pass those terms in the free-text `query`;
   * the metadata full-text stage can match those terms, while dense retrieval adds
   * visual-semantic matches. For example, 'photos of my kids at the beach last
   * summer' becomes `query='kids at the beach'` + `captured_after=2025-06-01` +
   * `captured_before=2025-09-01`.
   *
   * **Use `list_assets` instead** for a plain structured browse that album, person,
   * date-range, location, or asset-ID filters can answer with no content `query` —
   * it's cheaper and more deterministic than semantic search.
   *
   * **Location filtering is by coordinate,** matching `list_assets`, in two
   * mutually-exclusive modes: a radius (`center` + `radius`) keeps assets within
   * that circle, or a bounding box (`bbox`) keeps assets inside that map viewport.
   * Either is a filter that narrows candidates — the semantic/date ordering is
   * unchanged.
   *
   * At least one of `query`, `album_ids`, `person_ids`, `captured_before`, or
   * `captured_after` must be provided; the location filter is an additional filter,
   * not a search criterion on its own.
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
   * For text or image search, matching assets are ordered by Reciprocal Rank Fusion
   * across the available dense and sparse stages. Structured-filter-only searches
   * retain newest-first capture-date ordering.
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
   * attribution only: results are ordered by fused rank, not distance. Null for
   * sparse-only and structured-filter-only matches.
   */
  distance: number | null;
}

export interface SearchSearchParams {
  /**
   * Filter to assets in ALL of these album IDs (intersection, not union). Accepts
   * multiple `album_ids=` query params or a single comma-delimited value (e.g.,
   * `album_123,album_abc`). Plural on this tool; the sibling `list_assets` uses
   * `album_id` (singular).
   */
  album_ids?: Array<string> | null;

  /**
   * Bounding-box (map viewport) location filter: four comma-separated decimal-degree
   * numbers `min_longitude,min_latitude,max_longitude,max_latitude`
   * (west,south,east,north), e.g. `-77.1,38.9,-77.0,39.0`. A box whose
   * `min_longitude` exceeds `max_longitude` (antimeridian-crossing) is accepted but
   * matches nothing — split it client-side.
   */
  bbox?: string | null;

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
   * Include per-stage dense/sparse ranks and scores plus fused attribution. Intended
   * for debugging and evaluation; omitted from normal responses.
   */
  include_debug?: boolean;

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
   * 1-indexed page number. `search_assets` uses page-number pagination; the sibling
   * `list_assets` uses cursor pagination via `starting_after_id`. Increment `page`
   * to fetch subsequent pages. Relevance-ranked searches paginate a fixed top-200
   * fused candidate population, so pages beyond that population are empty.
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
   * Body param: Filter to assets in ALL of these album IDs (intersection, not
   * union). Accepts multiple `album_ids=` form fields or a single comma-delimited
   * value (e.g., `album_123,album_abc`). Plural on this tool; the sibling
   * `list_assets` uses `album_id` (singular).
   */
  album_ids?: Array<string> | null;

  /**
   * Body param: Bounding-box (map viewport) location filter: four comma-separated
   * decimal-degree numbers `min_longitude,min_latitude,max_longitude,max_latitude`
   * (west,south,east,north), e.g. `-77.1,38.9,-77.0,39.0`. A box whose
   * `min_longitude` exceeds `max_longitude` (antimeridian-crossing) is accepted but
   * matches nothing — split it client-side.
   */
  bbox?: string | null;

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
   * Body param: Image file for an independent dense-image retrieval stage. When text
   * is also provided, the stage ranks are fused rather than blending their
   * embeddings.
   */
  image?: Uploadable | null;

  /**
   * Body param: Include per-stage dense/sparse ranks and scores plus fused
   * attribution. Intended for debugging and evaluation; omitted from normal
   * responses.
   */
  include_debug?: boolean;

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
   * comma-delimited value (e.g., `person_123,person_abc`). Person IDs are carried by
   * the entries of an asset's `people` field (returned with `include=people`).
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
