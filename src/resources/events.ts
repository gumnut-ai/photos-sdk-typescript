// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Events extends APIResource {
  /**
   * Retrieves a list of entity change events for syncing.
   *
   * Events are lightweight records indicating that entities have changed. Each event
   * contains the entity type, entity ID, and event type (e.g., "asset_created",
   * "album_deleted"). Clients should fetch full entity data from the appropriate
   * endpoints if needed.
   *
   * **Pagination:** Use the `after_cursor` parameter with the `cursor` value from
   * the last event to fetch the next page. The `has_more` field indicates if more
   * events exist.
   *
   * **Recommended sync pattern:**
   *
   * 1. Capture current time as `sync_end`
   * 2. Fetch events with `created_at_lt=sync_end`
   * 3. For subsequent pages, use `after_cursor={last.cursor}&created_at_lt=sync_end`
   * 4. Continue until `has_more=false`
   * 5. For each event, fetch the entity data from the appropriate endpoint if needed
   * 6. Store `sync_end` as checkpoint for next sync
   *
   * **Handling deletions:** When `event_type` ends with "\_deleted" or "\_removed",
   * the entity no longer exists. Remove it from your local cache/database. Some
   * deletion events include a `payload` field with additional context (e.g.,
   * `album_asset_removed` includes `album_id` and `asset_id` since the junction
   * record is deleted).
   *
   * **Event types:**
   *
   * - `asset_created`, `asset_updated`, `asset_deleted`
   * - `album_created`, `album_updated`, `album_deleted`
   * - `person_created`, `person_updated`, `person_deleted`
   * - `face_created`, `face_updated`, `face_deleted`
   * - `album_asset_added`, `album_asset_removed`
   * - `exif_created`, `exif_updated`
   */
  get(query: EventGetParams | null | undefined = {}, options?: RequestOptions): APIPromise<EventsResponse> {
    return this._client.get('/api/events', { query, ...options });
  }
}

/**
 * Response containing a page of events.
 */
export interface EventsResponse {
  /**
   * List of events, ordered by event ID (monotonically increasing)
   */
  data: Array<EventsResponse.Data>;

  /**
   * True if there are more events after this page. Use the last event's cursor to
   * fetch the next page.
   */
  has_more: boolean;
}

export namespace EventsResponse {
  /**
   * Lightweight event record for sync endpoint.
   */
  export interface Data {
    /**
     * When the event was recorded
     */
    created_at: string;

    /**
     * Opaque cursor for pagination. Pass as after_cursor to get the next page.
     */
    cursor: string;

    /**
     * ID of the entity that changed
     */
    entity_id: string;

    /**
     * Type of entity that changed (e.g., 'asset', 'album', 'person')
     */
    entity_type: string;

    /**
     * Semantic event type (e.g., 'asset_created', 'album_deleted')
     */
    event_type: string;

    /**
     * Optional extra context for the event (e.g., foreign keys for junction table
     * deletions)
     */
    payload?: { [key: string]: unknown } | null;
  }
}

/**
 * EXIF metadata extracted from image and video files.
 */
export interface ExifResponse {
  /**
   * ID of the asset this EXIF data belongs to
   */
  asset_id: string;

  /**
   * When this EXIF record was created
   */
  created_at: string;

  /**
   * When this EXIF record was last updated
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
   * When the photo was digitized, with timezone offset if available in EXIF metadata
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
   * When the file was last modified, with timezone offset if available in EXIF
   * metadata
   */
  modified_datetime?: string | null;

  /**
   * Image orientation value (1-8) indicating rotation/flip: 1=normal, 2=mirror
   * horizontal, 3=rotate 180°, 4=mirror vertical, 5=mirror horizontal+rotate 90° CW,
   * 6=rotate 90° CW, 7=mirror horizontal+rotate 90° CCW, 8=rotate 90° CCW
   */
  orientation?: number | null;

  /**
   * When the photo was originally taken, with timezone offset if available in EXIF
   * metadata
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

export interface EventGetParams {
  /**
   * Cursor from the last event to paginate from. Pass the `cursor` field from the
   * last event to get the next page.
   */
  after_cursor?: string | null;

  /**
   * Only return events created at or after this timestamp (ISO 8601 format)
   */
  created_at_gte?: string | null;

  /**
   * Only return events created before this timestamp (ISO 8601 format). Recommended
   * for bounding sync operations.
   */
  created_at_lt?: string | null;

  /**
   * Comma-separated list of entity types to include (e.g., 'asset,album'). Valid
   * types: asset, album, person, face, album_asset, exif. Default: all types.
   */
  entity_types?: string | null;

  /**
   * Library to list events from. If not provided, uses the user's default library.
   */
  library_id?: string | null;

  /**
   * Maximum number of events to return (1-500)
   */
  limit?: number;
}

export declare namespace Events {
  export {
    type EventsResponse as EventsResponse,
    type ExifResponse as ExifResponse,
    type EventGetParams as EventGetParams,
  };
}
