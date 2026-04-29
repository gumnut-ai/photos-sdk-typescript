// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as AssetsAssociationsAPI from './assets-associations';
import {
  AlbumAssetAssociation,
  AssetsAssociationAddParams,
  AssetsAssociationAddResponse,
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
   * Creates an album (with optional name and description) and returns it. The album
   * starts empty — follow up with `add_assets_to_album` to populate it. To rename an
   * existing album, use `update_album` instead of creating a new one.
   */
  create(body: AlbumCreateParams, options?: RequestOptions): APIPromise<AlbumResponse> {
    return this._client.post('/api/albums', { body, ...options });
  }

  /**
   * Fetches one album's metadata (name, description, cover, counts). Use when you
   * already have an album ID. Does not include the album's assets — use
   * `list_album_assets` or `list_assets` with `album_id` for that.
   */
  retrieve(albumID: string, options?: RequestOptions): APIPromise<AlbumResponse> {
    return this._client.get(path`/api/albums/${albumID}`, options);
  }

  /**
   * Updates the `name` and/or `description` of an existing album. Only the fields
   * included in the request body are changed. To modify the contents of an album,
   * use `add_assets_to_album` / `remove_assets_from_album` instead — this tool only
   * changes album metadata.
   */
  update(albumID: string, body: AlbumUpdateParams, options?: RequestOptions): APIPromise<AlbumResponse> {
    return this._client.patch(path`/api/albums/${albumID}`, { body, ...options });
  }

  /**
   * Returns a paginated list of albums ordered by creation time (newest first). Use
   * this to enumerate a user's albums or to find which albums contain a specific
   * asset (via `asset_id`).
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
   * only the album and its asset-links are removed. Use `trash_assets` (or
   * `permanently_delete_assets` for irreversible removal) to delete the underlying
   * assets, or `remove_assets_from_album` to detach specific assets from an album
   * you want to keep.
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

export interface AlbumCreateParams {
  /**
   * Optional free-form description shown alongside the album name.
   */
  description?: string | null;

  /**
   * Library to create the album in. Optional if the user has a single library;
   * required when they have multiple. Use `list_libraries` to enumerate.
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
   * New free-form description for the album. Omit to leave unchanged.
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
   * Look up specific albums by ID (max 100; each ID has the `album_` prefix). Use
   * for bulk fetch when IDs are already known.
   */
  ids?: Array<string> | null;

  /**
   * Library to list albums from. Optional if the user has a single library; required
   * when they have multiple. Use `list_libraries` to enumerate.
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
    type AssetsAssociationAddResponse as AssetsAssociationAddResponse,
    type AssetsAssociationAddParams as AssetsAssociationAddParams,
    type AssetsAssociationRemoveParams as AssetsAssociationRemoveParams,
  };
}
