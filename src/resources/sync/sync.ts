// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as ProjectionReadsAPI from './projection-reads';
import {
  AlbumAssetProjection,
  AlbumAssetProjectionKey,
  AlbumProjection,
  AlbumProjectionKey,
  AssetProjection,
  AssetProjectionKey,
  BaselineFamilyTokens,
  CurrentUserProjection,
  CurrentUserProjectionKey,
  EntityProjectionKey,
  FaceProjection,
  FaceProjectionKey,
  FaceProjectionValue,
  GumnutProjectionScope,
  PersonProjection,
  PersonProjectionKey,
  ProjectionBaselineStart,
  ProjectionEnumeration,
  ProjectionErrorDetail,
  ProjectionErrorResponse,
  ProjectionKey,
  ProjectionProfile,
  ProjectionReadReadParams,
  ProjectionReadResponse,
  ProjectionReads,
  ProjectionRootResult,
  RelationSelector,
  StackProjection,
  StackProjectionKey,
  TypedProjection,
} from './projection-reads';

export class Sync extends APIResource {
  projectionReads: ProjectionReadsAPI.ProjectionReads = new ProjectionReadsAPI.ProjectionReads(this._client);
}

Sync.ProjectionReads = ProjectionReads;

export declare namespace Sync {
  export {
    ProjectionReads as ProjectionReads,
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
