// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../core/pagination';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Faces extends APIResource {
  /**
   * Fetches one face's details (bounding box, assigned person, timestamps,
   * thumbnail). Use when you already have a `face_id`.
   */
  retrieve(
    faceID: string,
    query: FaceRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<FaceResponse> {
    return this._client.get(path`/api/faces/${faceID}`, { query, ...options });
  }

  /**
   * Assigns a face to a specific person, or detaches it (set `person_id` to null).
   * This is the right tool for 'this face is Alice' or 'this face isn't Bob after
   * all'.
   *
   * Currently only the `person_id` field is mutable. To create a brand-new identity
   * first, call `create_person`; to delete the face detection entirely, use
   * `delete_face`.
   */
  update(faceID: string, params: FaceUpdateParams, options?: RequestOptions): APIPromise<FaceResponse> {
    const { library_id, ...body } = params;
    return this._client.patch(path`/api/faces/${faceID}`, { query: { library_id }, body, ...options });
  }

  /**
   * Returns a paginated list of individual face detections (with bounding boxes),
   * ordered by creation time (newest first). Each row is a single face in a single
   * asset — a person with many photos will have many face rows.
   *
   * **Use `list_people` instead** when the user wants the grouped identities ('list
   * everyone in my library') rather than individual face detections. This tool is
   * useful for curating clustering results, finding unassigned faces, or picking a
   * thumbnail face for a person via `update_person.thumbnail_face_id`.
   *
   * **Pagination** is cursor-based: when `has_more` is true, pass the `id` of the
   * last face in `data` as `starting_after_id` to fetch the next page.
   */
  list(
    query: FaceListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<FaceResponsesCursorPage, FaceResponse> {
    return this._client.getAPIList('/api/faces', CursorPage<FaceResponse>, { query, ...options });
  }

  /**
   * Removes one face detection row. The underlying asset and the person this face
   * was assigned to are both preserved.
   *
   * **Use `update_face` with `person_id=null` instead** when the user wants to
   * disassociate the face from a person without discarding the detection (so
   * re-clustering can try again). Use `delete_person` to remove a person; use
   * `delete_asset` to remove the photo entirely.
   */
  delete(
    faceID: string,
    params: FaceDeleteParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    const { library_id } = params ?? {};
    return this._client.delete(path`/api/faces/${faceID}`, {
      query: { library_id },
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export type FaceResponsesCursorPage = CursorPage<FaceResponse>;

/**
 * Represents a detected face in an asset with facial recognition data.
 */
export interface FaceResponse {
  /**
   * Unique face identifier with 'face\_' prefix
   */
  id: string;

  /**
   * ID of the asset containing this face
   */
  asset_id: string;

  /**
   * Face location as {x, y, w, h} coordinates in pixels
   */
  bounding_box: { [key: string]: number };

  /**
   * When this face was detected and recorded
   */
  created_at: string;

  /**
   * When this face record was last updated
   */
  updated_at: string;

  /**
   * Asset variants for this face: 'thumbnail' with face crop
   */
  asset_urls?: { [key: string]: Shared.AssetVariant } | null;

  /**
   * ID of the person this face belongs to (if identified)
   */
  person_id?: string | null;

  /**
   * For video files, timestamp in milliseconds when face appears
   */
  timestamp_ms?: number | null;
}

export interface FaceRetrieveParams {
  /**
   * Library the face belongs to. Optional if the user has a single library; required
   * when they have multiple.
   */
  library_id?: string | null;
}

export interface FaceUpdateParams {
  /**
   * Query param: Library the face belongs to. Optional if the user has a single
   * library; required when they have multiple.
   */
  library_id?: string | null;

  /**
   * Body param: Target person ID (with `person_` prefix) to assign this face to.
   * Pass `null` to detach the face from its current person without deleting either.
   * Get IDs from `list_people`; use `create_person` first if the target identity
   * doesn't exist yet.
   */
  person_id?: string | null;
}

export interface FaceListParams extends CursorPageParams {
  /**
   * Return only faces detected in this asset. Useful for 'show me all the faces in
   * this photo'.
   */
  asset_id?: string | null;

  /**
   * Look up specific faces by ID (max 100). IDs use the `face_` prefix.
   */
  ids?: Array<string> | null;

  /**
   * Library to list from. Optional if the user has a single library; required when
   * they have multiple.
   */
  library_id?: string | null;

  /**
   * Return only faces currently assigned to this person. Useful for reviewing or
   * curating a person's face cluster.
   */
  person_id?: string | null;
}

export interface FaceDeleteParams {
  /**
   * Library the face belongs to. Optional if the user has a single library; required
   * when they have multiple.
   */
  library_id?: string | null;
}

export declare namespace Faces {
  export {
    type FaceResponse as FaceResponse,
    type FaceResponsesCursorPage as FaceResponsesCursorPage,
    type FaceRetrieveParams as FaceRetrieveParams,
    type FaceUpdateParams as FaceUpdateParams,
    type FaceListParams as FaceListParams,
    type FaceDeleteParams as FaceDeleteParams,
  };
}
