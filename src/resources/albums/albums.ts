// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as AssetsAPI from './assets';
import {
  AlbumAssetAssociation,
  AssetAddParams,
  AssetAddResponse,
  AssetListResponse,
  AssetRemoveParams,
  Assets,
} from './assets';
import { APIPromise } from '../../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../../core/pagination';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Albums extends APIResource {
  assets: AssetsAPI.Assets = new AssetsAPI.Assets(this._client);

  /**
   * Creates a new, empty album with a given name and optional description.
   */
  create(body: AlbumCreateParams, options?: RequestOptions): APIPromise<AlbumResponse> {
    return this._client.post('/api/albums', { body, ...options });
  }

  /**
   * Retrieves details for a specific album.
   */
  retrieve(albumID: string, options?: RequestOptions): APIPromise<AlbumResponse> {
    return this._client.get(path`/api/albums/${albumID}`, options);
  }

  /**
   * Updates the name and/or description of a specific album.
   */
  update(albumID: string, body: AlbumUpdateParams, options?: RequestOptions): APIPromise<AlbumResponse> {
    return this._client.patch(path`/api/albums/${albumID}`, { body, ...options });
  }

  /**
   * Retrieves a paginated list of albums, ordered by creation time, descending.
   */
  list(
    query: AlbumListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<AlbumResponsesCursorPage, AlbumResponse> {
    return this._client.getAPIList('/api/albums', CursorPage<AlbumResponse>, { query, ...options });
  }

  /**
   * Deletes a specific album. Note: This does not delete the assets within the
   * album.
   */
  delete(albumID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/api/albums/${albumID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export type AlbumResponsesCursorPage = CursorPage<AlbumResponse>;

export interface AlbumResponse {
  id: string;

  created_at: string;

  name: string;

  updated_at: string;

  description?: string | null;
}

export interface AlbumCreateParams {
  name: string;

  description?: string | null;
}

export interface AlbumUpdateParams {
  description?: string | null;

  name?: string | null;
}

export interface AlbumListParams extends CursorPageParams {}

Albums.Assets = Assets;

export declare namespace Albums {
  export {
    type AlbumResponse as AlbumResponse,
    type AlbumResponsesCursorPage as AlbumResponsesCursorPage,
    type AlbumCreateParams as AlbumCreateParams,
    type AlbumUpdateParams as AlbumUpdateParams,
    type AlbumListParams as AlbumListParams,
  };

  export {
    Assets as Assets,
    type AlbumAssetAssociation as AlbumAssetAssociation,
    type AssetListResponse as AssetListResponse,
    type AssetAddResponse as AssetAddResponse,
    type AssetAddParams as AssetAddParams,
    type AssetRemoveParams as AssetRemoveParams,
  };
}
