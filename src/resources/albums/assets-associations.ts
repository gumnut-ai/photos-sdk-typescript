// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as AssetsAPI from '../assets';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class AssetsAssociations extends APIResource {
  /**
   * Retrieves a list of all assets contained within a specific album, along with
   * their associated metrics, EXIF data, faces, and people.
   */
  list(albumID: string, options?: RequestOptions): APIPromise<AssetsAssociationListResponse> {
    return this._client.get(path`/api/albums/${albumID}/assets`, options);
  }

  /**
   * Adds one or more existing assets to a specific album. Assets must be in the same
   * library as the album. Duplicate assets are ignored.
   */
  add(
    albumID: string,
    body: AssetsAssociationAddParams,
    options?: RequestOptions,
  ): APIPromise<AssetsAssociationAddResponse> {
    return this._client.post(path`/api/albums/${albumID}/assets`, { body, ...options });
  }

  /**
   * Removes one or more assets from a specific album. Note: This does not delete the
   * assets themselves.
   */
  remove(albumID: string, body: AssetsAssociationRemoveParams, options?: RequestOptions): APIPromise<void> {
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

export type AssetsAssociationListResponse = Array<AssetsAPI.AssetResponse>;

export interface AssetsAssociationAddResponse {
  added_assets: Array<string>;

  duplicate_assets: Array<string>;
}

export interface AssetsAssociationAddParams {
  asset_ids: Array<string>;
}

export interface AssetsAssociationRemoveParams {
  asset_ids: Array<string>;
}

export declare namespace AssetsAssociations {
  export {
    type AlbumAssetAssociation as AlbumAssetAssociation,
    type AssetsAssociationListResponse as AssetsAssociationListResponse,
    type AssetsAssociationAddResponse as AssetsAssociationAddResponse,
    type AssetsAssociationAddParams as AssetsAssociationAddParams,
    type AssetsAssociationRemoveParams as AssetsAssociationRemoveParams,
  };
}
