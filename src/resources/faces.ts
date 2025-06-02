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

export interface FaceResponse {
  id: string;

  asset_id: string;

  bounding_box: Record<string, number>;

  created_at: string;

  updated_at: string;

  person_id?: string | null;

  thumbnail_url?: string | null;

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
