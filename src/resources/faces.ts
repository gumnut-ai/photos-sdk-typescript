// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../core/pagination';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Detected faces and their assignment to people.
 */
export class Faces extends APIResource {
  /**
   * Adds a user-drawn face box to an asset, for a face the detector missed. To
   * remove a face detection instead, use `delete_face`; to introduce a brand-new
   * identity first, use `create_person`.
   */
  create(body: FaceCreateParams, options?: RequestOptions): APIPromise<FaceResponse> {
    return this._client.post('/api/faces', { body, ...options });
  }

  /**
   * Fetches one face's details by ID (bounding box, assigned person, timestamps,
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
   * Assigns a face to a specific person, or detaches it from its current person (set
   * `person_id` to null). This is the right tool for 'this face is Alice' or 'this
   * face isn't Bob after all'.
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
   * ordered by creation time (newest first), optionally filtered by asset, person,
   * or ID. Each row is a single face in a single asset — a person with many photos
   * will have many face rows.
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
   * Removes one face detection row; the underlying asset and the person this face
   * was assigned to are both preserved.
   *
   * **Use `update_face` with `person_id=null` instead** when the user wants to
   * disassociate the face from a person without discarding the detection (so
   * re-clustering can try again). Use `delete_person` to remove a person; use
   * `trash_assets` to remove the photo entirely.
   */
  delete(
    faceID: string,
    params: FaceDeleteParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<FaceDeleteResponse> {
    const { library_id } = params ?? {};
    return this._client.delete(path`/api/faces/${faceID}`, { query: { library_id }, ...options });
  }
}

export type FaceResponsesCursorPage = CursorPage<FaceResponse>;

/**
 * Per-face cluster-assignment diagnostics: how well the face fits its
 * currently-assigned Person, and which other Persons are nearby in embedding
 * space. Surfaced via `include=cluster_assignment` on the faces endpoints — used
 * by the operator-facing face cleanup dashboard to triage mis-clustered faces.
 */
export interface ClusterAssignmentResponse {
  /**
   * Persons in the same library that pass the same gate shape as production face
   * assignment, surfaced with deliberately relaxed thresholds so the list is a
   * superset of what the automated path would admit. Sorted ascending by distance.
   * Excludes the face's currently-assigned Person (its distance is in
   * `distance_to_person`). Empty when no eligible Persons pass the gate.
   */
  candidates?: Array<ClusterAssignmentResponse.Candidate>;

  /**
   * Cosine distance from the face's embedding to its currently-assigned Person's
   * centroid. Lower = better fit. Null when the face is unassigned or when the
   * assigned Person has no centroid.
   */
  distance_to_person?: number | null;
}

export namespace ClusterAssignmentResponse {
  /**
   * A Person whose centroid is close enough to a given face's embedding that it
   * would be considered for assignment — surfaced under
   * `ClusterAssignmentResponse.candidates`.
   */
  export interface Candidate {
    /**
     * Cosine distance from the face's embedding to this Person's centroid (lower =
     * closer).
     */
    distance: number;

    /**
     * Person ID (with 'person\_' prefix) of the candidate.
     */
    person_id: string;

    /**
     * Display name of the candidate Person, or null for unnamed clusters. Candidates
     * surface the same Persons production assignment considers, which includes unnamed
     * clusters.
     */
    name?: string | null;
  }
}

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
   * How this face was added: 'automatic' for detector-found faces, 'manual' for
   * user-drawn face boxes.
   */
  source: 'automatic' | 'manual';

  /**
   * When this face record was last updated
   */
  updated_at: string;

  /**
   * Asset variants for this face: 'thumbnail' with face crop
   */
  asset_urls?: { [key: string]: Shared.AssetVariant } | null;

  /**
   * Per-face cluster-assignment diagnostics: how well the face fits its
   * currently-assigned Person, and which other Persons are nearby in embedding
   * space. Surfaced via `include=cluster_assignment` on the faces endpoints — used
   * by the operator-facing face cleanup dashboard to triage mis-clustered faces.
   */
  cluster_assignment?: ClusterAssignmentResponse | null;

  /**
   * Detector confidence on a 0-1 scale; higher is more confident among faces
   * detected under the same configuration (values are not comparable across detector
   * generations). Null on legacy faces without a stored score and on manually added
   * faces.
   */
  confidence?: number | null;

  /**
   * ID of the person this face belongs to (if identified)
   */
  person_id?: string | null;

  /**
   * For video files, timestamp in milliseconds when face appears
   */
  timestamp_ms?: number | null;
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
export interface FaceDeleteResponse {}

export interface FaceCreateParams {
  /**
   * ID of the asset (with `asset_` prefix) to draw the face box on. The asset must
   * belong to the target library.
   */
  asset_id: string;

  /**
   * Where the face is, as a box in display-space pixels matching the asset's
   * reported `width`/`height`. The box must fit inside those dimensions.
   */
  bounding_box: FaceCreateParams.BoundingBox;

  /**
   * Library to create the face in. Optional if the user has a single live
   * (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;

  /**
   * Optional person ID (with `person_` prefix) to assign this face to at creation.
   * Omit to leave it unassigned; assign it later via `update_face`. Use
   * `create_person` first if the identity doesn't exist yet.
   */
  person_id?: string | null;
}

export namespace FaceCreateParams {
  /**
   * Where the face is, as a box in display-space pixels matching the asset's
   * reported `width`/`height`. The box must fit inside those dimensions.
   */
  export interface BoundingBox {
    /**
     * Box height in pixels. `y + h` must not exceed the asset's height.
     */
    h: number;

    /**
     * Box width in pixels. `x + w` must not exceed the asset's width.
     */
    w: number;

    /**
     * Left edge, in pixels from the asset's left side (0-based).
     */
    x: number;

    /**
     * Top edge, in pixels from the asset's top side (0-based).
     */
    y: number;
  }
}

export interface FaceRetrieveParams {
  /**
   * Opt-in expansion fields. See `list_faces` for supported values. Accepts multiple
   * `include=` query params or a single comma-delimited value.
   */
  include?: Array<string> | null;

  /**
   * Library the face belongs to. Optional if the user has a single live
   * (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;
}

export interface FaceUpdateParams {
  /**
   * Query param: Library the face belongs to. Optional if the user has a single live
   * (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;

  /**
   * Body param: Target person ID (with `person_` prefix) to assign this face to.
   * Pass `null` to detach the face from its current person without deleting either.
   * Use `create_person` first if the target identity doesn't exist yet.
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
   * Look up specific faces by ID (max 200). IDs use the `face_` prefix. Accepts
   * multiple `ids=` query params or a single comma-delimited value (e.g.,
   * `ids=face_1,face_2`).
   */
  ids?: Array<string> | null;

  /**
   * Opt-in expansion fields. Supported values: `cluster_assignment` (adds the nested
   * `cluster_assignment` object — `distance_to_person` and a top-K `candidates` list
   * of nearby Persons). Accepts multiple `include=` query params or a single
   * comma-delimited value (e.g., `include=cluster_assignment`).
   */
  include?: Array<string> | null;

  /**
   * Library to list from. Optional if the user has a single live (non-trashed)
   * library; required when they have multiple.
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
   * Library the face belongs to. Optional if the user has a single live
   * (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;
}

export declare namespace Faces {
  export {
    type ClusterAssignmentResponse as ClusterAssignmentResponse,
    type FaceResponse as FaceResponse,
    type FaceDeleteResponse as FaceDeleteResponse,
    type FaceResponsesCursorPage as FaceResponsesCursorPage,
    type FaceCreateParams as FaceCreateParams,
    type FaceRetrieveParams as FaceRetrieveParams,
    type FaceUpdateParams as FaceUpdateParams,
    type FaceListParams as FaceListParams,
    type FaceDeleteParams as FaceDeleteParams,
  };
}
