// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as AssetsAPI from './assets';
import { APIPromise } from '../../core/api-promise';
import { type Uploadable } from '../../core/uploads';
import { RequestOptions } from '../../internal/request-options';
import { multipartFormRequestOptions } from '../../internal/uploads';
import { path } from '../../internal/utils/path';

/**
 * Photos and videos in a library: upload, list and filter, update metadata, trash and restore.
 */
export class Versions extends APIResource {
  /**
   * Returns every retained rendering of one asset, ordered by `position` ascending —
   * the uploaded original first, the current rendering last. Not paginated. Each
   * entry's `version_urls` follows the same `include` semantics as an asset's
   * `asset_urls`: lean `thumbnail` by default, `include=variants` for the remaining
   * rungs and the exact-byte `original`.
   *
   * @example
   * ```ts
   * const assetVersionResponses =
   *   await client.assets.versions.list('asset_id');
   * ```
   */
  list(
    assetID: string,
    query: VersionListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<VersionListResponse> {
    return this._client.get(path`/api/assets/${assetID}/versions`, { query, ...options });
  }

  /**
   * Irreversibly deletes the current non-original version and restores its
   * predecessor. The original returns 422; a buried version returns 409.
   *
   * @example
   * ```ts
   * const assetResponse = await client.assets.versions.delete(
   *   'version_id',
   *   { asset_id: 'asset_id' },
   * );
   * ```
   */
  delete(
    versionID: string,
    params: VersionDeleteParams,
    options?: RequestOptions,
  ): APIPromise<AssetsAPI.AssetResponse> {
    const { asset_id } = params;
    return this._client.delete(path`/api/assets/${asset_id}/versions/${versionID}`, options);
  }

  /**
   * Uploads a fully rendered image — with all edits already applied to its pixels —
   * above the original version. An append is accepted only while the original is
   * current; replace the current derived version through its replacement endpoint
   * instead. Exact duplicates store nothing. Metadata is copied from the original,
   * so retained bytes may differ from uploaded bytes.
   *
   * @example
   * ```ts
   * const assetVersionResponse =
   *   await client.assets.versions.append('asset_id', {
   *     file: fs.createReadStream('path/to/file'),
   *     kind: 'kind',
   *     params: 'params',
   *   });
   * ```
   */
  append(
    assetID: string,
    params: VersionAppendParams,
    options?: RequestOptions,
  ): APIPromise<AssetVersionResponse> {
    const { include, ...body } = params;
    return this._client.post(
      path`/api/assets/${assetID}/versions`,
      multipartFormRequestOptions({ query: { include }, body, ...options }, this._client),
    );
  }

  /**
   * Uploads a fully rendered image and replaces the version named in the path. That
   * version must still be the current non-original version; the server infers its
   * parent. Exact duplicates store nothing. Metadata is copied from the original, so
   * retained bytes may differ from uploaded bytes.
   *
   * @example
   * ```ts
   * const assetVersionResponse =
   *   await client.assets.versions.replace('version_id', {
   *     asset_id: 'asset_id',
   *     file: fs.createReadStream('path/to/file'),
   *     kind: 'kind',
   *     params: 'params',
   *   });
   * ```
   */
  replace(
    versionID: string,
    params: VersionReplaceParams,
    options?: RequestOptions,
  ): APIPromise<AssetVersionResponse> {
    const { asset_id, include, ...body } = params;
    return this._client.post(
      path`/api/assets/${asset_id}/versions/${versionID}/replace`,
      multipartFormRequestOptions({ query: { include }, body, ...options }, this._client),
    );
  }

  /**
   * Makes a retained version current and irreversibly deletes its descendants.
   * Reverting to the current version is a no-op.
   *
   * @example
   * ```ts
   * const assetResponse = await client.assets.versions.revert(
   *   'version_id',
   *   { asset_id: 'asset_id' },
   * );
   * ```
   */
  revert(
    versionID: string,
    params: VersionRevertParams,
    options?: RequestOptions,
  ): APIPromise<AssetsAPI.AssetResponse> {
    const { asset_id } = params;
    return this._client.post(path`/api/assets/${asset_id}/versions/${versionID}/revert`, options);
  }
}

/**
 * One rendering in an asset's retained version chain.
 */
export interface AssetVersionResponse {
  /**
   * Unique version identifier with 'asset*version*' prefix
   */
  id: string;

  /**
   * Base64-encoded SHA-256 hash of this rendering's stored bytes, for comparing a
   * locally computed hash against the chain (e.g. when reconciling an ambiguous
   * create failure). Not unique: identical bytes may legitimately appear at
   * different positions or on other assets. Transitionally null for roots written
   * during the column's rollout window, until a follow-up backfill lands.
   */
  checksum: string | null;

  /**
   * Byte size of this rendering's stored bytes.
   */
  file_size_bytes: number;

  /**
   * Height of this rendering in pixels
   */
  height: number;

  /**
   * What produced this rendering: `original` (the upload), `edit` (an edit rendered
   * by the client), or `external:<service>`. The namespace is open — treat an
   * unrecognized kind as opaque rather than failing.
   */
  kind: string;

  /**
   * MIME type of this rendering's bytes (e.g., 'image/jpeg')
   */
  mime_type: string;

  /**
   * Zero-based index in the chain: 0 is the uploaded original, the highest is the
   * current rendering.
   */
  position: number;

  /**
   * Width of this rendering in pixels
   */
  width: number;

  /**
   * How this rendering was produced (e.g. an edit recipe). Opaque to the server; the
   * schema is defined by whichever producer sets `kind`. `null` only for the
   * original.
   */
  params?: { [key: string]: unknown } | null;

  /**
   * URLs for this rendering, shaped like an asset's `asset_urls`: the lean
   * `thumbnail`/`thumbnail_image` rung by default; `include=variants` adds the
   * remaining rungs and `original`, this rendering's exact stored bytes.
   */
  version_urls?: { [key: string]: Shared.AssetVariant } | null;
}

export type VersionListResponse = Array<AssetVersionResponse>;

export interface VersionListParams {
  /**
   * Optional response expansion. The single accepted value is `variants`: without it
   * each row's `version_urls` carries only its lean thumbnail rung; with it, every
   * rung plus the signed exact-byte `original`. Accepts multiple `include=` query
   * params or a single comma-delimited value. Unknown values return 422.
   */
  include?: Array<string> | null;
}

export interface VersionDeleteParams {
  /**
   * Asset ID (with `asset_` prefix) whose version to delete.
   */
  asset_id: string;
}

export interface VersionAppendParams {
  /**
   * Body param: JPEG or PNG bytes with all edits and orientation already applied to
   * the pixels, at most 100 MiB. The metadata-finalized file must also remain within
   * that limit. The part's `Content-Type` declares the expected format; the format
   * detected from the bytes is authoritative, and a concrete declared type that
   * disagrees with it returns 422.
   */
  file: Uploadable;

  /**
   * Body param: What produced this rendering: `edit` for an edit rendered by the
   * client, or `external:<service>` for an external producer. `original` is reserved
   * for the uploaded position-0 version.
   */
  kind: string;

  /**
   * Body param: JSON object describing how the rendering was produced (e.g. an edit
   * recipe), serialized as a string. Opaque to the server; the schema is defined by
   * whichever producer sets `kind`. Malformed JSON, a non-object, or an over-large
   * object returns 422.
   */
  params: string;

  /**
   * Query param: Optional response expansion. The single accepted value is
   * `variants`: without it each row's `version_urls` carries only its lean thumbnail
   * rung; with it, every rung plus the signed exact-byte `original`. Accepts
   * multiple `include=` query params or a single comma-delimited value. Unknown
   * values return 422.
   */
  include?: Array<string> | null;
}

export interface VersionReplaceParams {
  /**
   * Path param: Asset ID (with `asset_` prefix) whose version to replace.
   */
  asset_id: string;

  /**
   * Body param: JPEG or PNG bytes with all edits and orientation already applied to
   * the pixels, at most 100 MiB. The metadata-finalized file must also remain within
   * that limit. The part's `Content-Type` declares the expected format; the format
   * detected from the bytes is authoritative, and a concrete declared type that
   * disagrees with it returns 422.
   */
  file: Uploadable;

  /**
   * Body param: What produced this rendering: `edit` for an edit rendered by the
   * client, or `external:<service>` for an external producer. `original` is reserved
   * for the uploaded position-0 version.
   */
  kind: string;

  /**
   * Body param: JSON object describing how the rendering was produced (e.g. an edit
   * recipe), serialized as a string. Opaque to the server; the schema is defined by
   * whichever producer sets `kind`. Malformed JSON, a non-object, or an over-large
   * object returns 422.
   */
  params: string;

  /**
   * Query param: Optional response expansion. The single accepted value is
   * `variants`: without it each row's `version_urls` carries only its lean thumbnail
   * rung; with it, every rung plus the signed exact-byte `original`. Accepts
   * multiple `include=` query params or a single comma-delimited value. Unknown
   * values return 422.
   */
  include?: Array<string> | null;
}

export interface VersionRevertParams {
  /**
   * Asset ID (with `asset_` prefix) to revert.
   */
  asset_id: string;
}

export declare namespace Versions {
  export {
    type AssetVersionResponse as AssetVersionResponse,
    type VersionListResponse as VersionListResponse,
    type VersionListParams as VersionListParams,
    type VersionDeleteParams as VersionDeleteParams,
    type VersionAppendParams as VersionAppendParams,
    type VersionReplaceParams as VersionReplaceParams,
    type VersionRevertParams as VersionRevertParams,
  };
}
