// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../core/pagination';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class AlbumAssets extends APIResource {
  /**
   * Retrieves a paginated list of album-asset links, ordered by creation time,
   * descending. Can be filtered by album_id, asset_id, or specific album-asset IDs.
   */
  list(
    query: AlbumAssetListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<AlbumAssetResponsesCursorPage, AlbumAssetResponse> {
    return this._client.getAPIList('/api/album-assets', CursorPage<AlbumAssetResponse>, {
      query,
      ...options,
    });
  }

  /**
   * Retrieves details for a specific album-asset link.
   */
  get(albumAssetID: string, options?: RequestOptions): APIPromise<AlbumAssetResponse> {
    return this._client.get(path`/api/album-assets/${albumAssetID}`, options);
  }
}

export type AlbumAssetResponsesCursorPage = CursorPage<AlbumAssetResponse>;

/**
 * Represents a link between an album and an asset.
 */
export interface AlbumAssetResponse {
  /**
   * Unique album*asset identifier with 'album_asset*' prefix
   */
  id: string;

  /**
   * ID of the album
   */
  album_id: string;

  /**
   * ID of the asset
   */
  asset_id: string;

  /**
   * When this link was created
   */
  created_at: string;

  /**
   * When this link was last updated
   */
  updated_at: string;
}

export interface AlbumAssetListParams extends CursorPageParams {
  /**
   * Filter by album ID
   */
  album_id?: string | null;

  /**
   * Filter by asset ID
   */
  asset_id?: string | null;

  /**
   * Filter by specific album-asset IDs (max 100)
   */
  ids?: Array<string> | null;

  /**
   * Library ID (required if user has multiple libraries)
   */
  library_id?: string | null;
}

export declare namespace AlbumAssets {
  export {
    type AlbumAssetResponse as AlbumAssetResponse,
    type AlbumAssetResponsesCursorPage as AlbumAssetResponsesCursorPage,
    type AlbumAssetListParams as AlbumAssetListParams,
  };
}
