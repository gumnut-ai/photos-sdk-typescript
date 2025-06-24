// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as AssetsAPI from '../assets';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Assets extends APIResource {
  /**
   * Retrieves a list of all assets contained within a specific album.
   */
  list(albumID: string, options?: RequestOptions): APIPromise<AssetListResponse> {
    return this._client.get(path`/api/albums/${albumID}/assets`, options);
  }

  /**
   * Adds one or more existing assets to a specific album. Duplicate assets are
   * ignored. Returns the IDs of the assets that were added and the IDs of the assets
   * that were already in the album.
   */
  add(albumID: string, body: AssetAddParams, options?: RequestOptions): APIPromise<AssetAddResponse> {
    return this._client.post(path`/api/albums/${albumID}/assets`, { body, ...options });
  }

  /**
   * Removes one or more assets from a specific album. Note: This does not delete the
   * assets themselves.
   */
  remove(albumID: string, body: AssetRemoveParams, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/api/albums/${albumID}/assets`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface AlbumAssetAssociation {
  asset_ids: Array<string>;
}

export type AssetListResponse = Array<AssetsAPI.AssetResponse>;

export interface AssetAddResponse {
  added_assets: Array<string>;

  duplicate_assets: Array<string>;
}

export interface AssetAddParams {
  asset_ids: Array<string>;
}

export interface AssetRemoveParams {
  asset_ids: Array<string>;
}

export declare namespace Assets {
  export {
    type AlbumAssetAssociation as AlbumAssetAssociation,
    type AssetListResponse as AssetListResponse,
    type AssetAddResponse as AssetAddResponse,
    type AssetAddParams as AssetAddParams,
    type AssetRemoveParams as AssetRemoveParams,
  };
}
