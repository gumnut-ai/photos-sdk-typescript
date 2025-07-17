// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../core/pagination';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Faces extends APIResource {
  /**
   * Retrieves details for a specific face.
   */
  retrieve(faceID: string, options?: RequestOptions): APIPromise<FaceResponse> {
    return this._client.get(path`/api/faces/${faceID}`, options);
  }

  /**
   * Updates the details of a specific face, currently only supporting
   * associating/disassociating with a person.
   */
  update(faceID: string, body: FaceUpdateParams, options?: RequestOptions): APIPromise<FaceResponse> {
    return this._client.patch(path`/api/faces/${faceID}`, { body, ...options });
  }

  /**
   * Retrieves a paginated list of faces, optionally filtered by asset or person,
   * ordered by creation time, descending.
   */
  list(
    query: FaceListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<FaceResponsesCursorPage, FaceResponse> {
    return this._client.getAPIList('/api/faces', CursorPage<FaceResponse>, { query, ...options });
  }

  /**
   * Deletes a specific face entry. This does not delete the associated asset or
   * person.
   */
  delete(faceID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/api/faces/${faceID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Retrieves a thumbnail for a specific face.
   */
  downloadThumbnail(faceID: string, options?: RequestOptions): APIPromise<Response> {
    return this._client.get(path`/api/faces/${faceID}/thumbnail`, {
      ...options,
      headers: buildHeaders([{ Accept: 'image/*' }, options?.headers]),
      __binaryResponse: true,
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
   * ID of the person this face belongs to (if identified)
   */
  person_id?: string | null;

  /**
   * URL to get a cropped thumbnail of just this face
   */
  thumbnail_url?: string | null;

  /**
   * For video files, timestamp in milliseconds when face appears
   */
  timestamp_ms?: number | null;
}

export interface FaceUpdateParams {
  person_id?: string | null;
}

export interface FaceListParams extends CursorPageParams {
  /**
   * Filter by faces in a specific asset
   */
  asset_id?: string | null;

  /**
   * Filter by faces associated with a specific person
   */
  person_id?: string | null;
}

export declare namespace Faces {
  export {
    type FaceResponse as FaceResponse,
    type FaceResponsesCursorPage as FaceResponsesCursorPage,
    type FaceUpdateParams as FaceUpdateParams,
    type FaceListParams as FaceListParams,
  };
}
