// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as AssetsAPI from './assets';
import * as FacesAPI from './faces';
import * as PeopleAPI from './people';
import * as AlbumsAPI from './albums/albums';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Events extends APIResource {
  /**
   * Retrieves a list of entity change events for syncing.
   *
   * Events are returned in order of entity type priority (assets first, then exif,
   * albums, etc.), then by `updated_at` timestamp (oldest first), then by entity ID
   * for tie-breaking.
   *
   * **Pagination:** Use `updated_at_gte` with the timestamp of the last received
   * event to fetch the next page. Use `updated_at_lt` to bound the sync window and
   * prevent infinite loops when new events are created during sync.
   *
   * **Recommended sync pattern:**
   *
   * 1. Capture current time as `sync_started_at`
   * 2. Fetch events with `updated_at_lt=sync_started_at`
   * 3. For subsequent pages, use
   *    `updated_at_gte={last_event.updated_at}&updated_at_lt=sync_started_at`
   * 4. Continue until an empty result set is returned
   * 5. Store `sync_started_at` as checkpoint for next sync
   *
   * **Note:** Events with the same `updated_at` may be returned on multiple pages.
   * Use entity IDs as keys when updating local state (upsert semantics).
   */
  get(query: EventGetParams | null | undefined = {}, options?: RequestOptions): APIPromise<EventsResponse> {
    return this._client.get('/api/events', { query, ...options });
  }
}

/**
 * Response containing events.
 */
export interface EventsResponse {
  /**
   * List of events, ordered by entity type priority, then updated_at, then entity_id
   */
  data: Array<
    | EventsResponse.AssetEventPayload
    | EventsResponse.AlbumEventPayload
    | EventsResponse.PersonEventPayload
    | EventsResponse.FaceEventPayload
    | EventsResponse.AlbumAssetEventPayload
    | EventsResponse.ExifEventPayload
  >;
}

export namespace EventsResponse {
  /**
   * Event payload for asset entities.
   */
  export interface AssetEventPayload {
    /**
     * Full asset data
     */
    data: AssetsAPI.AssetResponse;

    entity_type?: 'asset';
  }

  /**
   * Event payload for album entities.
   */
  export interface AlbumEventPayload {
    /**
     * Full album data
     */
    data: AlbumsAPI.AlbumResponse;

    entity_type?: 'album';
  }

  /**
   * Event payload for person entities.
   */
  export interface PersonEventPayload {
    /**
     * Full person data
     */
    data: PeopleAPI.PersonResponse;

    entity_type?: 'person';
  }

  /**
   * Event payload for face entities.
   */
  export interface FaceEventPayload {
    /**
     * Full face data
     */
    data: FacesAPI.FaceResponse;

    entity_type?: 'face';
  }

  /**
   * Event payload for album_asset entities.
   */
  export interface AlbumAssetEventPayload {
    /**
     * Full album_asset data
     */
    data: AlbumAssetEventPayload.Data;

    entity_type?: 'album_asset';
  }

  export namespace AlbumAssetEventPayload {
    /**
     * Full album_asset data
     */
    export interface Data {
      /**
       * Unique album*asset identifier with 'album_asset*' prefix
       */
      id: string;

      /**
       * ID of the album
       */
      album_id: string;

      /**
       * ID of the asset
       */
      asset_id: string;

      /**
       * When this link was created
       */
      created_at: string;

      /**
       * When this link was last updated
       */
      updated_at: string;
    }
  }

  /**
   * Event payload for exif entities.
   */
  export interface ExifEventPayload {
    /**
     * Full exif data
     */
    data: ExifEventPayload.Data;

    entity_type?: 'exif';
  }

  export namespace ExifEventPayload {
    /**
     * Full exif data
     */
    export interface Data {
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
}

export interface EventGetParams {
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

  /**
   * Only return events with updated_at >= this timestamp (ISO 8601 format)
   */
  updated_at_gte?: string | null;

  /**
   * Only return events with updated_at < this timestamp (ISO 8601 format).
   * Recommended for bounding sync operations.
   */
  updated_at_lt?: string | null;
}

export declare namespace Events {
  export { type EventsResponse as EventsResponse, type EventGetParams as EventGetParams };
}
