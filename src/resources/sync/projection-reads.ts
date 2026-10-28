// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as AlbumAssetsAPI from '../album-assets';
import * as FacesAPI from '../faces';
import * as PeopleAPI from '../people';
import * as UsersAPI from '../users';
import * as AlbumsAPI from '../albums/albums';
import * as AssetsAPI from '../assets/assets';
import * as LibrariesAPI from '../libraries/libraries';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

/**
 * Read the Gumnut library catalog as coherent roots or finite baseline and relation pages. Enumeration tokens are opaque selection cursors, not authorization or retained snapshots. Install complete bundles and their progress atomically before advancing event catch-up.
 */
export class ProjectionReads extends APIResource {
  /**
   * Read explicit roots or finite baseline/relation pages with complete dependencies
   * from one current read-only source snapshot per request. The gumnut-library
   * version 1 profile uses signed finite selection tokens, not retained snapshots.
   * Every accepted root is complete or the response fails.
   */
  read(body: ProjectionReadReadParams, options?: RequestOptions): APIPromise<ProjectionReadResponse> {
    return this._client.post('/api/sync/projection-reads', { body, ...options });
  }
}

export interface AlbumAssetProjection {
  /**
   * Stable album and asset pair key
   */
  key: AlbumAssetProjectionKey;

  kind: 'album_asset';

  /**
   * Fully materialized current domain value
   */
  value: AlbumAssetsAPI.AlbumAssetResponse;
}

export interface AlbumAssetProjectionKey {
  /**
   * Album identifier in the bound library
   */
  album_id: string;

  /**
   * Asset identifier in the bound library
   */
  asset_id: string;

  kind: 'album_asset';
}

export interface AlbumProjection {
  /**
   * Stable key matching this projection value
   */
  key: AlbumProjectionKey;

  kind: 'album';

  /**
   * Fully materialized current domain value
   */
  value: AlbumsAPI.AlbumResponse;
}

export interface AlbumProjectionKey {
  /**
   * Stable entity identifier; current_user must name the authenticated principal
   */
  id: string;

  kind: 'album';
}

export interface AssetProjection {
  /**
   * Stable key matching this projection value
   */
  key: AssetProjectionKey;

  kind: 'asset';

  /**
   * Fully materialized current domain value
   */
  value: AssetsAPI.AssetResponse;
}

export interface AssetProjectionKey {
  /**
   * Stable entity identifier; current_user must name the authenticated principal
   */
  id: string;

  kind: 'asset';
}

export interface BaselineFamilyTokens {
  album: string;

  album_asset: string;

  asset: string;

  face: string;

  person: string;

  stack: string;
}

export interface CurrentUserProjection {
  /**
   * Stable key matching this projection value
   */
  key: CurrentUserProjectionKey;

  kind: 'current_user';

  /**
   * Fully materialized current domain value
   */
  value: UsersAPI.UserResponse;
}

export interface CurrentUserProjectionKey {
  /**
   * Stable entity identifier; current_user must name the authenticated principal
   */
  id: string;

  kind: 'current_user';
}

export interface EntityProjectionKey {
  /**
   * Stable entity identifier; current_user must name the authenticated principal
   */
  id: string;

  kind: 'current_user' | 'asset' | 'person' | 'face' | 'stack' | 'album';
}

export interface FaceProjection {
  /**
   * Stable key matching this projection value
   */
  key: FaceProjectionKey;

  kind: 'face';

  /**
   * Fully materialized current domain value
   */
  value: FaceProjectionValue;
}

export interface FaceProjectionKey {
  /**
   * Stable entity identifier; current_user must name the authenticated principal
   */
  id: string;

  kind: 'face';
}

export interface FaceProjectionValue {
  /**
   * Original frame height in pixels
   */
  coordinate_height: number;

  /**
   * Original frame width in pixels
   */
  coordinate_width: number;

  /**
   * Eligible face in its original coordinate frame
   */
  face: FacesAPI.FaceResponse;
}

export interface GumnutProjectionScope {
  /**
   * Current actual library owner, caller role, counts, limits, and profile
   */
  library: LibrariesAPI.LibraryResponse;

  /**
   * Current bound library identifier
   */
  library_id: string;

  /**
   * Opaque source eligibility policy fingerprint; a changed value requires coverage
   * rebuild
   */
  policy_fingerprint: string;
}

export interface PersonProjection {
  /**
   * Stable key matching this projection value
   */
  key: PersonProjectionKey;

  kind: 'person';

  /**
   * Fully materialized current domain value
   */
  value: PeopleAPI.PersonResponse;
}

export interface PersonProjectionKey {
  /**
   * Stable entity identifier; current_user must name the authenticated principal
   */
  id: string;

  kind: 'person';
}

export interface ProjectionBaselineStart {
  family_tokens: BaselineFamilyTokens;

  /**
   * Version one starts catch-up at the beginning of retained event history
   */
  source_cursor: null;
}

export interface ProjectionEnumeration {
  complete: boolean;

  next_token: string | null;
}

export interface ProjectionErrorDetail {
  /**
   * Stable machine-readable projection error code
   */
  code: string;

  /**
   * Safe server-owned explanation
   */
  message: string;

  /**
   * Whether retrying a fresh read without changing input may succeed
   */
  retryable: boolean;

  limit?: 'roots' | 'projections' | 'bytes' | 'snapshot_ms' | null;
}

export interface ProjectionErrorResponse {
  /**
   * Structured projection failure with no partial bundle
   */
  detail: ProjectionErrorDetail;
}

export type ProjectionKey = EntityProjectionKey | AlbumAssetProjectionKey;

export interface ProjectionProfile {
  /**
   * Immutable Gumnut domain contract name
   */
  name: 'gumnut-library';

  /**
   * Immutable contract version
   */
  version: 1;
}

export interface ProjectionReadResponse {
  /**
   * Finite family bounds and safe event start, only in baseline_begin
   */
  baseline_start: ProjectionBaselineStart | null;

  /**
   * Accepted prefix frontier, only in baseline_page or relation_page
   */
  enumeration: ProjectionEnumeration | null;

  /**
   * Lowercase SHA-256 of the canonical complete semantic manifest
   */
  profile_hash: string;

  /**
   * Deduplicated complete closure sorted by kind and key; includes the principal in
   * content reads, empty in baseline_begin
   */
  projections: Array<TypedProjection>;

  /**
   * Exact selected root results, sorted by kind and stable key
   */
  roots: Array<ProjectionRootResult>;

  /**
   * Current library scope captured with the content
   */
  scope: GumnutProjectionScope;

  /**
   * Projection bundle semantic schema version
   */
  semantic_schema_version: 1;

  /**
   * Diagnostic read identifier; cannot retrieve an old snapshot
   */
  snapshot_id: string;
}

export interface ProjectionRootResult {
  /**
   * Exactly one of the selected root keys
   */
  key: ProjectionKey;

  /**
   * Present, absent from this library, or excluded by profile eligibility
   */
  status: 'present' | 'absent' | 'not_projected';
}

export interface RelationSelector {
  /**
   * Parent whose current result accompanies each child page
   */
  parent_id: string;

  /**
   * Approved child relationship to enumerate
   */
  relation: 'asset_faces' | 'asset_albums' | 'person_faces' | 'stack_assets' | 'album_assets';
}

export interface StackProjection {
  /**
   * Stable key matching this projection value
   */
  key: StackProjectionKey;

  kind: 'stack';

  /**
   * Fully materialized current domain value
   */
  value: StackProjection.Value;
}

export namespace StackProjection {
  /**
   * Fully materialized current domain value
   */
  export interface Value {
    /**
     * Unique stack identifier with 'asset*stack*' prefix
     */
    id: string;

    /**
     * Number of live assets in this stack. Excludes trashed members, so it can drop
     * below the number of frames originally grouped.
     */
    asset_count: number;

    /**
     * When this stack was created
     */
    created_at: string;

    /**
     * How a stack came to exist.
     *
     * `auto_burst` marks a stack the burst detector created from the time +
     * EXIF-camera signal; `user` marks a stack a user created or edited (manual
     * create, set-cover, add/remove, unstack). The distinction is what keeps
     * re-detection from stomping a user's correction — the detection pass skips `user`
     * stacks.
     */
    origin: 'auto_burst' | 'user';

    /**
     * When this stack was last updated
     */
    updated_at: string;

    /**
     * IDs of the stack's live members, earliest capture time first — the order
     * `list_assets` returns for this `stack_id` with `order=asc`. Excludes trashed
     * members, like `asset_count`. Only populated by `list_stacks` with
     * `include=asset_ids`; null otherwise.
     */
    asset_ids?: Array<string> | null;

    /**
     * ID of the asset the user pinned as the stack's cover, or null if none is pinned.
     * Null for an auto-detected burst unless a user has since pinned a cover — there
     * is no server-selected default, so a client showing a stack with no pinned cover
     * picks its own. A pinned cover that has been trashed keeps its ID here; it is
     * cleared only once the asset is permanently deleted.
     */
    primary_asset_id?: string | null;
  }
}

export interface StackProjectionKey {
  /**
   * Stable entity identifier; current_user must name the authenticated principal
   */
  id: string;

  kind: 'stack';
}

export type TypedProjection =
  | CurrentUserProjection
  | AssetProjection
  | PersonProjection
  | FaceProjection
  | StackProjection
  | AlbumProjection
  | AlbumAssetProjection;

export type ProjectionReadReadParams =
  | ProjectionReadReadParams.RootsProjectionReadRequest
  | ProjectionReadReadParams.BaselineBeginRequest
  | ProjectionReadReadParams.BaselinePageRequest
  | ProjectionReadReadParams.RelationPageRequest;

export declare namespace ProjectionReadReadParams {
  export interface RootsProjectionReadRequest {
    /**
     * Nonempty unique root selection; exceeding capacity returns 413
     */
    keys: Array<ProjectionKey>;

    /**
     * Explicit live library binding for every root and dependency
     */
    library_id: string;

    /**
     * Read exactly the explicit roots and their required dependencies
     */
    mode: 'roots';

    /**
     * Versioned source semantics to project
     */
    profile: ProjectionProfile;
  }

  export interface BaselineBeginRequest {
    /**
     * Explicit live library binding for every root and dependency
     */
    library_id: string;

    /**
     * Capture finite family bounds and safe event start
     */
    mode: 'baseline_begin';

    /**
     * Versioned source semantics to project
     */
    profile: ProjectionProfile;
  }

  export interface BaselinePageRequest {
    /**
     * Signed finite selection; never an authorization or snapshot handle
     */
    enumeration_token: string;

    /**
     * Explicit live library binding for every root and dependency
     */
    library_id: string;

    /**
     * Continue one baseline family's finite selection
     */
    mode: 'baseline_page';

    /**
     * Versioned source semantics to project
     */
    profile: ProjectionProfile;
  }

  export interface RelationPageRequest {
    /**
     * Null starts a finite relation scan; otherwise continue its signed selection
     */
    enumeration_token: string | null;

    /**
     * Explicit live library binding for every root and dependency
     */
    library_id: string;

    /**
     * Enumerate finite current children with their parent
     */
    mode: 'relation_page';

    /**
     * Versioned source semantics to project
     */
    profile: ProjectionProfile;

    /**
     * Bound relationship and parent identity
     */
    selector: RelationSelector;
  }
}

export declare namespace ProjectionReads {
  export {
    type AlbumAssetProjection as AlbumAssetProjection,
    type AlbumAssetProjectionKey as AlbumAssetProjectionKey,
    type AlbumProjection as AlbumProjection,
    type AlbumProjectionKey as AlbumProjectionKey,
    type AssetProjection as AssetProjection,
    type AssetProjectionKey as AssetProjectionKey,
    type BaselineFamilyTokens as BaselineFamilyTokens,
    type CurrentUserProjection as CurrentUserProjection,
    type CurrentUserProjectionKey as CurrentUserProjectionKey,
    type EntityProjectionKey as EntityProjectionKey,
    type FaceProjection as FaceProjection,
    type FaceProjectionKey as FaceProjectionKey,
    type FaceProjectionValue as FaceProjectionValue,
    type GumnutProjectionScope as GumnutProjectionScope,
    type PersonProjection as PersonProjection,
    type PersonProjectionKey as PersonProjectionKey,
    type ProjectionBaselineStart as ProjectionBaselineStart,
    type ProjectionEnumeration as ProjectionEnumeration,
    type ProjectionErrorDetail as ProjectionErrorDetail,
    type ProjectionErrorResponse as ProjectionErrorResponse,
    type ProjectionKey as ProjectionKey,
    type ProjectionProfile as ProjectionProfile,
    type ProjectionReadResponse as ProjectionReadResponse,
    type ProjectionRootResult as ProjectionRootResult,
    type RelationSelector as RelationSelector,
    type StackProjection as StackProjection,
    type StackProjectionKey as StackProjectionKey,
    type TypedProjection as TypedProjection,
    type ProjectionReadReadParams as ProjectionReadReadParams,
  };
}
