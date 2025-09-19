// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as AssetsAPI from './assets';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Search extends APIResource {
  /**
   * Searches for assets using semantic similarity and/or metadata filters. Results
   * include asset metadata, faces, and people. At least one search criterion must be
   * provided.
   *
   * @deprecated
   */
  search(
    query: SearchSearchParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SearchResponse> {
    return this._client.get('/api/search', { query, ...options });
  }
}

export interface SearchResponse {
  data: Array<SearchResponse.Data>;
}

export namespace SearchResponse {
  export interface Data {
    /**
     * Represents a photo or video asset with metadata and access URLs.
     */
    asset: AssetsAPI.AssetResponse;

    distance: number | null;
  }
}

export interface SearchSearchParams {
  /**
   * Filter to only include assets captured after this date (ISO format).
   */
  captured_after?: string | null;

  /**
   * Filter to only include assets captured before this date (ISO format).
   */
  captured_before?: string | null;

  /**
   * Library to search assets from (optional)
   */
  library_id?: string | null;

  /**
   * Number of results per page
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
  export { type SearchResponse as SearchResponse, type SearchSearchParams as SearchSearchParams };
}
