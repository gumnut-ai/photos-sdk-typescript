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
   * Fetches one asset and its associated metadata. Use this when you already have a
   * specific asset ID (e.g., from `list_assets`, `search_assets`, or
   * `list_album_assets`) and need its full details. For bulk fetch of multiple known
   * IDs, prefer `list_assets` with the `ids` parameter to avoid N round trips.
   */
  retrieve(assetID: string, options?: RequestOptions): APIPromise<AssetResponse> {
    return this._client.get(path`/api/assets/${assetID}`, options);
  }

  /**
   * Returns a paginated list of assets ordered by local capture time (newest first).
   * Use this tool for structured browsing and filtering — when the request can be
   * expressed as exact filters on album membership, people, date range, or specific
   * asset IDs.
   *
   * **Use `search_assets` instead** when the request involves natural-language image
   * content ('photos of sunsets', 'pictures with my dog'), location or place
   * ('photos from Japan'), or any concept requiring semantic understanding of what's
   * in the image. `list_assets` does not filter by image content, location, or
   * caption text.
   *
   * **To present a curated set of specific assets to the user** (e.g., a hand-picked
   * subset of `search_assets` results), call this tool with `ids=[...]` rather than
   * building a custom gallery — the asset IDs you already have are enough to
   * re-render them through the interactive widget.
   *
   * **Pagination** is cursor-based: when `has_more` is true, pass the `id` of the
   * last asset in `data` as `starting_after_id` to fetch the next page.
   */
  list(
    query: AssetListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<AssetResponsesCursorPage, AssetResponse> {
    return this._client.getAPIList('/api/assets', CursorPage<AssetResponse>, { query, ...options });
  }

  /**
   * Deletes the asset entirely — the database record, the stored file, and all
   * associated data (faces, album links, etc.). This is irreversible.
   *
   * **Use `remove_assets_from_album` instead** when the user only wants to remove an
   * asset from a specific album but keep the file in their library. Use
   * `delete_album` to remove an album without deleting its assets.
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
   * Returns asset counts grouped by time period. Supports optional filtering by
   * album, person, or date range. Results are ordered by time bucket descending.
   *
   * **Pagination:** When `has_more` is true, pass the last `time_bucket` value from
   * `data` as `local_datetime_before` to fetch the next page.
   */
  counts(
    query: AssetCountsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AssetCountResponse> {
    return this._client.get('/api/assets/counts', { query, ...options });
  }
}

export type AssetResponsesCursorPage = CursorPage<AssetResponse>;

export interface AssetCountResponse {
  /**
   * Time bucket and count pairs, ordered by time bucket descending
   */
  data: Array<AssetCountResponse.Data>;

  /**
   * True if there are more time buckets. To fetch the next page, pass the last
   * `time_bucket` value as `local_datetime_before` (exclusive — buckets starting
   * before that value are returned).
   */
  has_more: boolean;
}

export namespace AssetCountResponse {
  export interface Data {
    /**
     * Number of assets in this time period
     */
    count: number;

    /**
     * Start of the time period
     */
    time_bucket: string;
  }
}

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
   * Named asset variants: 'original', 'thumbnail', 'preview', 'fullsize' for images;
   * 'original' only for videos
   */
  asset_urls?: { [key: string]: AssetResponse.AssetURLs } | null;

  /**
   * Base64-encoded SHA-1 hash for Immich client compatibility. May be null for older
   * assets.
   */
  checksum_sha1?: string | null;

  /**
   * AI-generated description of the asset's content, quality, and composition. null
   * means description generation has not yet run; empty string means the model
   * refused to describe the asset. Distinct from exif.description (camera-embedded
   * EXIF metadata).
   */
  description?: string | null;

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
   * Width of the asset in pixels
   */
  width?: number;
}

export namespace AssetResponse {
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

export interface AssetCreateParams {
  /**
   * The asset file to upload
   */
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
   * Return only assets that are in the album with this ID. Equivalent to calling
   * `list_album_assets` with `album_id` and then fetching each asset — prefer this
   * param when you need the full asset metadata in one call.
   */
  album_id?: string | null;

  /**
   * Look up specific assets by ID (max 100; each ID has the `asset_` prefix). Use
   * this for bulk fetch when you already have asset IDs. Combines with other filters
   * (album_id, person_id, datetime range) using AND logic — the result is the
   * intersection.
   */
  ids?: Array<string> | null;

  /**
   * Library to list assets from. Optional if the user has a single library; required
   * when they have multiple. Use `list_libraries` to enumerate available libraries.
   */
  library_id?: string | null;

  /**
   * Only include assets captured strictly after this instant (ISO 8601; exclusive).
   * `local_datetime` is the photo's wall-clock time in the device's own timezone.
   * Naive values compare directly against `local_datetime`. Timezone-aware values:
   * assets with a known offset are compared in UTC (`local_datetime - offset`);
   * assets without an offset fall back to wall-clock comparison against
   * `local_datetime`. Equivalent in purpose to `captured_after` on `search_assets`
   * (naming inconsistency is tracked as a follow-up).
   */
  local_datetime_after?: string | null;

  /**
   * Only include assets captured strictly before this instant (ISO 8601; exclusive).
   * Same awareness/offset semantics as `local_datetime_after`. Equivalent in purpose
   * to `captured_before` on `search_assets` (naming inconsistency is tracked as a
   * follow-up).
   */
  local_datetime_before?: string | null;

  /**
   * Return only assets containing a face belonging to this person. Singular on this
   * tool; the sibling `search_assets` uses `person_ids` (plural, ALL-of).
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

export interface AssetCountsParams {
  /**
   * Filter by assets in a specific album
   */
  album_id?: string | null;

  /**
   * Time period to group counts by. Currently only 'month' is supported.
   */
  group_by?: string;

  /**
   * Library to count assets in (optional)
   */
  library_id?: string | null;

  /**
   * Maximum number of time buckets to return (1-200)
   */
  limit?: number;

  /**
   * Only include assets with local_datetime after this value (ISO 8601). Naive
   * values compare directly against local_datetime. Timezone-aware values: assets
   * with a known offset are compared in UTC (local_datetime - offset); assets
   * without an offset fall back to wall-clock comparison against local_datetime.
   */
  local_datetime_after?: string | null;

  /**
   * Only include assets with local_datetime before this value (ISO 8601). Naive
   * values compare directly against local_datetime. Timezone-aware values: assets
   * with a known offset are compared in UTC (local_datetime - offset); assets
   * without an offset fall back to wall-clock comparison against local_datetime. Use
   * the last time_bucket from a previous response to paginate.
   */
  local_datetime_before?: string | null;

  /**
   * Filter by assets associated with a specific person ID
   */
  person_id?: string | null;
}

export declare namespace Assets {
  export {
    type AssetCountResponse as AssetCountResponse,
    type AssetExistenceResponse as AssetExistenceResponse,
    type AssetLiteResponse as AssetLiteResponse,
    type AssetResponse as AssetResponse,
    type AssetResponsesCursorPage as AssetResponsesCursorPage,
    type AssetCreateParams as AssetCreateParams,
    type AssetListParams as AssetListParams,
    type AssetCheckExistenceParams as AssetCheckExistenceParams,
    type AssetCountsParams as AssetCountsParams,
  };
}
