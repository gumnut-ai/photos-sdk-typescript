// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
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
   * Retrieves detailed metadata for a specific asset, including EXIF information and
   * asset metrics.
   */
  retrieve(assetID: string, options?: RequestOptions): APIPromise<AssetResponse> {
    return this._client.get(path`/api/assets/${assetID}`, options);
  }

  /**
   * Retrieves a paginated list of assets from the specified library, optionally
   * filtered by album or person. Assets are ordered by local creation time,
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
 * Represents a photo or video asset with metadata and access URLs.
 */
export interface AssetResponse {
  /**
   * Unique asset identifier with 'asset\_' prefix
   */
  id: string;

  /**
   * Base64-encoded hash of the asset contents for duplicate detection and integrity
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
   * If you need to download the full asset, use this URL. Otherwise, use the
   * thumbnail_url.
   */
  download_url?: string | null;

  /**
   * EXIF metadata extracted from image and video files.
   */
  exif?: AssetResponse.Exif | null;

  /**
   * ML-generated quality scores and other metrics
   */
  metrics?: { [key: string]: number | null } | null;

  /**
   * Use this URL to display the asset. Never download the full asset unless you
   * absolutely have to; prefer the thumbnail instead.
   */
  thumbnail_url?: string | null;
}

export namespace AssetResponse {
  /**
   * EXIF metadata extracted from image and video files.
   */
  export interface Exif {
    /**
     * GPS altitude in meters
     */
    altitude?: number | null;

    /**
     * Identifier for automatic photo stacking
     */
    auto_stack_id?: string | null;

    /**
     * City name from GPS/location data
     */
    city?: string | null;

    /**
     * Country name from GPS/location data
     */
    country?: string | null;

    /**
     * Image description or caption
     */
    description?: string | null;

    /**
     * When the photo was digitized, with timezone info
     */
    digitized_datetime?: string | null;

    /**
     * Exposure compensation in EV (e.g., -1.0, +0.5)
     */
    exposure_bias?: number | null;

    /**
     * Shutter speed in seconds (e.g., 0.001 for 1/1000s)
     */
    exposure_time?: number | null;

    /**
     * Aperture f-stop value (e.g., 2.8, 5.6)
     */
    f_number?: number | null;

    /**
     * Focal length in millimeters
     */
    focal_length?: number | null;

    /**
     * Frame rate for video files
     */
    fps?: number | null;

    /**
     * ISO sensitivity value (e.g., 100, 800, 3200)
     */
    iso?: number | null;

    /**
     * GPS latitude in decimal degrees
     */
    latitude?: number | null;

    /**
     * Lens model used (e.g., 'EF 24-70mm f/2.8L II USM')
     */
    lens_model?: string | null;

    /**
     * Live photo content identifier
     */
    live_photo_cid?: string | null;

    /**
     * GPS longitude in decimal degrees
     */
    longitude?: number | null;

    /**
     * Camera manufacturer (e.g., 'Canon', 'Nikon')
     */
    make?: string | null;

    /**
     * Camera model (e.g., 'EOS 5D Mark IV')
     */
    model?: string | null;

    /**
     * When the file was last modified, with timezone info
     */
    modified_datetime?: string | null;

    /**
     * Image orientation value (1-8) indicating rotation/flip: 1=normal, 2=mirror
     * horizontal, 3=rotate 180°, 4=mirror vertical, 5=mirror horizontal+rotate 90° CW,
     * 6=rotate 90° CW, 7=mirror horizontal+rotate 90° CCW, 8=rotate 90° CCW
     */
    orientation?: number | null;

    /**
     * When the photo was originally taken, with timezone info
     */
    original_datetime?: string | null;

    /**
     * Color profile description
     */
    profile_description?: string | null;

    /**
     * Projection type (e.g., for 360° photos)
     */
    projection_type?: string | null;

    /**
     * User or camera rating (typically 1-5 stars)
     */
    rating?: number | null;

    /**
     * State/province name from GPS/location data
     */
    state?: string | null;
  }
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
   * Library to list assets from (optional)
   */
  library_id?: string | null;

  /**
   * Filter by assets associated with a specific person ID
   */
  person_id?: string | null;
}

export interface AssetDownloadThumbnailParams {
  /**
   * Desired thumbnail size (e.g., thumbnail, preview)
   */
  size?: string | null;
}

export declare namespace Assets {
  export {
    type AssetResponse as AssetResponse,
    type AssetResponsesCursorPage as AssetResponsesCursorPage,
    type AssetCreateParams as AssetCreateParams,
    type AssetListParams as AssetListParams,
    type AssetDownloadThumbnailParams as AssetDownloadThumbnailParams,
  };
}
