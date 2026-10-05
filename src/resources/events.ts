// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Change events (create/update/delete) for entities in a library, for synchronising a local copy or auditing recent activity. Events reference entities by type and ID; fetch full data with the corresponding resource.
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
   * **Sync pattern:**
   *
   * 1. Load the stored cursor, or start with none for a first sync.
   * 2. Request a page with `after_cursor` set to that cursor.
   * 3. Treat each event as "this changed": re-read the current state of the entity
   *    it names and upsert it, or drop it when the read returns not-found. For
   *    `album_asset_*` events, re-read that album's membership rather than applying
   *    the add or remove directly.
   * 4. After applying the page, store its `next_cursor`.
   * 5. Repeat until `has_more` is false. The client is then caught up; the next sync
   *    resumes at step 1.
   *
   * Reading forward from a stored cursor returns every committed event after it,
   * each once, so a cursor is the only checkpoint a client needs; never store a
   * timestamp. Processing must be idempotent: a crash before step 4 replays the
   * page. An event appears once every transaction older than its own has finished,
   * so it can trail its commit. Events are not in commit order: two changes to one
   * entity can arrive out of order, which is why step 3 re-reads state.
   *
   * Returns 400 for an unknown entity type, a malformed cursor or `as_of`, and for a
   * cursor or `as_of` ahead of the database, as after a restore that went back in
   * time. None clears on retry; after a cursor error, resync from no cursor.
   *
   * **Handling deletions:** when `event_type` ends with `_deleted` or `_removed`,
   * the entity no longer exists — remove it from the local cache. Some deletion
   * events include a `payload` field with context (e.g., `album_asset_removed`
   * carries `album_id` and `asset_id` since the junction row is gone). Permanently
   * deleting an asset also records an `album_asset_removed` for each of its
   * memberships. Deleting an album does not: `album_deleted` means the album's
   * memberships are gone too, so remove them along with the album.
   *
   * **Trash and restore:** `asset_trashed` moves an asset to the trash and
   * `asset_restored` brings it back. Trashing hides the asset's faces and album
   * memberships from default reads and lowers its people's and stack's counts;
   * restoring reverses that. Those related changes get no events of their own. On
   * either event, re-read the asset's faces and album memberships by `asset_id` (a
   * trashed asset returns none), and refetch by ID the people and stack that your
   * copy of its faces and of the asset names.
   *
   * **Event types:**
   *
   * - `asset_created`, `asset_updated`, `asset_trashed`, `asset_restored`,
   *   `asset_deleted`
   * - `album_created`, `album_updated`, `album_deleted`
   * - `library_trashed`, `library_restored`
   * - `person_created`, `person_updated`, `person_deleted`
   * - `face_created`, `face_updated`, `face_deleted`
   * - `album_asset_added`, `album_asset_removed`
   * - `metadata_updated`
   * - `stack_created`, `stack_updated`, `stack_deleted`
   *
   * **People and faces:** `person_updated` fires only when a person's own fields
   * change — name, birth date, hidden, favorite, or thumbnail face. A person's face
   * count, asset count, and cluster metrics follow its faces, so their changes
   * arrive as `face_*` events only; refetch the person when a face event names it. A
   * `face_updated` payload names the face's new `person_id` and its
   * `previous_person_id`; a `face_deleted` payload carries `previous_person_id`.
   * Refetch both persons when they're non-null. A `previous_person_id` may name a
   * person that was deleted in the same change (a merge or a person deletion), so
   * handle a 404 on the refetch.
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
   * Opaque bound this read stopped at. Pass as `as_of` to the other reads in the
   * same sync, such as other entity types, so they all stop at the same point.
   */
  as_of: string;

  /**
   * Events in feed order, which is not commit order.
   */
  data: Array<EventsResponse.Data>;

  /**
   * True if more events are ready now: pass `next_cursor` as `after_cursor`,
   * repeating `library_id`, `entity_types`, and `created_at_gte`, to fetch the next
   * page. False means the client is caught up, not that the feed is closed.
   */
  has_more: boolean;

  /**
   * Store after applying this page and pass as `after_cursor` to continue. While
   * `has_more` is true it also bounds the read to events ready when it began. Null
   * only when the request had no cursor and returned no events.
   */
  next_cursor?: string | null;
}

export namespace EventsResponse {
  /**
   * Lightweight event record for sync endpoint.
   */
  export interface Data {
    /**
     * When the writer's transaction started. For display only: it is not the feed
     * order and not a sync checkpoint.
     */
    created_at: string;

    /**
     * Opaque position of this event. Resuming with it as `after_cursor` returns the
     * events after it; prefer the page's `next_cursor`.
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
   * Opaque cursor to resume after: the previous page's `next_cursor`. Omit for a
   * first sync.
   */
  after_cursor?: string | null;

  /**
   * Opaque bound from an earlier response's `as_of` in the same sync. Returns only
   * events that were ready at that point, so several reads share one bound, such as
   * one feed per entity type. A row can still precede the row it refers to when its
   * transaction began writing first. Use it for one sync only; never store it.
   */
  as_of?: string | null;

  /**
   * Only return events created at or after this timestamp (ISO 8601). A display
   * filter, not a sync checkpoint: `created_at` is when the writer's transaction
   * started, so a later-committing event can carry an earlier timestamp.
   */
  created_at_gte?: string | null;

  /**
   * @deprecated Ignored. Reads are bounded by `next_cursor`; a timestamp bound could
   * skip events.
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
   * Library to stream events from. Optional if the user has a single live
   * (non-trashed) library; required when they have multiple.
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
