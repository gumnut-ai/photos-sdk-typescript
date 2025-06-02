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
   * Uploads a new asset file (image or video) along with its metadata. If an asset
   * with the same checksum already exists, returns the existing asset's metadata.
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
   * Retrieves a paginated list of assets, optionally filtered by album. Assets are
   * ordered by local creation time, descending.
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

export interface AssetResponse {
  id: string;

  checksum: string;

  created_at: string;

  device_asset_id: string;

  device_id: string;

  file_created_at: string;

  file_modified_at: string;

  local_datetime: string;

  mime_type: string;

  original_file_name: string;

  updated_at: string;

  download_url?: string | null;

  exif?: AssetResponse.Exif | null;

  metrics?: Record<string, number | null> | null;

  thumbnail_url?: string | null;
}

export namespace AssetResponse {
  export interface Exif {
    altitude?: number | null;

    auto_stack_id?: string | null;

    city?: string | null;

    country?: string | null;

    description?: string | null;

    digitized_datetime?: string | null;

    exposure_bias?: number | null;

    exposure_time?: number | null;

    f_number?: number | null;

    focal_length?: number | null;

    fps?: number | null;

    iso?: number | null;

    latitude?: number | null;

    lens_model?: string | null;

    live_photo_cid?: string | null;

    longitude?: number | null;

    make?: string | null;

    model?: string | null;

    modified_datetime?: string | null;

    orientation?: number | null;

    original_datetime?: string | null;

    profile_description?: string | null;

    projection_type?: string | null;

    rating?: number | null;

    state?: string | null;
  }
}

export interface AssetCreateParams {
  asset_data: Uploadable;

  device_asset_id: string;

  device_id: string;

  file_created_at: string;

  file_modified_at: string;
}

export interface AssetListParams extends CursorPageParams {
  /**
   * Filter by assets in a specific album
   */
  album_id?: string | null;

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
