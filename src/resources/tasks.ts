// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Status of background processing tasks.
 */
export class Tasks extends APIResource {
  /**
   * List background tasks for the authenticated user with optional filtering.
   *
   * Results are ordered newest first. Returns 404 when `library_id` names a library
   * that does not exist or is not accessible to the authenticated user.
   */
  list(
    query: TaskListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TaskListResponse> {
    return this._client.get('/api/tasks/', { query, ...options });
  }

  /**
   * Get the status of a background task by its ID.
   *
   * Returns 404 if no task with the given identifier exists among the authenticated
   * user's libraries.
   */
  get(taskID: string, options?: RequestOptions): APIPromise<TaskResponse> {
    return this._client.get(path`/api/tasks/${taskID}`, options);
  }

  /**
   * Get all background tasks for a specific asset. Results are ordered newest first.
   */
  listForAsset(assetID: string, options?: RequestOptions): APIPromise<TaskListForAssetResponse> {
    return this._client.get(path`/api/tasks/asset/${assetID}`, options);
  }
}

/**
 * A background processing task and its current execution state.
 */
export interface TaskResponse {
  /**
   * Unique task identifier with `btask_` prefix
   */
  id: string;

  /**
   * ID of the asset this task processes; null for library-scoped tasks such as face
   * clustering
   */
  asset_id: string | null;

  /**
   * Application-generated delivery identifier supplied to the task queue. Also
   * accepted by `get_task_status` in place of `id`.
   */
  celery_task_id: string;

  /**
   * When the task finished, whether successfully or not (ISO 8601); null until then
   */
  completed_at: string | null;

  /**
   * When the task record was created (ISO 8601); dispatch to the task queue follows
   * separately, after the creating transaction commits
   */
  created_at: string;

  /**
   * Error detail from the most recent failed or retried attempt; not cleared by a
   * later success, so it can be non-null on a task that failed transiently and then
   * succeeded. Null if no attempt has failed
   */
  error_message: string | null;

  /**
   * Result summary produced by a completed task; null until success
   */
  result: string | null;

  /**
   * Retry and rescue bookkeeping value for this task. Zero before any automatic
   * retry or stuck-task rescue; not guaranteed to be a cumulative delivery count
   */
  retry_count: number;

  /**
   * When a worker most recently began executing the task, or when the stuck-task
   * reaper rescued it back to pending (ISO 8601). Because a rescue can re-enqueue a
   * task no worker ever picked up, a non-null value does not prove a worker has run
   * the task
   */
  started_at: string | null;

  /**
   * Status of a background task execution: `pending` (created and awaiting
   * processing), `started` (picked up by a worker and not yet in a terminal state —
   * the task may be executing or awaiting an automatic retry after a transient
   * failure), `success` (completed successfully), or `failure` (failed and will not
   * be retried).
   */
  status: 'pending' | 'started' | 'success' | 'failure';

  /**
   * Kind of background processing a task performs: `image_quality` (historical only
   * — scored an image's technical quality; this task type is retired and no longer
   * dispatched, the value appears only on old task rows), `embedding` (compute the
   * content embedding that powers search), `face_detection` (detect faces in an
   * asset), `face_clustering` (group a library's detected faces into people),
   * `asset_description` (generate a natural-language description of an asset),
   * `asset_storage_cleanup` (remove stored files left behind by a permanently
   * deleted asset), `asset_version_storage_cleanup` (remove stored files of a
   * superseded asset version), `reverse_geocoding` (resolve an asset's GPS
   * coordinates to a place name), `video_thumbnail_extract` (extract a thumbnail
   * image from a video), `video_metadata_extract` (recover a video's capture time,
   * GPS location, and camera details from the file's own metadata), `thumbhash`
   * (compute the blurred placeholder shown while a thumbnail loads),
   * `display_proxy_generation` (generate a browser-displayable rendition of an
   * original the image CDN cannot transform, such as an oversized or
   * over-dimensioned file), or `burst_detection` (detect rapid-fire shots of the
   * same moment and stack them).
   */
  task_type:
    | 'image_quality'
    | 'embedding'
    | 'face_detection'
    | 'face_clustering'
    | 'asset_description'
    | 'asset_storage_cleanup'
    | 'asset_version_storage_cleanup'
    | 'reverse_geocoding'
    | 'video_thumbnail_extract'
    | 'video_metadata_extract'
    | 'thumbhash'
    | 'display_proxy_generation'
    | 'burst_detection';
}

export type TaskListResponse = Array<TaskResponse>;

export type TaskListForAssetResponse = Array<TaskResponse>;

export interface TaskListParams {
  /**
   * Restrict results to tasks owned by this library. When omitted, returns tasks
   * across every library the authenticated user owns.
   */
  library_id?: string | null;

  /**
   * Maximum number of tasks to return.
   */
  limit?: number;

  /**
   * Return only tasks currently in this execution status.
   */
  status?: 'pending' | 'started' | 'success' | 'failure' | null;

  /**
   * Return only tasks of this type.
   */
  task_type?:
    | 'image_quality'
    | 'embedding'
    | 'face_detection'
    | 'face_clustering'
    | 'asset_description'
    | 'asset_storage_cleanup'
    | 'asset_version_storage_cleanup'
    | 'reverse_geocoding'
    | 'video_thumbnail_extract'
    | 'video_metadata_extract'
    | 'thumbhash'
    | 'display_proxy_generation'
    | 'burst_detection'
    | null;
}

export declare namespace Tasks {
  export {
    type TaskResponse as TaskResponse,
    type TaskListResponse as TaskListResponse,
    type TaskListForAssetResponse as TaskListForAssetResponse,
    type TaskListParams as TaskListParams,
  };
}
