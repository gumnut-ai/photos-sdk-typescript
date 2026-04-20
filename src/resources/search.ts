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
   * structured filters. Use this tool when the user describes _what's in_ the photos
   * they want — subjects, scenes, places, activities, moods, objects — as opposed to
   * browsing by album membership or exact ID.
   *
   * A natural-language `query` can be combined with structured filters
   * (`person_ids`, `captured_before`, `captured_after`) for precision. For example,
   * 'photos of my kids at the beach last summer' becomes
   * `query='kids at the beach'` + `captured_after=2025-06-01` +
   * `captured_before=2025-09-01`.
   *
   * **Use `list_assets` instead** when the request can be answered with exact
   * filters alone (album, person, date range, ID) — it's cheaper and more
   * deterministic than semantic search.
   *
   * Does not filter by location/place today; pass place names as part of `query` and
   * rely on semantic matching until a structured location filter lands.
   *
   * At least one of `query`, `person_ids`, `captured_before`, or `captured_after`
   * must be provided.
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
    body: SearchSearchAssetsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SearchResponse> {
    return this._client.post('/api/search', multipartFormRequestOptions({ body, ...options }, this._client));
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
   * Prefer structured params when available: use `person_ids` for people (not names
   * in `query`) and `captured_before`/`captured_after` for dates (not phrases like
   * 'in 2023' in `query`).
   */
  query?: string | null;

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
   * Filter to only include assets captured after this date (ISO format).
   */
  captured_after?: string | null;

  /**
   * Filter to only include assets captured before this date (ISO format).
   */
  captured_before?: string | null;

  /**
   * Image file to search for similar assets. Can be combined with text query.
   */
  image?: Uploadable | null;

  /**
   * Library to search assets from (optional)
   */
  library_id?: string | null;

  /**
   * Number of results per page (1-200)
   */
  limit?: number;

  /**
   * Page number
   */
  page?: number;

  /**
   * Filter to only include assets containing ALL of these person IDs. Can be
   * comma-delimited string (e.g. 'person_123,person_abc') or multiple query
   * parameters.
   */
  person_ids?: Array<string> | null;

  /**
   * The text query to search for. If you want to search for a specific person or set
   * of people, use the person_ids parameter instead.If you want to search for a
   * photos taken during a specific date range, use the captured_before and
   * captured_after parameters instead.
   */
  query?: string | null;

  /**
   * Similarity threshold (lower means more similar)
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
