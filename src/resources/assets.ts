// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as EventsAPI from './events';
import * as FacesAPI from './faces';
import * as PeopleAPI from './people';
import { APIPromise } from '../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../core/pagination';
import { type Uploadable } from '../core/uploads';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { multipartFormRequestOptions } from '../internal/uploads';
import { path } from '../internal/utils/path';

export class Assets extends APIResource {
  /**
   * Uploads a new asset file (image or video) along with its metadata to the
   * specified library. If no library_id is provided and the user only has one
   * library, uses that library. If the user has multiple libraries, library_id is
   * required.
   */
  create(body: AssetCreateParams, options?: RequestOptions): APIPromise<AssetResponse> {
    return this._client.post('/api/assets', multipartFormRequestOptions({ body, ...options }, this._client));
  }

  /**
   * Retrieves detailed metadata for a specific asset, including EXIF information,
   * asset metrics, faces, and people.
   */
  retrieve(assetID: string, options?: RequestOptions): APIPromise<AssetResponse> {
    return this._client.get(path`/api/assets/${assetID}`, options);
  }

  /**
   * Retrieves a paginated list of assets from the specified library, optionally
   * filtered by album, person, or specific asset IDs. Asset data includes metrics,
   * EXIF data, faces, and people. Assets are ordered by local creation time,
   * descending.
   */
  list(
    query: AssetListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<AssetResponsesCursorPage, AssetResponse> {
    return this._client.getAPIList('/api/assets', CursorPage<AssetResponse>, { query, ...options });
  }

  /**
   * Deletes a specific asset and its associated data (including the file from
   * storage).
   */
  delete(assetID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/api/assets/${assetID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Checks which assets exist in the user's library based on checksums or device
   * identifiers. Provide exactly one of: checksums, checksum_sha1s, or (deviceId AND
   * deviceAssetIds). List parameters are limited to 5000 items.
   */
  checkExistence(
    params: AssetCheckExistenceParams,
    options?: RequestOptions,
  ): APIPromise<AssetExistenceResponse> {
    const { library_id, ...body } = params;
    return this._client.post('/api/assets/exist', { query: { library_id }, body, ...options });
  }

  /**
   * Downloads the original file for a specific asset.
   */
  download(assetID: string, options?: RequestOptions): APIPromise<Response> {
    return this._client.get(path`/api/assets/${assetID}/download`, {
      ...options,
      headers: buildHeaders([{ Accept: 'image/*' }, options?.headers]),
      __binaryResponse: true,
    });
  }

  /**
   * Downloads a thumbnail for a specific asset. The exact thumbnail returned depends
   * on availability and the optional `size` parameter.
   */
  downloadThumbnail(
    assetID: string,
    query: AssetDownloadThumbnailParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Response> {
    return this._client.get(path`/api/assets/${assetID}/thumbnail`, {
      query,
      ...options,
      headers: buildHeaders([{ Accept: 'image/*' }, options?.headers]),
      __binaryResponse: true,
    });
  }
}

export type AssetResponsesCursorPage = CursorPage<AssetResponse>;

/**
 * Response for asset existence check endpoint.
 */
export interface AssetExistenceResponse {
  /**
   * List of assets matching the query criteria
   */
  assets: Array<AssetLiteResponse>;
}

/**
 * Lightweight asset response for existence checks.
 */
export interface AssetLiteResponse {
  /**
   * Unique asset identifier with 'asset\_' prefix
   */
  id: string;

  /**
   * Base64-encoded SHA-256 hash of the asset contents for duplicate detection and
   * integrity
   */
  checksum: string;

  /**
   * Original asset identifier from the device that uploaded this asset
   */
  device_asset_id: string;

  /**
   * Identifier of the device that uploaded this asset
   */
  device_id: string;

  /**
   * Base64-encoded SHA-1 hash for Immich client compatibility. May be null for older
   * assets.
   */
  checksum_sha1?: string | null;
}

/**
 * Represents a photo or video asset with metadata and access URLs.
 */
export interface AssetResponse {
  /**
   * Unique asset identifier with 'asset\_' prefix
   */
  id: string;

  /**
   * Base64-encoded SHA-256 hash of the asset contents for duplicate detection and
   * integrity
   */
  checksum: string;

  /**
   * When this asset record was created in the database
   */
  created_at: string;

  /**
   * Original asset identifier from the device that uploaded this asset
   */
  device_asset_id: string;

  /**
   * Identifier of the device that uploaded this asset
   */
  device_id: string;

  /**
   * When the file was created on the uploading device
   */
  file_created_at: string;

  /**
   * When the file was last modified on the uploading device
   */
  file_modified_at: string;

  /**
   * When the photo/video was taken, in the device's local timezone
   */
  local_datetime: string;

  /**
   * MIME type of the file (e.g., 'image/jpeg', 'video/mp4')
   */
  mime_type: string;

  /**
   * Original filename when the asset was uploaded
   */
  original_file_name: string;

  /**
   * When this asset record was last updated
   */
  updated_at: string;

  /**
   * Base64-encoded SHA-1 hash for Immich client compatibility. May be null for older
   * assets.
   */
  checksum_sha1?: string | null;

  /**
   * If you need to download the full asset, use this URL. Otherwise, use the
   * thumbnail_url.
   */
  download_url?: string | null;

  /**
   * EXIF metadata extracted from image and video files.
   */
  exif?: EventsAPI.ExifResponse | null;

  /**
   * All faces detected in this asset
   */
  faces?: Array<FacesAPI.FaceResponse>;

  /**
   * File size of the asset in bytes
   */
  file_size_bytes?: number;

  /**
   * Height of the asset in pixels
   */
  height?: number;

  /**
   * ML-generated quality scores and other metrics
   */
  metrics?: { [key: string]: number | null } | null;

  /**
   * All unique people identified in this asset (deduplicated from faces)
   */
  people?: Array<PeopleAPI.PersonResponse>;

  /**
   * Use this URL to display the asset. Never download the full asset unless you
   * absolutely have to; prefer the thumbnail instead.
   */
  thumbnail_url?: string | null;

  /**
   * Width of the asset in pixels
   */
  width?: number;
}

export interface AssetCreateParams {
  asset_data: Uploadable;

  device_asset_id: string;

  device_id: string;

  file_created_at: string;

  file_modified_at: string;

  /**
   * Library to upload asset to (optional)
   */
  library_id?: string | null;
}

export interface AssetListParams extends CursorPageParams {
  /**
   * Filter by assets in a specific album
   */
  album_id?: string | null;

  /**
   * Filter by specific asset IDs (max 100)
   */
  ids?: Array<string> | null;

  /**
   * Library to list assets from (optional)
   */
  library_id?: string | null;

  /**
   * Only include assets with local_datetime after this value (ISO 8601). Naive
   * values compare directly against local_datetime; timezone-aware values are
   * converted to UTC and compared against local_datetime adjusted by its stored
   * offset.
   */
  local_datetime_after?: string | null;

  /**
   * Only include assets with local_datetime before this value (ISO 8601). Naive
   * values compare directly against local_datetime; timezone-aware values are
   * converted to UTC and compared against local_datetime adjusted by its stored
   * offset.
   */
  local_datetime_before?: string | null;

  /**
   * Filter by assets associated with a specific person ID
   */
  person_id?: string | null;
}

export interface AssetCheckExistenceParams {
  /**
   * Query param: Library to check assets in (optional)
   */
  library_id?: string | null;

  /**
   * Body param: List of base64-encoded SHA-1 checksums to check for existence (for
   * Immich compatibility)
   */
  checksum_sha1s?: Array<string> | null;

  /**
   * Body param: List of base64-encoded SHA-256 checksums to check for existence
   */
  checksums?: Array<string> | null;

  /**
   * Body param: List of device asset IDs to check for existence (requires deviceId)
   */
  deviceAssetIds?: Array<string> | null;

  /**
   * Body param: Device ID to filter assets by (required with deviceAssetIds)
   */
  deviceId?: string | null;
}

export interface AssetDownloadThumbnailParams {
  /**
   * Desired thumbnail size (e.g., thumbnail, preview)
   */
  size?: string | null;
}

export declare namespace Assets {
  export {
    type AssetExistenceResponse as AssetExistenceResponse,
    type AssetLiteResponse as AssetLiteResponse,
    type AssetResponse as AssetResponse,
    type AssetResponsesCursorPage as AssetResponsesCursorPage,
    type AssetCreateParams as AssetCreateParams,
    type AssetListParams as AssetListParams,
    type AssetCheckExistenceParams as AssetCheckExistenceParams,
    type AssetDownloadThumbnailParams as AssetDownloadThumbnailParams,
  };
}
