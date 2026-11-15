// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../core/pagination';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * People found in photos without a face record.
 */
export class Bodies extends APIResource {
  /**
   * Fetches one body by ID: its box, its person and whether that link was automatic
   * or manual. Use when you already have a `body_id`.
   */
  retrieve(
    bodyID: string,
    query: BodyRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BodyResponse> {
    return this._client.get(path`/api/bodies/${bodyID}`, { query, ...options });
  }

  /**
   * Links a body to a person, or removes its person (set `person_id` to null); a
   * body with no person is still returned. Sending the current person ID marks the
   * link as manual.
   *
   * To create a new identity first, call `create_person`. Use `delete_body` when the
   * body is not a person at all.
   */
  update(bodyID: string, params: BodyUpdateParams, options?: RequestOptions): APIPromise<BodyResponse> {
    const { library_id, ...body } = params;
    return this._client.patch(path`/api/bodies/${bodyID}`, { query: { library_id }, body, ...options });
  }

  /**
   * Returns a paginated list of bodies, newest first, optionally filtered by asset,
   * person, or ID. A body is a person in a photo without a face record, for example
   * someone facing away from the camera. Its `person_id` is `null` until it is
   * linked; link it with `update_body`. Pass `include=candidates` for people it may
   * be.
   *
   * **Use `list_faces` instead** for face detections, and `list_people` for the
   * people themselves.
   *
   * To choose photos of a person, use `list_assets` or `search_assets` with
   * `person_ids`. A body match may not show their face, so when choosing photos of
   * someone, prefer `person_link=face`.
   *
   * **Pagination** is cursor-based: when `has_more` is true, pass the `id` of the
   * last body in `data` as `starting_after_id` to fetch the next page.
   */
  list(
    query: BodyListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<BodyResponsesCursorPage, BodyResponse> {
    return this._client.getAPIList('/api/bodies', CursorPage<BodyResponse>, { query, ...options });
  }

  /**
   * Deletes a body that is not a person; the asset and any person it was linked to
   * are both preserved. **Use `update_body` with `person_id=null` instead** when it
   * is a person but not this one. Use `trash_assets` to remove the photo.
   */
  delete(
    bodyID: string,
    params: BodyDeleteParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BodyDeleteResponse> {
    const { library_id } = params ?? {};
    return this._client.delete(path`/api/bodies/${bodyID}`, { query: { library_id }, ...options });
  }
}

export type BodyResponsesCursorPage = CursorPage<BodyResponse>;

/**
 * A person found in an asset without a face record.
 */
export interface BodyResponse {
  /**
   * Unique body identifier with 'body\_' prefix
   */
  id: string;

  /**
   * ID of the asset containing this body
   */
  asset_id: string;

  /**
   * How a body's person was set: by automatic naming or by a person.
   */
  assignment_source: 'automatic' | 'manual' | null;

  /**
   * Where the person is, as {x, y, w, h} in pixels: (x, y) is the box's top-left
   * corner and w, h its size, on the image as displayed (EXIF orientation applied),
   * so they match the asset's `width` and `height`
   */
  bounding_box: { [key: string]: number };

  /**
   * When this body was detected
   */
  created_at: string;

  /**
   * ID of the person this body is linked to, or `null` when it has none yet.
   */
  person_id: string | null;

  /**
   * When this body record was last updated
   */
  updated_at: string;

  /**
   * Named people who may be the person in this body, best match first, at most 5;
   * never its current person. Link one with `update_body`. Populated only when
   * `list_bodies` or `get_body` is called with `include=candidates`; `null`
   * otherwise. `[]` when there are none, including while the library owner's
   * settings do not allow automatic face detection.
   */
  candidates?: Array<BodyResponse.Candidate> | null;
}

export namespace BodyResponse {
  /**
   * A named person who may be the one in a body.
   */
  export interface Candidate {
    /**
     * The person's name.
     */
    name: string;

    /**
     * Person ID (with 'person\_' prefix).
     */
    person_id: string;
  }
}

/**
 * Empty acknowledgment returned when an operation succeeds.
 */
export interface BodyDeleteResponse {}

export interface BodyRetrieveParams {
  /**
   * Opt-in expansion fields. Supported value: `candidates` (adds each body's
   * `candidates`, the named people who may be the person in it). Accepts multiple
   * `include=` query params or a single comma-delimited value. Unknown values
   * return 422.
   */
  include?: Array<string> | null;

  /**
   * Library the body belongs to. Optional if the user has a single live
   * (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;
}

export interface BodyUpdateParams {
  /**
   * Body param: Person ID (with `person_` prefix) to link this body to, or `null` to
   * remove its person; the body stays, with no person.
   */
  person_id: string | null;

  /**
   * Query param: Library the body belongs to. Optional if the user has a single live
   * (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;
}

export interface BodyListParams extends CursorPageParams {
  /**
   * Return only bodies in this asset.
   */
  asset_id?: string | null;

  /**
   * Look up specific bodies by ID (max 200). IDs use the `body_` prefix. Accepts
   * multiple `ids=` query params or a single comma-delimited value (e.g.,
   * `ids=body_1,body_2`).
   */
  ids?: Array<string> | null;

  /**
   * Opt-in expansion fields. Supported value: `candidates` (adds each body's
   * `candidates`, the named people who may be the person in it). Accepts multiple
   * `include=` query params or a single comma-delimited value. Unknown values
   * return 422.
   */
  include?: Array<string> | null;

  /**
   * Library to list from. Optional if the user has a single live (non-trashed)
   * library; required when they have multiple.
   */
  library_id?: string | null;

  /**
   * Return only bodies linked to this person.
   */
  person_id?: string | null;
}

export interface BodyDeleteParams {
  /**
   * Library the body belongs to. Optional if the user has a single live
   * (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;
}

export declare namespace Bodies {
  export {
    type BodyResponse as BodyResponse,
    type BodyDeleteResponse as BodyDeleteResponse,
    type BodyResponsesCursorPage as BodyResponsesCursorPage,
    type BodyRetrieveParams as BodyRetrieveParams,
    type BodyUpdateParams as BodyUpdateParams,
    type BodyListParams as BodyListParams,
    type BodyDeleteParams as BodyDeleteParams,
  };
}
