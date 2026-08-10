// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as AssetsAssociationsAPI from './assets-associations';
import {
  AlbumAssetAssociation,
  AssetsAssociationAddParams,
  AssetsAssociationAddResponse,
  AssetsAssociationRemoveParams,
  AssetsAssociationRemoveResponse,
  AssetsAssociations,
} from './assets-associations';
import { APIPromise } from '../../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * User-curated collections of assets.
 */
export class Albums extends APIResource {
  assetsAssociations: AssetsAssociationsAPI.AssetsAssociations = new AssetsAssociationsAPI.AssetsAssociations(
    this._client,
  );

  /**
   * Creates a new, empty album in a library (with optional name and description) and
   * returns it. The album starts empty — follow up with `add_assets_to_album` to
   * populate it. To rename an existing album, use `update_album` instead of creating
   * a new one.
   */
  create(body: AlbumCreateParams, options?: RequestOptions): APIPromise<AlbumResponse> {
    return this._client.post('/api/albums', { body, ...options });
  }

  /**
   * Fetches one album's metadata by ID (name, description, cover, counts). Use when
   * you already have an album ID. The JSON response is metadata only and does not
   * include the album's assets — to get the asset IDs or data, use
   * `list_album_assets` or `list_assets` with `album_id`.
   */
  retrieve(albumID: string, options?: RequestOptions): APIPromise<AlbumResponse> {
    return this._client.get(path`/api/albums/${albumID}`, options);
  }

  /**
   * Updates album metadata (name, description, and/or cover). Only the fields
   * included in the request body are changed. To modify the contents of an album,
   * use `add_assets_to_album` / `remove_assets_from_album` instead — this tool only
   * changes album metadata.
   */
  update(albumID: string, body: AlbumUpdateParams, options?: RequestOptions): APIPromise<AlbumResponse> {
    return this._client.patch(path`/api/albums/${albumID}`, { body, ...options });
  }

  /**
   * Returns a paginated list of albums ordered by creation time (newest first),
   * optionally filtered by asset membership or ID. Use this to enumerate a user's
   * albums or to find which albums contain a specific asset (via `asset_id`).
   *
   * `list_albums` returns album metadata only — to list the assets inside a
   * particular album, use `list_album_assets` or `list_assets` with `album_id`.
   *
   * **Pagination** is cursor-based: when `has_more` is true, pass the `id` of the
   * last album in `data` as `starting_after_id` to fetch the next page.
   */
  list(
    query: AlbumListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<AlbumResponsesCursorPage, AlbumResponse> {
    return this._client.getAPIList('/api/albums', CursorPage<AlbumResponse>, { query, ...options });
  }

  /**
   * Deletes the album itself. Assets that were in the album remain in the library —
   * only the album and its asset-links are removed. Use `trash_assets` to
   * soft-delete the underlying assets, or `remove_assets_from_album` to detach
   * specific assets from an album you want to keep.
   */
  delete(albumID: string, options?: RequestOptions): APIPromise<AlbumDeleteResponse> {
    return this._client.delete(path`/api/albums/${albumID}`, options);
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
   * ID of the asset displayed as the album cover. May be a server-selected default
   * when the album has no explicit cover set, or null when the album has no live
   * assets.
   */
  album_cover_asset_id?: string | null;

  /**
   * Asset variants for the album cover: 'thumbnail'
   */
  asset_urls?: { [key: string]: Shared.AssetVariant } | null;

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

/**
 * Empty acknowledgment returned when an operation succeeds.
 */
export interface AlbumDeleteResponse {}

export interface AlbumCreateParams {
  /**
   * Optional free-form description shown alongside the album name.
   */
  description?: string | null;

  /**
   * Library to create the album in. Optional if the user has a single live
   * (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;

  /**
   * Display name for the new album. Optional; callers that need to name an album can
   * set it here or via `update_album` after creation.
   */
  name?: string | null;
}

export interface AlbumUpdateParams {
  /**
   * Asset ID (with `asset_` prefix) to use as the album cover. Must be a live asset
   * already in the album. Pass `null` to clear the explicit cover. Omit to leave
   * unchanged.
   */
  album_cover_asset_id?: string | null;

  /**
   * New free-form description for the album. Pass `null` to clear the description.
   * Omit to leave unchanged.
   */
  description?: string | null;

  /**
   * New display name for the album. Omit to leave unchanged.
   */
  name?: string | null;
}

export interface AlbumListParams extends CursorPageParams {
  /**
   * Return only albums that contain this asset. Useful for answering 'which albums
   * is this photo in?' without calling `list_album_assets`.
   */
  asset_id?: string | null;

  /**
   * Look up specific albums by ID (max 200; each ID has the `album_` prefix).
   * Accepts multiple `ids=` query params or a single comma-delimited value (e.g.,
   * `ids=album_1,album_2`).
   */
  ids?: Array<string> | null;

  /**
   * Library to list albums from. Optional if the user has a single live
   * (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;
}

Albums.AssetsAssociations = AssetsAssociations;

export declare namespace Albums {
  export {
    type AlbumResponse as AlbumResponse,
    type AlbumDeleteResponse as AlbumDeleteResponse,
    type AlbumResponsesCursorPage as AlbumResponsesCursorPage,
    type AlbumCreateParams as AlbumCreateParams,
    type AlbumUpdateParams as AlbumUpdateParams,
    type AlbumListParams as AlbumListParams,
  };

  export {
    AssetsAssociations as AssetsAssociations,
    type AlbumAssetAssociation as AlbumAssetAssociation,
    type AssetsAssociationAddResponse as AssetsAssociationAddResponse,
    type AssetsAssociationRemoveResponse as AssetsAssociationRemoveResponse,
    type AssetsAssociationAddParams as AssetsAssociationAddParams,
    type AssetsAssociationRemoveParams as AssetsAssociationRemoveParams,
  };
}
