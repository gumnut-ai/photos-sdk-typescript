// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as AssetsAssociationsAPI from './assets-associations';
import {
  AlbumAssetAssociation,
  AssetsAssociationAddParams,
  AssetsAssociationAddResponse,
  AssetsAssociationListResponse,
  AssetsAssociationRemoveParams,
  AssetsAssociations,
} from './assets-associations';
import { APIPromise } from '../../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../../core/pagination';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Albums extends APIResource {
  assetsAssociations: AssetsAssociationsAPI.AssetsAssociations = new AssetsAssociationsAPI.AssetsAssociations(
    this._client,
  );

  /**
   * Creates a new, empty album with optional name and description in the specified
   * library.
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
   * Retrieves a paginated list of albums from the specified library, ordered by
   * creation time, descending. Can be filtered by asset_id or specific album IDs.
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

/**
 * Represents a collection of assets organized by the user.
 */
export interface AlbumResponse {
  /**
   * Unique album identifier with 'album\_' prefix
   */
  id: string;

  /**
   * Total number of assets in this album
   */
  asset_count: number;

  /**
   * When this album was created
   */
  created_at: string;

  /**
   * Display name of the album
   */
  name: string;

  /**
   * When this album was last updated
   */
  updated_at: string;

  /**
   * ID of the asset used as the album cover
   */
  album_cover_asset_id?: string | null;

  /**
   * Asset variants for the album cover: 'thumbnail'
   */
  asset_urls?: { [key: string]: AlbumResponse.AssetURLs } | null;

  /**
   * Optional description text for the album
   */
  description?: string | null;

  /**
   * The newest asset date (local_datetime) in the album, or null if empty
   */
  end_date?: string | null;

  /**
   * The oldest asset date (local_datetime) in the album, or null if empty
   */
  start_date?: string | null;
}

export namespace AlbumResponse {
  /**
   * A single image variant with its URL, MIME type, and target width.
   */
  export interface AssetURLs {
    /**
     * MIME type of the served image
     */
    mimetype: string;

    /**
     * URL to fetch this image variant
     */
    url: string;

    /**
     * Target width in pixels (null if unknown)
     */
    width?: number | null;
  }
}

export interface AlbumCreateParams {
  description?: string | null;

  library_id?: string | null;

  name?: string | null;
}

export interface AlbumUpdateParams {
  description?: string | null;

  name?: string | null;
}

export interface AlbumListParams extends CursorPageParams {
  /**
   * Filter albums containing this asset ID (optional)
   */
  asset_id?: string | null;

  /**
   * Filter by specific album IDs (max 100)
   */
  ids?: Array<string> | null;

  /**
   * Library to list albums from (optional)
   */
  library_id?: string | null;
}

Albums.AssetsAssociations = AssetsAssociations;

export declare namespace Albums {
  export {
    type AlbumResponse as AlbumResponse,
    type AlbumResponsesCursorPage as AlbumResponsesCursorPage,
    type AlbumCreateParams as AlbumCreateParams,
    type AlbumUpdateParams as AlbumUpdateParams,
    type AlbumListParams as AlbumListParams,
  };

  export {
    AssetsAssociations as AssetsAssociations,
    type AlbumAssetAssociation as AlbumAssetAssociation,
    type AssetsAssociationListResponse as AssetsAssociationListResponse,
    type AssetsAssociationAddResponse as AssetsAssociationAddResponse,
    type AssetsAssociationAddParams as AssetsAssociationAddParams,
    type AssetsAssociationRemoveParams as AssetsAssociationRemoveParams,
  };
}
