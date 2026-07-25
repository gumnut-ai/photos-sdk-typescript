// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class AssetsAssociations extends APIResource {
  /**
   * Adds one or more existing assets to the specified album. Assets must already be
   * in the same library as the album (this tool does not upload new assets). Assets
   * already in the album are silently skipped and returned separately as
   * `duplicate_assets`; missing or different-library IDs are skipped and returned as
   * `not_found_assets`. Idempotent: calling with the same IDs twice leaves the album
   * in the same state.
   *
   * Up to 200 ids per request; over-cap requests return 422.
   */
  add(
    albumID: string,
    body: AssetsAssociationAddParams,
    options?: RequestOptions,
  ): APIPromise<AssetsAssociationAddResponse> {
    return this._client.post(path`/api/albums/${albumID}/assets`, { body, ...options });
  }

  /**
   * Detaches one or more assets from the given album. The assets themselves remain
   * in the library and in any other albums they belong to. Use `trash_assets` to
   * soft-delete the asset entirely. To empty an album completely, call
   * `list_album_assets` to get the links and then remove them, or delete the album
   * itself with `delete_album`.
   *
   * Up to 200 ids per request; over-cap requests return 422.
   */
  remove(
    albumID: string,
    body: AssetsAssociationRemoveParams,
    options?: RequestOptions,
  ): APIPromise<AssetsAssociationRemoveResponse> {
    return this._client.delete(path`/api/albums/${albumID}/assets`, { body, ...options });
  }
}

export interface AlbumAssetAssociation {
  /**
   * Asset IDs (with `asset_` prefix) to associate with the album. Up to 200 ids per
   * request.
   */
  asset_ids: Array<string>;
}

export interface AssetsAssociationAddResponse {
  /**
   * Asset IDs newly added to the album by this call.
   */
  added_assets: Array<string>;

  /**
   * Asset IDs that were already in the album and were skipped (idempotent no-op, not
   * an error).
   */
  duplicate_assets: Array<string>;

  /**
   * Asset IDs that were skipped because they do not exist or do not belong to the
   * album's library.
   */
  not_found_assets: Array<string>;
}

/**
 * Acknowledgment body returned by destructive endpoints (delete / trash / restore
 * / permanently delete / remove-from-album / empty-trash).
 *
 * Carries no fields — the HTTP 200 + empty JSON object is itself the success
 * signal. Exists so MCP tools generated from these endpoints have a real
 * `outputSchema` (rather than the null schema FastMCP emits for 204 responses),
 * which ChatGPT's MCP submission tooling requires.
 */
export interface AssetsAssociationRemoveResponse {}

export interface AssetsAssociationAddParams {
  /**
   * Asset IDs (with `asset_` prefix) to associate with the album. Up to 200 ids per
   * request.
   */
  asset_ids: Array<string>;
}

export interface AssetsAssociationRemoveParams {
  /**
   * Asset IDs (with `asset_` prefix) to associate with the album. Up to 200 ids per
   * request.
   */
  asset_ids: Array<string>;
}

export declare namespace AssetsAssociations {
  export {
    type AlbumAssetAssociation as AlbumAssetAssociation,
    type AssetsAssociationAddResponse as AssetsAssociationAddResponse,
    type AssetsAssociationRemoveResponse as AssetsAssociationRemoveResponse,
    type AssetsAssociationAddParams as AssetsAssociationAddParams,
    type AssetsAssociationRemoveParams as AssetsAssociationRemoveParams,
  };
}
