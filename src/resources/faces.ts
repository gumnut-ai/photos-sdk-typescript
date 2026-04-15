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
  retrieve(
    faceID: string,
    query: FaceRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<FaceResponse> {
    return this._client.get(path`/api/faces/${faceID}`, { query, ...options });
  }

  /**
   * Updates the details of a specific face, currently only supporting
   * associating/disassociating with a person.
   */
  update(faceID: string, params: FaceUpdateParams, options?: RequestOptions): APIPromise<FaceResponse> {
    const { library_id, ...body } = params;
    return this._client.patch(path`/api/faces/${faceID}`, { query: { library_id }, body, ...options });
  }

  /**
   * Retrieves a paginated list of faces, optionally filtered by asset, person, or
   * specific face IDs, ordered by creation time, descending.
   *
   * **Pagination:** When `has_more` is true, pass the `id` of the last face in
   * `data` as `starting_after_id` to fetch the next page.
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
  asset_urls?: { [key: string]: FaceResponse.AssetURLs } | null;

  /**
   * ID of the person this face belongs to (if identified)
   */
  person_id?: string | null;

  /**
   * For video files, timestamp in milliseconds when face appears
   */
  timestamp_ms?: number | null;
}

export namespace FaceResponse {
  /**
   * A single image variant with its URL, MIME type, and target width.
   */
  export interface AssetURLs {
    /**
     * MIME type of the served image
     */
    mimetype: string;

    /**
     * URL to fetch this image variant
     */
    url: string;

    /**
     * Target width in pixels (null if unknown)
     */
    width?: number | null;
  }
}

export interface FaceRetrieveParams {
  /**
   * Library ID (required if user has multiple libraries)
   */
  library_id?: string | null;
}

export interface FaceUpdateParams {
  /**
   * Query param: Library ID (required if user has multiple libraries)
   */
  library_id?: string | null;

  /**
   * Body param
   */
  person_id?: string | null;
}

export interface FaceListParams extends CursorPageParams {
  /**
   * Filter by faces in a specific asset
   */
  asset_id?: string | null;

  /**
   * Filter by specific face IDs (max 100)
   */
  ids?: Array<string> | null;

  /**
   * Library ID (required if user has multiple libraries)
   */
  library_id?: string | null;

  /**
   * Filter by faces associated with a specific person
   */
  person_id?: string | null;
}

export interface FaceDeleteParams {
  /**
   * Library ID (required if user has multiple libraries)
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
