// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as AssetsAPI from './assets';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Search extends APIResource {
  /**
   * Searches for assets using semantic similarity and/or metadata filters. At least
   * one search criterion must be provided.
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
   * Number of results per page
   */
  limit?: number;

  /**
   * Page number
   */
  page?: number;

  /**
   * Filter to only include assets containing ALL of these person IDs
   */
  person_ids?: Array<string>;

  /**
   * The text query to search for
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
