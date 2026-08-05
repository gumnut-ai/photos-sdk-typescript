// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Change-event feed for keeping client state in sync.
 */
export class Events extends APIResource {
  /**
   * Returns a paginated stream of change events (create/update/delete) for entities
   * in the library. Each event is a lightweight record — `entity_type`, `entity_id`,
   * `event_type`, and timestamps — pointing at a concrete entity that has changed.
   * Follow up with `get_asset`, `get_album`, `get_person`, or `get_face` to fetch
   * full entity data when needed.
   *
   * **Use this tool** when the user wants to synchronise a local copy of their
   * library, audit recent activity, or detect deletions. **Don't use it** for
   * content queries — use `search_assets` or `list_assets` instead. Events cannot be
   * filtered by content or asset metadata.
   *
   * **Pagination:** cursor-based via `after_cursor`. When `has_more` is true, pass
   * the last event's `cursor` value into `after_cursor` to fetch the next page.
   *
   * **Recommended sync pattern:**
   *
   * 1. Capture current time as `sync_end`.
   * 2. Fetch events with `created_at_lt=sync_end`.
   * 3. For subsequent pages, use
   *    `after_cursor={last.cursor}&created_at_lt=sync_end`.
   * 4. Continue until `has_more=false`.
   * 5. For each event, fetch the entity data from the appropriate endpoint if
   *    needed.
   * 6. Store `sync_end` as checkpoint for next sync.
   *
   * **Handling deletions:** when `event_type` ends with `_deleted` or `_removed`,
   * the entity no longer exists — remove it from the local cache. Some deletion
   * events include a `payload` field with context (e.g., `album_asset_removed`
   * carries `album_id` and `asset_id` since the junction row is gone).
   *
   * **Event types:**
   *
   * - `asset_created`, `asset_updated`, `asset_deleted`
   * - `album_created`, `album_updated`, `album_deleted`
   * - `person_created`, `person_updated`, `person_deleted`
   * - `face_created`, `face_updated`, `face_deleted`
   * - `album_asset_added`, `album_asset_removed`
   * - `metadata_updated`
   * - `stack_created`, `stack_updated`, `stack_deleted`
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
   * True if there are more events after this page. Pass the last event's `cursor`
   * value as `after_cursor` to fetch the next page.
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

export interface EventGetParams {
  /**
   * Opaque cursor from the last event of the previous page. Pass the `cursor` field
   * from the last event to fetch the next page. Omit for the first page.
   */
  after_cursor?: string | null;

  /**
   * Only return events created at or after this timestamp (ISO 8601). Set this to
   * the previous sync's checkpoint when doing incremental sync.
   */
  created_at_gte?: string | null;

  /**
   * Only return events created strictly before this timestamp (ISO 8601).
   * Recommended for bounding a sync operation — capture `now` once and reuse it as
   * `created_at_lt` across all pages so newly arriving events don't shift the
   * window.
   */
  created_at_lt?: string | null;

  /**
   * Entity types to include (e.g., `asset`, `album`). Valid values: `asset`,
   * `album`, `person`, `face`, `album_asset`, `metadata`, `stack`. Accepts multiple
   * `entity_types=` query params or a single comma-delimited value (e.g.,
   * `entity_types=asset,album`). Omit to receive events for all types.
   */
  entity_types?: Array<string> | null;

  /**
   * Library to stream events from. Optional if the user has a single library;
   * required when they have multiple.
   */
  library_id?: string | null;

  /**
   * Maximum number of events to return per page (1–200). Defaults to 20.
   */
  limit?: number;
}

export declare namespace Events {
  export { type EventsResponse as EventsResponse, type EventGetParams as EventGetParams };
}
