// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as FacesAPI from './faces';
import * as PeopleAPI from './people';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../core/pagination';
import { type Uploadable } from '../core/uploads';
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
   * Fetches one asset and its associated metadata by ID. Use this when you already
   * have a specific asset ID (e.g., from `list_assets`, `search_assets`, or
   * `list_album_assets`) and need its full details. For bulk fetch of multiple known
   * IDs, prefer `list_assets` with the `ids` parameter to avoid N round trips.
   * `asset_urls` are signed URLs for client rendering only; to visually inspect the
   * image pixels, call `view_asset` instead.
   */
  retrieve(
    assetID: string,
    query: AssetRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AssetResponse> {
    return this._client.get(path`/api/assets/${assetID}`, { query, ...options });
  }

  /**
   * Returns a paginated list of assets ordered by local capture time (newest first),
   * optionally filtered by album, person, date range, geographic area, or asset ID.
   * Use this tool for structured browsing and filtering — when the request can be
   * expressed as exact filters on album membership, people, date range, geographic
   * coordinates, or specific asset IDs.
   *
   * **Location filtering is by coordinate:** pass a radius (`center` + `radius`) or
   * a bounding box (`bbox`) to restrict results to a geographic area. The two modes
   * are mutually exclusive. To count or cluster geotagged assets across a map
   * viewport (how many photos fall in each area) rather than list them, use
   * `get_geo_clusters`.
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
   * associated data (faces, album links, etc.). **Irreversible.** Prefer
   * `trash_assets` for the user's standard delete action so accidents can be
   * recovered.
   *
   * **Use `remove_assets_from_album` instead** when the user only wants to remove an
   * asset from a specific album but keep the file in their library. Use
   * `delete_album` to remove an album without deleting its assets.
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
   * Up to 100 items per request; over-cap requests return 422. For a single-asset
   * edit, prefer `update_asset` — semantically identical but slightly more concise
   * at the call site.
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
   * in). A viewport whose `min_longitude` exceeds `max_longitude` (crossing the
   * antimeridian) returns no cells — split it into two requests client-side. To list
   * the individual assets behind a cell, call `list_assets` with a tighter bounding
   * box over the same filters.
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
   * bucket, ordered most-recent-first, with optional filtering by album, person,
   * date range, or trash state.
   *
   * To list the actual assets within a bucket, call `list_assets` with the same
   * filters and a `local_datetime_after` / `local_datetime_before` window matching
   * the bucket. Does not filter by image content or location; for content-based
   * search use `search_assets`.
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

  /**
   * Hard-deletes each specified asset — the database record, the stored file, and
   * all associated data (faces, album links, etc.). **Irreversible.** Prefer
   * `trash_assets` for the user's standard delete action so accidents can be
   * recovered.
   *
   * Up to 100 ids per request; over-cap requests return 422.
   */
  deleteList(params: AssetDeleteListParams, options?: RequestOptions): APIPromise<AssetDeleteListResponse> {
    const { library_id, ...body } = params;
    return this._client.delete('/api/assets', { query: { library_id }, body, ...options });
  }

  /**
   * Permanently deletes every trashed asset in the caller's library in one shot —
   * storage and CDN are cleaned up via the same outbox path as the scheduled purge
   * task. **Irreversible**. Deliberately not exposed as an MCP tool.
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
   * Use this for the user's standard 'delete' action — there is no MCP-exposed
   * permanent-delete tool, so trash is the only path. To trash an entire library at
   * once instead of enumerating asset IDs, use `trash_library`.
   */
  trash(params: AssetTrashParams, options?: RequestOptions): APIPromise<AssetTrashResponse> {
    const { library_id, ...body } = params;
    return this._client.post('/api/assets/trash', { query: { library_id }, body, ...options });
  }

  /**
   * Edits the user-editable metadata for a single asset — description, GPS
   * coordinates, and original capture datetime. Only fields included in the request
   * body are changed; others are left untouched. Passing `null` for a field removes
   * a previously-set value; the response then falls back to the value embedded in
   * the file when present. `latitude` and `longitude` must be set together (both
   * written or both cleared).
   *
   * Setting or clearing GPS coordinates re-enqueues reverse geocoding so location
   * names refresh against the new effective coordinates.
   *
   * For editing multiple assets in one round trip, prefer `bulk_update_assets`.
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
   * When this asset record was created in the database
   */
  created_at: string;

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
   * Height of the asset in pixels
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
   * ID of the burst stack this asset belongs to (`asset_stack_` prefix), or `null`
   * when the asset is not part of a stack. Group assets by this value to collapse a
   * burst into a single tile; the stack's own cover and member count are not carried
   * on the asset. Distinct from `metadata.auto_stack_id`, which is the camera's
   * in-EXIF `MakerNotes:AutoStackID` string — this is the server-assigned foreign
   * key to the asset's stack.
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
   * Width of the asset in pixels
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
   * File size of the asset in bytes.
   */
  file_size_bytes: number;

  /**
   * Base64-encoded SHA-1 hash for Immich client compatibility. `null` for older
   * assets that have no SHA-1.
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
   * User or camera rating (typically 1-5 stars)
   */
  rating?: number | null;

  /**
   * Pre-rotation raw height; null when not available
   */
  raw_height?: number | null;

  /**
   * Pre-rotation raw width; null when not available
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
 * Acknowledgment body returned by destructive endpoints (delete / trash / restore
 * / permanently delete / remove-from-album / empty-trash).
 *
 * Carries no fields — the HTTP 200 + empty JSON object is itself the success
 * signal. Exists so MCP tools generated from these endpoints have a real
 * `outputSchema` (rather than the null schema FastMCP emits for 204 responses),
 * which ChatGPT's MCP submission tooling requires.
 */
export interface AssetDeleteResponse {}

/**
 * Acknowledgment body for `POST /api/assets/bulk-update`.
 *
 * Empty by design; exists so MCP tools generated from this endpoint have a real
 * `outputSchema`. Distinct from `DeletionResponse` because that name is
 * purpose-scoped to destructive operations — reusing it on a non-destructive
 * endpoint would misname the wire shape in OpenAPI and generated SDKs.
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
 * Acknowledgment body returned by destructive endpoints (delete / trash / restore
 * / permanently delete / remove-from-album / empty-trash).
 *
 * Carries no fields — the HTTP 200 + empty JSON object is itself the success
 * signal. Exists so MCP tools generated from these endpoints have a real
 * `outputSchema` (rather than the null schema FastMCP emits for 204 responses),
 * which ChatGPT's MCP submission tooling requires.
 */
export interface AssetDeleteListResponse {}

/**
 * Acknowledgment body returned by destructive endpoints (delete / trash / restore
 * / permanently delete / remove-from-album / empty-trash).
 *
 * Carries no fields — the HTTP 200 + empty JSON object is itself the success
 * signal. Exists so MCP tools generated from these endpoints have a real
 * `outputSchema` (rather than the null schema FastMCP emits for 204 responses),
 * which ChatGPT's MCP submission tooling requires.
 */
export interface AssetEmptyTrashResponse {}

/**
 * Acknowledgment body returned by destructive endpoints (delete / trash / restore
 * / permanently delete / remove-from-album / empty-trash).
 *
 * Carries no fields — the HTTP 200 + empty JSON object is itself the success
 * signal. Exists so MCP tools generated from these endpoints have a real
 * `outputSchema` (rather than the null schema FastMCP emits for 204 responses),
 * which ChatGPT's MCP submission tooling requires.
 */
export interface AssetRestoreResponse {}

/**
 * Acknowledgment body returned by destructive endpoints (delete / trash / restore
 * / permanently delete / remove-from-album / empty-trash).
 *
 * Carries no fields — the HTTP 200 + empty JSON object is itself the success
 * signal. Exists so MCP tools generated from these endpoints have a real
 * `outputSchema` (rather than the null schema FastMCP emits for 204 responses),
 * which ChatGPT's MCP submission tooling requires.
 */
export interface AssetTrashResponse {}

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

export interface AssetRetrieveParams {
  /**
   * Opt-in expansion fields. Supported values: `metadata` (camera/EXIF/GPS and
   * location names), `faces`, `people`, `metrics` (ML quality scores), `file_data`
   * (a group token populating the nested `file_data` object with the file/provenance
   * scalars `device_asset_id`, `device_id`, `file_created_at`, `file_modified_at`,
   * `checksum`, `checksum_sha1`, `file_size_bytes`), and `variants` (the
   * non-thumbnail `asset_urls` size variants; without it `asset_urls` carries only
   * its lean rung — `thumbnail`, or `thumbnail_image` for a video with an extracted
   * still, or `original` for a still-less video — so callers that render
   * non-thumbnail variants must pass it). Accepts multiple `include=` query params
   * or a single comma-delimited value (e.g. `include=faces,people`). Unknown values
   * return 422. When omitted, only the lean core is returned (`id`, `mime_type`,
   * `local_datetime`, dimensions, `description`, `thumbhash`, `asset_urls`) and each
   * data field above is null/absent until you request it.
   */
  include?: Array<string> | null;
}

export interface AssetListParams extends CursorPageParams {
  /**
   * Return only assets that are in the album with this ID. Equivalent to calling
   * `list_album_assets` with `album_id` and then fetching each asset — prefer this
   * param when you need the full asset metadata in one call.
   */
  album_id?: string | null;

  /**
   * Bounding-box (map viewport) location filter: four comma-separated decimal-degree
   * numbers `min_longitude,min_latitude,max_longitude,max_latitude`
   * (west,south,east,north), e.g. `-77.1,38.9,-77.0,39.0`. Mutually exclusive with
   * `center`/`radius`. A box whose `min_longitude` exceeds `max_longitude`
   * (antimeridian-crossing) is accepted but matches nothing — split it client-side.
   */
  bbox?: string | null;

  /**
   * Center point of a radius location filter: two comma-separated decimal-degree
   * numbers `longitude,latitude`, e.g. `-77.05,38.95`. Supply with `radius`.
   * Mutually exclusive with `bbox`.
   */
  center?: string | null;

  /**
   * Look up specific assets by ID (max 100; each ID has the `asset_` prefix).
   * Accepts multiple `ids=` query params or a single comma-delimited value (e.g.,
   * `ids=asset_1,asset_2`). Combines with other filters (album_id, person_id,
   * stack_id, datetime range) using AND logic — the result is the intersection.
   */
  ids?: Array<string> | null;

  /**
   * Opt-in expansion fields. Supported values: `metadata` (camera/EXIF/GPS and
   * location names), `faces`, `people`, `metrics` (ML quality scores), `file_data`
   * (a group token populating the nested `file_data` object with the file/provenance
   * scalars `device_asset_id`, `device_id`, `file_created_at`, `file_modified_at`,
   * `checksum`, `checksum_sha1`, `file_size_bytes`), and `variants` (the
   * non-thumbnail `asset_urls` size variants; without it `asset_urls` carries only
   * its lean rung — `thumbnail`, or `thumbnail_image` for a video with an extracted
   * still, or `original` for a still-less video — so callers that render
   * non-thumbnail variants must pass it). Accepts multiple `include=` query params
   * or a single comma-delimited value (e.g. `include=faces,people`). Unknown values
   * return 422. When omitted, only the lean core is returned (`id`, `mime_type`,
   * `local_datetime`, dimensions, `description`, `thumbhash`, `asset_urls`) and each
   * data field above is null/absent until you request it.
   */
  include?: Array<string> | null;

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

  /**
   * Radius of the `center` location filter, in meters (greater than 0, at most
   * 50000).
   */
  radius?: number | null;

  /**
   * Return only assets belonging to this burst stack (the `asset_stack_` ID carried
   * by the `stack_id` field on every asset).
   */
  stack_id?: string | null;

  /**
   * Which set of assets to read from: `live` (default — only assets that are not
   * trashed), `trashed` (only trashed assets, ordered by most recently trashed), or
   * `all` (both live and trashed, ordered by capture time like `live`).
   */
  state?: 'live' | 'trashed' | 'all';
}

export interface AssetBulkUpdateAssetsParams {
  /**
   * List of per-asset updates. Each item carries the target asset id and the change
   * to apply to it; different fields can be changed on different assets in the same
   * request. Up to 100 items per request.
   */
  updates: Array<AssetBulkUpdateAssetsParams.Update>;
}

export namespace AssetBulkUpdateAssetsParams {
  /**
   * One item in a bulk-update request.
   *
   * Names the target asset and carries the per-asset change to apply. The `change`
   * object is exactly the body shape that the single-asset
   * `PATCH /api/assets/{asset_id}` endpoint accepts; the wrapper exists so
   * operation-level metadata (`id`, future `if_match` / idempotency-key fields)
   * stays in a namespace disjoint from the entity-field changes.
   */
  export interface Update {
    /**
     * Asset ID (with the `asset_` prefix) to apply this change to. Obtain from
     * `list_assets`, `search_assets`, or `list_album_assets`.
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
       * User-set description for the asset. Pass `null` to remove a previously-set value
       * (the response then falls back to the description embedded in the file, if any).
       * Omit to leave unchanged. Distinct from the AI-generated `description` field on
       * the response — this writes to `metadata.description`.
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
       * When the asset was originally captured. Aware values store the offset from
       * `utcoffset()` alongside; naive values store NULL offset. Pass `null` to remove a
       * previously-set value — the response then falls back to the datetime embedded in
       * the file when present, otherwise to the file's upload timestamp. Omit to leave
       * unchanged.
       */
      original_datetime?: string | null;

      [k: string]: unknown;
    }
  }
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

export interface AssetClusterByGeoParams {
  /**
   * Map viewport as four comma-separated decimal-degree numbers
   * `min_longitude,min_latitude,max_longitude,max_latitude` (west,south,east,north),
   * e.g. `-77.1,38.9,-77.0,39.0`. A box whose `min_longitude` exceeds
   * `max_longitude` (antimeridian-crossing) returns no cells — split it client-side.
   */
  bbox: string;

  /**
   * Grid cell edge in decimal degrees — the clustering granularity. Larger values
   * give coarser clusters; the client maps map-zoom to `cell_size`. Must be at least
   * 0.0001 (~11 m).
   */
  cell_size: number;

  /**
   * Return only assets that are in the album with this ID.
   */
  album_id?: string | null;

  /**
   * Library to cluster assets from. Optional if the user has a single library;
   * required when they have multiple.
   */
  library_id?: string | null;

  /**
   * Only include assets captured strictly after this instant (ISO 8601; exclusive).
   * Same awareness/offset semantics as on `list_assets`.
   */
  local_datetime_after?: string | null;

  /**
   * Only include assets captured strictly before this instant (ISO 8601; exclusive).
   * Same awareness/offset semantics as on `list_assets`.
   */
  local_datetime_before?: string | null;

  /**
   * Return only assets containing a face belonging to this person.
   */
  person_id?: string | null;

  /**
   * Which set of assets to cluster: `live` (default — excludes trashed assets),
   * `trashed` (only trashed assets), or `all` (both).
   */
  state?: 'live' | 'trashed' | 'all';
}

export interface AssetCountsParams {
  /**
   * Filter by assets in a specific album
   */
  album_id?: string | null;

  /**
   * Time period to group counts by. Only `month` is supported; other values
   * return 422.
   */
  group_by?: 'month';

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

  /**
   * Which set of assets to count: `live` (default — excludes trashed assets),
   * `trashed` (only trashed assets), or `all` (both live and trashed).
   */
  state?: 'live' | 'trashed' | 'all';
}

export interface AssetDeleteListParams {
  /**
   * Body param: Asset IDs (each with the `asset_` prefix) to operate on. Up to 100
   * ids per request.
   */
  ids: Array<string>;

  /**
   * Query param: Library that owns the assets. Optional if the user has a single
   * library; required when they have multiple.
   */
  library_id?: string | null;
}

export interface AssetEmptyTrashParams {
  /**
   * Library whose trashed assets to permanently delete. Optional if the user has a
   * single library; required when they have multiple.
   */
  library_id?: string | null;
}

export interface AssetRestoreParams {
  /**
   * Body param: Asset IDs (each with the `asset_` prefix) to operate on. Up to 100
   * ids per request.
   */
  ids: Array<string>;

  /**
   * Query param: Library that owns the assets. Optional if the user has a single
   * library; required when they have multiple.
   */
  library_id?: string | null;
}

export interface AssetTrashParams {
  /**
   * Body param: Asset IDs (each with the `asset_` prefix) to operate on. Up to 100
   * ids per request.
   */
  ids: Array<string>;

  /**
   * Query param: Library that owns the assets. Optional if the user has a single
   * library; required when they have multiple.
   */
  library_id?: string | null;
}

export interface AssetUpdateAssetParams {
  /**
   * User-set description for the asset. Pass `null` to remove a previously-set value
   * (the response then falls back to the description embedded in the file, if any).
   * Omit to leave unchanged. Distinct from the AI-generated `description` field on
   * the response — this writes to `metadata.description`.
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
   * When the asset was originally captured. Aware values store the offset from
   * `utcoffset()` alongside; naive values store NULL offset. Pass `null` to remove a
   * previously-set value — the response then falls back to the datetime embedded in
   * the file when present, otherwise to the file's upload timestamp. Omit to leave
   * unchanged.
   */
  original_datetime?: string | null;

  [k: string]: unknown;
}

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
}
