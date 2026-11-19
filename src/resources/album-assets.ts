// File generated from our OpenAPI spec. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../core/pagination';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Link records connecting albums to their member assets.
 */
export class AlbumAssets extends APIResource {
  /**
   * Returns paginated _link_ records (lightweight join rows between albums and
   * assets) describing which assets are in which albums — each row contains
   * `album_id` + `asset_id` + link timestamps, not the full asset or album metadata.
   * Use this when you specifically need the junction records (for sync or change
   * tracking).
   *
   * For the full metadata of an album's assets, list assets with `album_id`; to find
   * which albums contain an asset, list albums with `asset_id`.
   *
   * **Pagination** is cursor-based: when `has_more` is true, pass the `id` of the
   * last album-asset in `data` as `starting_after_id` to fetch the next page.
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
   * Fetches one album-asset link record by ID (the junction row between an album and
   * an asset). To get the asset or the album itself, fetch it by its own ID.
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
   * Return only link records for this album ID. Equivalent to 'list the assets in
   * this album', but returns lightweight link records; listing assets with
   * `album_id` returns the asset metadata directly.
   */
  album_id?: string | null;

  /**
   * Return only link records for this asset ID. Equivalent to 'which albums contain
   * this asset', but returns link records; listing albums with `asset_id` returns
   * the album metadata directly.
   */
  asset_id?: string | null;

  /**
   * Look up specific album-asset link records by ID (max 200). The ID has the
   * `album_asset_` prefix. Accepts multiple `ids=` query params or a single
   * comma-delimited value (e.g., `ids=album_asset_1,album_asset_2`).
   */
  ids?: Array<string> | null;

  /**
   * Library to list from. Optional if the user has a single live (non-trashed)
   * library; required when they have multiple.
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
