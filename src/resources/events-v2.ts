// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class EventsV2 extends APIResource {
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
   * **Handling deletions:** When `event_type` ends with "\_deleted", the entity no
   * longer exists. Remove it from your local cache/database.
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
  get(
    query: EventsV2GetParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<EventsV2Response> {
    return this._client.get('/api/v2/events', { query, ...options });
  }
}

/**
 * Response containing a page of v2 events.
 */
export interface EventsV2Response {
  /**
   * List of events, ordered by event ID (monotonically increasing)
   */
  data: Array<EventsV2Response.Data>;

  /**
   * True if there are more events after this page. Use the last event's cursor to
   * fetch the next page.
   */
  has_more: boolean;
}

export namespace EventsV2Response {
  /**
   * Lightweight event record for v2 sync endpoint.
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
  }
}

export interface EventsV2GetParams {
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

export declare namespace EventsV2 {
  export { type EventsV2Response as EventsV2Response, type EventsV2GetParams as EventsV2GetParams };
}
