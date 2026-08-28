// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as FacesAPI from '../faces';
import * as PeopleAPI from '../people';
import * as Shared from '../shared';
import * as VersionsAPI from './versions';
import {
  AssetVersionResponse,
  VersionAppendParams,
  VersionDeleteParams,
  VersionListParams,
  VersionListResponse,
  VersionReplaceParams,
  VersionRevertParams,
  Versions,
} from './versions';
import { APIPromise } from '../../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../../core/pagination';
import { type Uploadable } from '../../core/uploads';
import { RequestOptions } from '../../internal/request-options';
import { multipartFormRequestOptions } from '../../internal/uploads';
import { path } from '../../internal/utils/path';

/**
 * Photos and videos in a library: upload, list and filter, update metadata, trash and restore.
 */
export class Assets extends APIResource {
  versions: VersionsAPI.Versions = new VersionsAPI.Versions(this._client);

  /**
   * Uploads a new asset (image or video) and its metadata as multipart form data,
   * returning the created asset with 201. Uploads are deduplicated per library by
   * the file's SHA-256 checksum: re-uploading a file whose bytes already exist in
   * the target library stores nothing and returns the existing asset with 200.
   * Storage caps are checked before the duplicate lookup, so an upload is refused
   * with 507 whenever the account or the target library is already at its storage
   * cap — even when the bytes would have deduplicated to an existing asset. A
   * transient upstream storage error returns 502 — retryable after the `Retry-After`
   * interval. When `library_id` is omitted and no default library can be chosen (the
   * account has multiple live libraries), the request is refused with 400. Image
   * metadata is extracted before the response returns; the rest of processing
   * (thumbnails, search indexing, face detection, and video metadata extraction)
   * continues asynchronously after the response.
   *
   * @example
   * ```ts
   * const assetResponse = await client.assets.create({
   *   asset_data: fs.createReadStream('path/to/file'),
   *   device_asset_id: 'IMG_0421',
   *   device_id: 'teds-iphone',
   *   file_created_at: '2026-05-04T10:30:00+10:00',
   *   file_modified_at: '2026-05-04T10:30:00+10:00',
   * });
   * ```
   */
  create(body: AssetCreateParams, options?: RequestOptions): APIPromise<AssetResponse> {
    return this._client.post('/api/assets', multipartFormRequestOptions({ body, ...options }, this._client));
  }

  /**
   * Fetches one asset and its associated metadata by ID. Use this when you already
   * have a specific asset ID (e.g., from `list_assets`, `search_assets`, or
   * `list_album_assets`) and need its full details. For bulk fetch of multiple known
   * IDs, prefer `list_assets` with the `ids` parameter to avoid N round trips.
   * `asset_urls` are signed URLs for client rendering only; to visually inspect the
   * image pixels, call `view_asset` instead.
   *
   * @example
   * ```ts
   * const assetResponse = await client.assets.retrieve(
   *   'asset_id',
   * );
   * ```
   */
  retrieve(
    assetID: string,
    query: AssetRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AssetResponse> {
    return this._client.get(path`/api/assets/${assetID}`, { query, ...options });
  }

  /**
   * Returns a paginated list of assets ordered by local capture time (or trash time
   * for trashed assets), newest first by default, optionally filtered by album,
   * person, rating, media type, date range, geographic area, or asset ID. Use this
   * tool for structured browsing and filtering — when the request can be expressed
   * as exact filters on album membership, people, rating, media type, date range,
   * geographic coordinates, or specific asset IDs.
   *
   * **Location filtering is by coordinate:** pass a radius (`center` + `radius`) or
   * a bounding box (`bbox`) to restrict results to a geographic area. The two modes
   * are mutually exclusive. To count or cluster geotagged assets across a map
   * viewport (how many photos fall in each area) rather than list them, use
   * `get_geo_clusters`.
   *
   * Album and person filters compose using AND.
   *
   * **Use `search_assets` instead** when the request involves natural-language image
   * content ('photos of sunsets', 'pictures with my dog'), a place _name_ ('photos
   * from Japan'), or any concept requiring semantic understanding of what's in the
   * image. `list_assets` filters by coordinate but not by image content, place name,
   * or caption text.
   *
   * **To present a curated set of specific assets to the user** (e.g., a hand-picked
   * subset of `search_assets` results), call this tool with `ids=[...]` rather than
   * building a custom gallery — the asset IDs you already have are enough to
   * re-render them through the interactive widget.
   *
   * **Pagination** is cursor-based: while `has_more` is true, keep fetching with
   * `starting_after_id`.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const assetResponse of client.assets.list()) {
   *   // ...
   * }
   * ```
   */
  list(
    query: AssetListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<AssetResponsesCursorPage, AssetResponse> {
    return this._client.getAPIList('/api/assets', CursorPage<AssetResponse>, { query, ...options });
  }

  /**
   * Deletes the asset entirely — the database record, the stored file, and all
   * associated data (faces, album links, etc.). **Irreversible.** Prefer
   * `trash_assets` for the user's standard delete action so accidents can be
   * recovered.
   *
   * **Use `remove_assets_from_album` instead** when the user only wants to remove an
   * asset from a specific album but keep the file in their library. Use
   * `delete_album` to remove an album without deleting its assets.
   *
   * @example
   * ```ts
   * const asset = await client.assets.delete('asset_id');
   * ```
   */
  delete(assetID: string, options?: RequestOptions): APIPromise<AssetDeleteResponse> {
    return this._client.delete(path`/api/assets/${assetID}`, options);
  }

  /**
   * Updates metadata on multiple assets in one transactional call. Each item carries
   * the target asset id and the per-asset change — different fields can be changed
   * on different assets in the same request. Atomic: any per-item validation failure
   * or unknown / cross-user id rejects the whole batch and writes nothing.
   *
   * For a single-asset edit, prefer `update_asset` — semantically identical but
   * slightly more concise at the call site.
   *
   * @example
   * ```ts
   * const response = await client.assets.bulkUpdateAssets({
   *   updates: [
   *     {
   *       id: 'id',
   *       change: {},
   *     },
   *   ],
   * });
   * ```
   */
  bulkUpdateAssets(
    body: AssetBulkUpdateAssetsParams,
    options?: RequestOptions,
  ): APIPromise<AssetBulkUpdateAssetsResponse> {
    return this._client.post('/api/assets/bulk-update', { body, ...options });
  }

  /**
   * Checks which assets exist in the user's library based on checksums or device
   * identifiers. Provide exactly one of: checksums, checksum_sha1s, or (deviceId AND
   * deviceAssetIds). List parameters are limited to 5000 items.
   *
   * @example
   * ```ts
   * const assetExistenceResponse =
   *   await client.assets.checkExistence();
   * ```
   */
  checkExistence(
    params: AssetCheckExistenceParams,
    options?: RequestOptions,
  ): APIPromise<AssetExistenceResponse> {
    const { library_id, ...body } = params;
    return this._client.post('/api/assets/exist', { query: { library_id }, body, ...options });
  }

  /**
   * Clusters geotagged assets in a map viewport (bounding box) onto a grid of square
   * cells and returns one entry per non-empty cell — its centroid, asset count, and
   * a representative cover asset. Use this to render a clustered map or to count how
   * many photos fall in each part of a viewport at a chosen zoom granularity.
   *
   * The result is a single un-paginated list capped at 1000 cells; a viewport that
   * is too dense at the given `cell_size` returns 422 (coarsen `cell_size` or zoom
   * in). To list the individual assets behind a cell, call `list_assets` with a
   * tighter bounding box over the same filters. Album and person filters compose
   * using AND. Rating and media type can further restrict the cluster.
   *
   * @example
   * ```ts
   * const response = await client.assets.clusterByGeo({
   *   bbox: 'bbox',
   *   cell_size: 0,
   * });
   * ```
   */
  clusterByGeo(
    query: AssetClusterByGeoParams,
    options?: RequestOptions,
  ): APIPromise<AssetClusterByGeoResponse> {
    return this._client.get('/api/assets/geo-clusters', { query, ...options });
  }

  /**
   * Counts assets bucketed by time period — use this to summarize a library (or a
   * filtered slice) without paging through the full timeline. Returns one row per
   * bucket, newest-first by default or oldest-first when `order=asc`, with optional
   * filtering by album, album membership, people, rating, media type, date range, or
   * trash state.
   *
   * To list the actual assets within a bucket, call `list_assets` with the same
   * filters and a `local_datetime_after` / `local_datetime_before` window matching
   * the bucket. Does not filter by image content or location; for content-based
   * search use `search_assets`.
   *
   * **Pagination:** When `has_more` is true, pass the last `time_bucket` from `data`
   * as `starting_after_bucket`. Repeat the same `group_by`, `order`, date bounds,
   * and non-date filters. Count bounds, the cursor, and returned bucket starts are
   * timezone-naive local-calendar values.
   *
   * @example
   * ```ts
   * const assetCountResponse = await client.assets.counts();
   * ```
   */
  counts(
    query: AssetCountsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AssetCountResponse> {
    return this._client.get('/api/assets/counts', { query, ...options });
  }

  /**
   * Hard-deletes each specified asset — the database record, the stored file, and
   * all associated data (faces, album links, etc.). **Irreversible.** Prefer
   * `trash_assets` for the user's standard delete action so accidents can be
   * recovered.
   *
   * @example
   * ```ts
   * const response = await client.assets.deleteList({
   *   ids: ['string'],
   * });
   * ```
   */
  deleteList(params: AssetDeleteListParams, options?: RequestOptions): APIPromise<AssetDeleteListResponse> {
    const { library_id, ...body } = params;
    return this._client.delete('/api/assets', { query: { library_id }, body, ...options });
  }

  /**
   * Permanently deletes every trashed asset and its associated stored data from the
   * caller's library. **Irreversible**.
   *
   * @example
   * ```ts
   * const response = await client.assets.emptyTrash();
   * ```
   */
  emptyTrash(
    params: AssetEmptyTrashParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AssetEmptyTrashResponse> {
    const { library_id } = params ?? {};
    return this._client.post('/api/assets/empty-trash', { query: { library_id }, ...options });
  }

  /**
   * Restores trashed assets so they reappear in default list/search results.
   * Idempotent — assets that are already live are silently skipped.
   *
   * Pairs with `trash_assets`: assets soft-deleted there can be brought back here
   * within the retention window. To restore a whole trashed library, use
   * `restore_library`.
   *
   * @example
   * ```ts
   * const response = await client.assets.restore({
   *   ids: ['string'],
   * });
   * ```
   */
  restore(params: AssetRestoreParams, options?: RequestOptions): APIPromise<AssetRestoreResponse> {
    const { library_id, ...body } = params;
    return this._client.post('/api/assets/restore', { query: { library_id }, body, ...options });
  }

  /**
   * Soft-deletes the given assets. Trashed assets are excluded from default
   * list/search results and are purged after the configured retention window.
   * **Reversible** via `restore_assets` until purge.
   *
   * To trash an entire library at once instead of enumerating asset IDs, use
   * `trash_library`.
   *
   * @example
   * ```ts
   * const response = await client.assets.trash({
   *   ids: ['string'],
   * });
   * ```
   */
  trash(params: AssetTrashParams, options?: RequestOptions): APIPromise<AssetTrashResponse> {
    const { library_id, ...body } = params;
    return this._client.post('/api/assets/trash', { query: { library_id }, body, ...options });
  }

  /**
   * Edits the user-editable metadata for a single asset — description, rating, GPS
   * coordinates, and original capture datetime. Rating accepts 0-5, where 0
   * explicitly marks the asset unrated; passing null clears the USER override. Only
   * fields included in the request body are changed; others are left untouched.
   * Passing `null` for a field removes a previously-set value; the effective
   * response may still contain a value from another metadata source. `latitude` and
   * `longitude` must be set together (both written or both cleared).
   *
   * Setting or clearing GPS coordinates schedules an asynchronous refresh of derived
   * location names.
   *
   * For editing multiple assets in one round trip, prefer `bulk_update_assets`.
   *
   * @example
   * ```ts
   * const assetResponse = await client.assets.updateAsset(
   *   'asset_id',
   * );
   * ```
   */
  updateAsset(
    assetID: string,
    body: AssetUpdateAssetParams,
    options?: RequestOptions,
  ): APIPromise<AssetResponse> {
    return this._client.patch(path`/api/assets/${assetID}`, { body, ...options });
  }
}

export type AssetResponsesCursorPage = CursorPage<AssetResponse>;

export interface AssetCountResponse {
  /**
   * Time bucket and count pairs in the requested direction
   */
  data: Array<AssetCountResponse.Data>;

  /**
   * True if there are more time buckets. To fetch the next page, pass the last
   * `time_bucket` as `starting_after_bucket`. Keep the library scope, `group_by`,
   * `order`, `state`, date bounds, and every population filter unchanged.
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
   * Base64-encoded SHA-1 hash of the asset contents. May be null for older assets.
   */
  checksum_sha1?: string | null;
}

/**
 * Represents a photo or video asset with metadata and access URLs.
 *
 * Top-level fields describe the asset's current rendering (the version identified
 * by `current_version_id`) unless they explicitly name the original upload, like
 * `original_file_name` and the `file_data` group.
 */
export interface AssetResponse {
  /**
   * Unique asset identifier with 'asset\_' prefix
   */
  id: string;

  /**
   * When this asset record was created in the database
   */
  created_at: string;

  /**
   * ID (`asset_version_` prefix) of the current version, which the top-level
   * rendering fields describe. For a current derived version, this ID supplies the
   * path target for replacement or deletion.
   */
  current_version_id: string;

  /**
   * What produced the current rendering: `original` (the upload), `edit` (an edit
   * rendered by the client), or `external:<service>`. The namespace is open — derive
   * edited-ness as `kind != "original"`.
   */
  kind: string;

  /**
   * When the photo/video was taken, in the device's local timezone
   */
  local_datetime: string;

  /**
   * MIME type of the current rendering (e.g., 'image/jpeg', 'video/mp4').
   */
  mime_type: string;

  /**
   * Filename the asset was uploaded under.
   */
  original_file_name: string;

  /**
   * When this asset record was last updated
   */
  updated_at: string;

  /**
   * Named asset variants. Images: 'original', 'thumbnail', 'small', 'preview',
   * 'fullsize'. Videos: 'original', plus 'thumbnail_image', 'small_image',
   * 'preview_image', 'fullsize_image' pointing at the extracted still. 'original' is
   * served with a Content-Disposition attachment header (signed 'dl' filename param)
   * so a top-level navigation saves it to disk, while inline subresource loads
   * (<video>, fetch) still render it. Variant URLs are stable: a derived variant may
   * briefly 404 until its artifact is generated, then serve from the same URL.
   */
  asset_urls?: { [key: string]: Shared.AssetVariant } | null;

  /**
   * AI-generated description of the asset's content, quality, and composition. null
   * means description generation has not yet run; empty string means the model
   * refused to describe the asset. Distinct from metadata.description
   * (camera-embedded EXIF metadata).
   */
  description?: string | null;

  /**
   * Video length in seconds. `null` for images and for videos whose duration has not
   * been extracted yet.
   */
  duration?: number | null;

  /**
   * All faces detected in this asset. `null` when not requested via `include=faces`;
   * `[]` when requested but the asset has no faces.
   */
  faces?: Array<FacesAPI.FaceResponse> | null;

  /**
   * File/provenance scalars describing the uploaded _file_ (not its content).
   *
   * Returned only when requested via `include=file_data`; the whole object is `null`
   * otherwise. When present, every field carries its real value — `checksum_sha1` is
   * the lone exception (`null` for legacy rows that never had a SHA-1). This nested
   * object is the home for the file/provenance group.
   */
  file_data?: FileDataResponse | null;

  /**
   * Height of the current rendering in pixels.
   */
  height?: number;

  /**
   * Metadata for an asset — camera/EXIF fields, GPS, and location names.
   */
  metadata?: MetadataResponse | null;

  /**
   * ML-generated quality scores and other metrics. `null` when not requested via
   * `include=metrics`.
   */
  metrics?: { [key: string]: number | null } | null;

  /**
   * All unique people identified in this asset (deduplicated from faces). `null`
   * when not requested via `include=people`; `[]` when requested but none are
   * identified.
   */
  people?: Array<PeopleAPI.PersonResponse> | null;

  /**
   * ID of the stack this asset belongs to (`asset_stack_` prefix), or `null` when
   * the asset is not part of a stack. Group assets by this value to collapse a stack
   * into a single tile; the stack's own cover and member count are not carried on
   * the asset. Distinct from `metadata.auto_stack_id`, which is the camera's in-EXIF
   * `MakerNotes:AutoStackID` string — this is the server-assigned foreign key to the
   * asset's stack.
   */
  stack_id?: string | null;

  /**
   * Base64-encoded ThumbHash placeholder (~28 chars). Clients decode with the
   * `thumbhash` library (JS / Swift / Kotlin) to render an instant blurred preview
   * before the CDN thumbnail arrives. `null` while generation is pending.
   */
  thumbhash?: string | null;

  /**
   * When this asset was moved to trash (ISO 8601, UTC). `null` for live assets.
   * Trashed assets are excluded from default list/search results and are purged
   * after the configured retention window.
   */
  trashed_at?: string | null;

  /**
   * Width of the current rendering in pixels.
   */
  width?: number;
}

/**
 * File/provenance scalars describing the uploaded _file_ (not its content).
 *
 * Returned only when requested via `include=file_data`; the whole object is `null`
 * otherwise. When present, every field carries its real value — `checksum_sha1` is
 * the lone exception (`null` for legacy rows that never had a SHA-1). This nested
 * object is the home for the file/provenance group.
 */
export interface FileDataResponse {
  /**
   * Base64-encoded SHA-256 hash of the asset contents for duplicate detection and
   * integrity.
   */
  checksum: string;

  /**
   * Original asset identifier from the device that uploaded this asset.
   */
  device_asset_id: string;

  /**
   * Identifier of the device that uploaded this asset.
   */
  device_id: string;

  /**
   * When the file was created on the uploading device.
   */
  file_created_at: string;

  /**
   * When the file was last modified on the uploading device.
   */
  file_modified_at: string;

  /**
   * Size of the uploaded file in bytes. Each rendering's own size is on its row in
   * the asset's version listing.
   */
  file_size_bytes: number;

  /**
   * Base64-encoded SHA-1 hash of the asset contents. `null` for older assets that
   * have no SHA-1.
   */
  checksum_sha1?: string | null;
}

/**
 * Metadata for an asset — camera/EXIF fields, GPS, and location names.
 */
export interface MetadataResponse {
  /**
   * ID of the asset this metadata belongs to
   */
  asset_id: string;

  /**
   * When this metadata record was created
   */
  created_at: string;

  /**
   * When this metadata record was last updated
   */
  updated_at: string;

  /**
   * GPS altitude in meters
   */
  altitude?: number | null;

  /**
   * Identifier for automatic photo stacking
   */
  auto_stack_id?: string | null;

  /**
   * City name
   */
  city?: string | null;

  /**
   * Country name
   */
  country?: string | null;

  /**
   * ISO 3166-1 alpha-2 country code (e.g., 'US', 'JP')
   */
  country_code?: string | null;

  /**
   * Image description or caption
   */
  description?: string | null;

  /**
   * When the photo was digitized, with timezone offset if available
   */
  digitized_datetime?: string | null;

  /**
   * Human-readable location label. Picks the most specific available identifier
   * (place_name > sublocation > city > country) and appends broader context (city,
   * then state-or-country). Example: 'Golden Gate Bridge, San Francisco,
   * California'. Null when no location fields are populated.
   */
  display_label?: string | null;

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
   * When the file was last modified, with timezone offset if available
   */
  modified_datetime?: string | null;

  /**
   * Image orientation value (1-8) indicating rotation/flip: 1=normal, 2=mirror
   * horizontal, 3=rotate 180°, 4=mirror vertical, 5=mirror horizontal+rotate 90° CW,
   * 6=rotate 90° CW, 7=mirror horizontal+rotate 90° CCW, 8=rotate 90° CCW
   */
  orientation?: number | null;

  /**
   * When the photo was originally taken, with timezone offset if available
   */
  original_datetime?: string | null;

  /**
   * Landmark or point-of-interest name
   */
  place_name?: string | null;

  /**
   * Projection type (e.g., for 360° photos)
   */
  projection_type?: string | null;

  /**
   * Effective user-or-camera rating from `0` to `5` stars. `0` means unrated; values
   * outside this range are normalized to `0`.
   */
  rating?: number | null;

  /**
   * Height in pixels of the original encoded image, before the EXIF `orientation` is
   * applied. When both raw dimensions are positive, combine them with `orientation`
   * to derive the original upload's display dimensions. Null or zero means
   * unavailable; videos do not have raw dimensions.
   */
  raw_height?: number | null;

  /**
   * Width in pixels of the original encoded image, before the EXIF `orientation` is
   * applied. When both raw dimensions are positive, combine them with `orientation`
   * to derive the original upload's display dimensions. Null or zero means
   * unavailable; videos do not have raw dimensions.
   */
  raw_width?: number | null;

  /**
   * State/province name
   */
  state?: string | null;

  /**
   * Neighborhood or district
   */
  sublocation?: string | null;

  /**
   * IANA timezone identifier (e.g., 'America/Los_Angeles')
   */
  timezone?: string | null;
}

/**
 * Empty acknowledgment returned when an operation succeeds.
 */
export interface AssetDeleteResponse {}

/**
 * Empty acknowledgment returned by `bulk_update_assets`.
 */
export interface AssetBulkUpdateAssetsResponse {}

export interface AssetClusterByGeoResponse {
  /**
   * Non-empty grid cells within the requested viewport. Not paginated: the list is
   * capped at 1000 cells and a denser viewport returns 422 instead — coarsen
   * `cell_size` or zoom in.
   */
  data: Array<AssetClusterByGeoResponse.Data>;
}

export namespace AssetClusterByGeoResponse {
  export interface Data {
    /**
     * Number of assets in this grid cell.
     */
    count: number;

    /**
     * Cluster centroid latitude in decimal degrees — the average latitude of the
     * cell's members.
     */
    latitude: number;

    /**
     * Cluster centroid longitude in decimal degrees — the average longitude of the
     * cell's members.
     */
    longitude: number;

    /**
     * ID of a cover asset for the cell — the most recently captured geotagged asset in
     * it (ties broken by descending id).
     */
    representative_asset_id: string;
  }
}

/**
 * Empty acknowledgment returned when an operation succeeds.
 */
export interface AssetDeleteListResponse {}

/**
 * Empty acknowledgment returned when an operation succeeds.
 */
export interface AssetEmptyTrashResponse {}

/**
 * Empty acknowledgment returned when an operation succeeds.
 */
export interface AssetRestoreResponse {}

/**
 * Empty acknowledgment returned when an operation succeeds.
 */
export interface AssetTrashResponse {}

export interface AssetCreateParams {
  /**
   * The image or video file, sent as a binary multipart part with a filename. The
   * file's MIME type is derived from the filename extension and must be an image or
   * video type; files with an unrecognized or non-media extension are rejected
   * with 422. The filename is stored as the asset's original file name (maximum 1024
   * characters). The API imposes no fixed per-file size limit; uploads are
   * constrained only by the storage caps.
   */
  asset_data: Uploadable;

  /**
   * Identifier of this asset on the uploading device, chosen by the client (for
   * example, the device's local asset ID). Stored verbatim and usable for
   * device-based existence checks; plays no part in upload-time duplicate detection.
   */
  device_asset_id: string;

  /**
   * Identifier of the uploading device or client, chosen by the client. Paired with
   * `device_asset_id` for device-based existence checks.
   */
  device_id: string;

  /**
   * When the file was created on the uploading device, as an ISO 8601 datetime. Also
   * serves as the fallback for the asset's local capture time when the file's
   * embedded metadata carries no usable timestamp.
   */
  file_created_at: string;

  /**
   * When the file was last modified on the uploading device, as an ISO 8601
   * datetime.
   */
  file_modified_at: string;

  /**
   * Library to upload into. For an all-library credential, omit to use the account's
   * sole live library or create a fresh default when there are no live libraries;
   * pass explicitly when the account has multiple live libraries. For a
   * selected-library credential, omit to use its sole selected library; pass
   * explicitly when it selects multiple libraries.
   */
  library_id?: string | null;
}

export interface AssetRetrieveParams {
  /**
   * Opt-in expansion fields. Supported values: `metadata` (camera/EXIF/GPS and
   * location names), `faces`, `people`, `metrics` (ML quality scores), `file_data`
   * (a group token populating the nested `file_data` object with the file/provenance
   * scalars `device_asset_id`, `device_id`, `file_created_at`, `file_modified_at`,
   * `checksum`, `checksum_sha1`, `file_size_bytes`), and `variants` (every
   * `asset_urls` rung beyond the lean one. Without it `asset_urls` carries only its
   * lean rung — `thumbnail` for an image, or `thumbnail_image` for a video — so
   * callers that render non-thumbnail variants or download the current rendering
   * must pass it). Accepts multiple `include=` query params or a single
   * comma-delimited value (e.g. `include=faces,people`). Unknown values return 422.
   * When omitted, only the lean core is returned (`id`, `mime_type`,
   * `local_datetime`, dimensions, `description`, `thumbhash`, `asset_urls`, `kind`,
   * `current_version_id`) and each data field above is null/absent until you request
   * it.
   */
  include?: Array<string> | null;
}

export interface AssetListParams extends CursorPageParams {
  /**
   * Filter by album membership in general, rather than by membership of one specific
   * album. This filter is independent of `album_id`, but combining `not_in_album`
   * with `album_id` is contradictory and returns 422. Defaults to `all`.
   */
  album_filter?: 'all' | 'in_album' | 'not_in_album';

  /**
   * Return only assets in this album — the album's `album_` ID, not its name. To
   * browse one album's full asset metadata, prefer this filter over
   * `list_album_assets`, which returns link records.
   */
  album_id?: string | null;

  /**
   * Bounding-box (map viewport) location filter: four comma-separated decimal-degree
   * numbers `min_longitude,min_latitude,max_longitude,max_latitude`
   * (west,south,east,north), e.g. `-77.1,38.9,-77.0,39.0`. A box whose
   * `min_longitude` exceeds `max_longitude` crosses the antimeridian: it selects the
   * band running east from `min_longitude` over ±180° to `max_longitude`, so there
   * is no need to split it client-side. Longitude order is therefore significant —
   * transposed corners read as a crossing viewport, not as an error. A viewport 360°
   * or wider must be sent as the full range `-180,...,180,...`, which the wrapped
   * form cannot express. Mutually exclusive with `center`/`radius`.
   */
  bbox?: string | null;

  /**
   * Center point of a radius location filter: two comma-separated decimal-degree
   * numbers `longitude,latitude`, e.g. `-77.05,38.95`. Supply with `radius`.
   * Mutually exclusive with `bbox`.
   */
  center?: string | null;

  /**
   * Look up specific assets by ID (max 200; each ID has the `asset_` prefix).
   * Accepts multiple `ids=` query params or a single comma-delimited value (e.g.,
   * `ids=asset_1,asset_2`). Combines with other filters (album_id, person_ids,
   * stack_id, media_type, ratings, datetime range) using AND logic — the result is
   * the intersection.
   */
  ids?: Array<string> | null;

  /**
   * Opt-in expansion fields. Supported values: `metadata` (camera/EXIF/GPS and
   * location names), `faces`, `people`, `metrics` (ML quality scores), `file_data`
   * (a group token populating the nested `file_data` object with the file/provenance
   * scalars `device_asset_id`, `device_id`, `file_created_at`, `file_modified_at`,
   * `checksum`, `checksum_sha1`, `file_size_bytes`), and `variants` (every
   * `asset_urls` rung beyond the lean one. Without it `asset_urls` carries only its
   * lean rung — `thumbnail` for an image, or `thumbnail_image` for a video — so
   * callers that render non-thumbnail variants or download the current rendering
   * must pass it). Accepts multiple `include=` query params or a single
   * comma-delimited value (e.g. `include=faces,people`). Unknown values return 422.
   * When omitted, only the lean core is returned (`id`, `mime_type`,
   * `local_datetime`, dimensions, `description`, `thumbhash`, `asset_urls`, `kind`,
   * `current_version_id`) and each data field above is null/absent until you request
   * it.
   */
  include?: Array<string> | null;

  /**
   * Library to list assets from. Optional if the user has a single live
   * (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;

  /**
   * Only include assets captured strictly after this instant (ISO 8601; exclusive).
   * Convert a relative or natural-language date phrase ('in 2023') into an explicit
   * bound before sending. `local_datetime` is the photo's wall-clock time in the
   * device's own timezone. Naive values compare directly against `local_datetime`.
   * Timezone-aware values: assets with a known offset are compared in UTC
   * (`local_datetime - offset`); assets without an offset fall back to wall-clock
   * comparison against `local_datetime`.
   */
  local_datetime_after?: string | null;

  /**
   * Only include assets captured strictly before this instant (ISO 8601; exclusive).
   * Same conversion requirement and awareness/offset semantics as
   * `local_datetime_after`.
   */
  local_datetime_before?: string | null;

  /**
   * Filter to one media class (`image` or `video`). Omit to include both images and
   * videos.
   */
  media_type?: 'image' | 'video' | null;

  /**
   * Sort direction for the selected state's timestamp: capture time for
   * `live`/`all`, or trash time for `trashed`. The asset ID tie-breaker uses the
   * same direction.
   */
  order?: 'asc' | 'desc';

  /**
   * Filter to assets containing faces belonging to ALL of these people
   * (intersection, not union). Accepts up to 200 IDs across repeated `person_ids=`
   * query params or comma-delimited values. Person IDs are carried by the entries of
   * an asset's `people` field (returned with `include=people`).
   */
  person_ids?: Array<string> | null;

  /**
   * Radius of the `center` location filter, in meters (greater than 0, at most
   * 50000).
   */
  radius?: number | null;

  /**
   * Return assets whose effective rating is one of these exact values. Values must
   * be integers from `0` through `5`; `5` is a favorite. `0` matches every unrated
   * form: an explicit zero, a null or legacy out-of-range effective rating, or an
   * asset with no metadata. Accepts repeated `ratings=` parameters or one
   * comma-delimited value. Omit the parameter for no rating filter.
   */
  ratings?: Array<number> | null;

  /**
   * Return only assets belonging to this stack (the `asset_stack_` ID carried by the
   * `stack_id` field on every asset).
   */
  stack_id?: string | null;

  /**
   * Which set of assets to read from: `live` (default — only assets that are not
   * trashed), `trashed` (only trashed assets, ordered by trash time), or `all` (both
   * live and trashed, ordered by capture time like `live`). Ordering defaults to
   * newest or most recently trashed first.
   */
  state?: 'live' | 'trashed' | 'all';
}

export interface AssetBulkUpdateAssetsParams {
  /**
   * List of per-asset updates. Each item carries the target asset id and the change
   * to apply to it; different fields can be changed on different assets in the same
   * request. Up to 200 items per request.
   */
  updates: Array<AssetBulkUpdateAssetsParams.Update>;
}

export namespace AssetBulkUpdateAssetsParams {
  /**
   * One asset update in a bulk request.
   */
  export interface Update {
    /**
     * Asset ID (with the `asset_` prefix) to apply this change to.
     */
    id: string;

    /**
     * The change to apply to this asset. Same shape as the body of the single-asset
     * `update_asset` endpoint — same fields, same validation, same
     * null-clears-the-override semantics.
     */
    change: Update.Change;
  }

  export namespace Update {
    /**
     * The change to apply to this asset. Same shape as the body of the single-asset
     * `update_asset` endpoint — same fields, same validation, same
     * null-clears-the-override semantics.
     */
    export interface Change {
      /**
       * User-set description for the asset. Pass `null` to remove a previously-set
       * value; the effective response may still contain a description from another
       * metadata source. Omit to leave unchanged. Distinct from the AI-generated
       * `description` field on the response — this writes to `metadata.description`.
       */
      description?: string | null;

      /**
       * GPS latitude in decimal degrees, `[-90, 90]`. Must be set together with
       * `longitude`. Pass `null` (along with `longitude=null`) to remove a
       * previously-set value; omit to leave unchanged.
       */
      latitude?: number | null;

      /**
       * GPS longitude in decimal degrees, `[-180, 180]`. Must be set together with
       * `latitude`. Pass `null` (along with `latitude=null`) to remove a previously-set
       * value; omit to leave unchanged.
       */
      longitude?: number | null;

      /**
       * When the asset was originally captured. Timezone-aware values preserve their UTC
       * offset; timezone-naive values have no offset. Pass `null` to remove a
       * previously-set value; the effective response may still contain a datetime from
       * another metadata source. Omit to leave unchanged.
       */
      original_datetime?: string | null;

      /**
       * Star rating, `0`-`5`. `5` is the value a favorite carries. `0` explicitly marks
       * the asset unrated, masking any rating embedded in the file. Pass `null` to
       * remove a previously-set value and let the file's embedded rating (if any) show
       * through; omit to leave unchanged. Values outside `0`-`5` are rejected.
       */
      rating?: number | null;

      [k: string]: unknown;
    }
  }
}

export interface AssetCheckExistenceParams {
  /**
   * Query param: Library to check assets in. Optional if the user has a single live
   * (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;

  /**
   * Body param: List of base64-encoded SHA-1 checksums to check for existence
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

export interface AssetClusterByGeoParams {
  /**
   * Bounding-box (map viewport) location filter: four comma-separated decimal-degree
   * numbers `min_longitude,min_latitude,max_longitude,max_latitude`
   * (west,south,east,north), e.g. `-77.1,38.9,-77.0,39.0`. A box whose
   * `min_longitude` exceeds `max_longitude` crosses the antimeridian: it selects the
   * band running east from `min_longitude` over ±180° to `max_longitude`, so there
   * is no need to split it client-side. Longitude order is therefore significant —
   * transposed corners read as a crossing viewport, not as an error. A viewport 360°
   * or wider must be sent as the full range `-180,...,180,...`, which the wrapped
   * form cannot express.
   */
  bbox: string;

  /**
   * Grid cell edge in decimal degrees — the clustering granularity. Larger values
   * give coarser clusters; the client maps map-zoom to `cell_size`. Must be at least
   * 0.0001 (~11 m).
   */
  cell_size: number;

  /**
   * Filter by album membership in general, rather than by membership of one specific
   * album. This filter is independent of `album_id`, but combining `not_in_album`
   * with `album_id` is contradictory and returns 422. Defaults to `all`.
   */
  album_filter?: 'all' | 'in_album' | 'not_in_album';

  /**
   * Return only assets in this album — the album's `album_` ID, not its name.
   */
  album_id?: string | null;

  /**
   * Library to cluster assets from. Optional if the user has a single live
   * (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;

  /**
   * Only include assets captured strictly after this instant (ISO 8601; exclusive).
   * Convert a relative or natural-language date phrase ('in 2023') into an explicit
   * bound before sending. `local_datetime` is the photo's wall-clock time in the
   * device's own timezone. Naive values compare directly against `local_datetime`.
   * Timezone-aware values: assets with a known offset are compared in UTC
   * (`local_datetime - offset`); assets without an offset fall back to wall-clock
   * comparison against `local_datetime`.
   */
  local_datetime_after?: string | null;

  /**
   * Only include assets captured strictly before this instant (ISO 8601; exclusive).
   * Same conversion requirement and awareness/offset semantics as
   * `local_datetime_after`.
   */
  local_datetime_before?: string | null;

  /**
   * Filter to one media class (`image` or `video`). Omit to include both images and
   * videos.
   */
  media_type?: 'image' | 'video' | null;

  /**
   * Filter to assets containing faces belonging to ALL of these people
   * (intersection, not union). Accepts up to 200 IDs across repeated `person_ids=`
   * query params or comma-delimited values. Person IDs are carried by the entries of
   * an asset's `people` field (returned with `include=people`).
   */
  person_ids?: Array<string> | null;

  /**
   * Return assets whose effective rating is one of these exact values. Values must
   * be integers from `0` through `5`; `5` is a favorite. `0` matches every unrated
   * form: an explicit zero, a null or legacy out-of-range effective rating, or an
   * asset with no metadata. Accepts repeated `ratings=` parameters or one
   * comma-delimited value. Omit the parameter for no rating filter.
   */
  ratings?: Array<number> | null;

  /**
   * Which set of assets to cluster: `live` (default — excludes trashed assets),
   * `trashed` (only trashed assets), or `all` (both).
   */
  state?: 'live' | 'trashed' | 'all';
}

export interface AssetCountsParams {
  /**
   * Filter by album membership in general, rather than by membership of one specific
   * album. This filter is independent of `album_id`, but combining `not_in_album`
   * with `album_id` is contradictory and returns 422. Defaults to `all`.
   */
  album_filter?: 'all' | 'in_album' | 'not_in_album';

  /**
   * Return only assets in this album — the album's `album_` ID, not its name.
   */
  album_id?: string | null;

  /**
   * Calendar period to use for each count bucket.
   */
  group_by?: 'day' | 'week' | 'month' | 'year';

  /**
   * Library to count assets in. Optional if the user has a single live (non-trashed)
   * library; required when they have multiple.
   */
  library_id?: string | null;

  /**
   * Maximum number of time buckets to return per page (1–200). Defaults to 20.
   */
  limit?: number;

  /**
   * Only include assets captured strictly after this local wall-clock datetime (ISO
   * 8601; exclusive). Asset counts accept timezone-naive values only; a `Z` suffix
   * or timezone offset returns 422. Repeat this bound unchanged on every pagination
   * page.
   */
  local_datetime_after?: string | null;

  /**
   * Only include assets captured strictly before this local wall-clock datetime (ISO
   * 8601; exclusive). Asset counts accept timezone-naive values only; a `Z` suffix
   * or timezone offset returns 422. Repeat this bound unchanged on every pagination
   * page.
   */
  local_datetime_before?: string | null;

  /**
   * Filter to one media class (`image` or `video`). Omit to include both images and
   * videos.
   */
  media_type?: 'image' | 'video' | null;

  /**
   * Sort direction for capture-date buckets: `desc` returns newest buckets first;
   * `asc` returns oldest buckets first.
   */
  order?: 'asc' | 'desc';

  /**
   * @deprecated Deprecated compatibility alias for one `person_ids` value. Do not
   * combine it with `person_ids`.
   */
  person_id?: string | null;

  /**
   * Filter to assets containing faces belonging to ALL of these people
   * (intersection, not union). Accepts up to 200 IDs across repeated `person_ids=`
   * query params or comma-delimited values. Person IDs are carried by the entries of
   * an asset's `people` field (returned with `include=people`).
   */
  person_ids?: Array<string> | null;

  /**
   * Return assets whose effective rating is one of these exact values. Values must
   * be integers from `0` through `5`; `5` is a favorite. `0` matches every unrated
   * form: an explicit zero, a null or legacy out-of-range effective rating, or an
   * asset with no metadata. Accepts repeated `ratings=` parameters or one
   * comma-delimited value. Omit the parameter for no rating filter.
   */
  ratings?: Array<number> | null;

  /**
   * Cursor for time-bucket pagination. Pass the last returned `time_bucket`
   * unchanged; buckets after it in the requested `order` are returned. Omit for the
   * first page.
   */
  starting_after_bucket?: string | null;

  /**
   * Which set of assets to count: `live` (default — excludes trashed assets),
   * `trashed` (only trashed assets), or `all` (both live and trashed).
   */
  state?: 'live' | 'trashed' | 'all';
}

export interface AssetDeleteListParams {
  /**
   * Body param: Asset IDs (each with the `asset_` prefix) to operate on. Up to 200
   * ids per request.
   */
  ids: Array<string>;

  /**
   * Query param: Library that owns the assets. Optional if the user has a single
   * live (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;
}

export interface AssetEmptyTrashParams {
  /**
   * Library whose trashed assets to permanently delete. Optional if the user has a
   * single live (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;
}

export interface AssetRestoreParams {
  /**
   * Body param: Asset IDs (each with the `asset_` prefix) to operate on. Up to 200
   * ids per request.
   */
  ids: Array<string>;

  /**
   * Query param: Library that owns the assets. Optional if the user has a single
   * live (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;
}

export interface AssetTrashParams {
  /**
   * Body param: Asset IDs (each with the `asset_` prefix) to operate on. Up to 200
   * ids per request.
   */
  ids: Array<string>;

  /**
   * Query param: Library that owns the assets. Optional if the user has a single
   * live (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;
}

export interface AssetUpdateAssetParams {
  /**
   * User-set description for the asset. Pass `null` to remove a previously-set
   * value; the effective response may still contain a description from another
   * metadata source. Omit to leave unchanged. Distinct from the AI-generated
   * `description` field on the response — this writes to `metadata.description`.
   */
  description?: string | null;

  /**
   * GPS latitude in decimal degrees, `[-90, 90]`. Must be set together with
   * `longitude`. Pass `null` (along with `longitude=null`) to remove a
   * previously-set value; omit to leave unchanged.
   */
  latitude?: number | null;

  /**
   * GPS longitude in decimal degrees, `[-180, 180]`. Must be set together with
   * `latitude`. Pass `null` (along with `latitude=null`) to remove a previously-set
   * value; omit to leave unchanged.
   */
  longitude?: number | null;

  /**
   * When the asset was originally captured. Timezone-aware values preserve their UTC
   * offset; timezone-naive values have no offset. Pass `null` to remove a
   * previously-set value; the effective response may still contain a datetime from
   * another metadata source. Omit to leave unchanged.
   */
  original_datetime?: string | null;

  /**
   * Star rating, `0`-`5`. `5` is the value a favorite carries. `0` explicitly marks
   * the asset unrated, masking any rating embedded in the file. Pass `null` to
   * remove a previously-set value and let the file's embedded rating (if any) show
   * through; omit to leave unchanged. Values outside `0`-`5` are rejected.
   */
  rating?: number | null;

  [k: string]: unknown;
}

Assets.Versions = Versions;

export declare namespace Assets {
  export {
    type AssetCountResponse as AssetCountResponse,
    type AssetExistenceResponse as AssetExistenceResponse,
    type AssetLiteResponse as AssetLiteResponse,
    type AssetResponse as AssetResponse,
    type FileDataResponse as FileDataResponse,
    type MetadataResponse as MetadataResponse,
    type AssetDeleteResponse as AssetDeleteResponse,
    type AssetBulkUpdateAssetsResponse as AssetBulkUpdateAssetsResponse,
    type AssetClusterByGeoResponse as AssetClusterByGeoResponse,
    type AssetDeleteListResponse as AssetDeleteListResponse,
    type AssetEmptyTrashResponse as AssetEmptyTrashResponse,
    type AssetRestoreResponse as AssetRestoreResponse,
    type AssetTrashResponse as AssetTrashResponse,
    type AssetResponsesCursorPage as AssetResponsesCursorPage,
    type AssetCreateParams as AssetCreateParams,
    type AssetRetrieveParams as AssetRetrieveParams,
    type AssetListParams as AssetListParams,
    type AssetBulkUpdateAssetsParams as AssetBulkUpdateAssetsParams,
    type AssetCheckExistenceParams as AssetCheckExistenceParams,
    type AssetClusterByGeoParams as AssetClusterByGeoParams,
    type AssetCountsParams as AssetCountsParams,
    type AssetDeleteListParams as AssetDeleteListParams,
    type AssetEmptyTrashParams as AssetEmptyTrashParams,
    type AssetRestoreParams as AssetRestoreParams,
    type AssetTrashParams as AssetTrashParams,
    type AssetUpdateAssetParams as AssetUpdateAssetParams,
  };

  export {
    Versions as Versions,
    type AssetVersionResponse as AssetVersionResponse,
    type VersionListResponse as VersionListResponse,
    type VersionListParams as VersionListParams,
    type VersionDeleteParams as VersionDeleteParams,
    type VersionAppendParams as VersionAppendParams,
    type VersionReplaceParams as VersionReplaceParams,
    type VersionRevertParams as VersionRevertParams,
  };
}
