// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../core/pagination';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Groups of related shots of the same moment, presented as a single unit with a cover asset.
 */
export class Stacks extends APIResource {
  /**
   * Dissolves the stack: the grouping is removed and every member frame returns to
   * loose, individual display. The photos themselves are untouched — nothing is
   * trashed or deleted from the library; like `remove_assets_from_album`, this only
   * removes an organizational grouping. Use `trash_assets` to soft-delete the
   * underlying assets. If a concurrent mutation adds a frame mid-delete, returns 409
   * and nothing is changed; retry the request.
   */
  delete(stackID: string, options?: RequestOptions): APIPromise<StackDeleteResponse> {
    return this._client.delete(path`/api/stacks/${stackID}`, options);
  }

  /**
   * Adds one or more existing assets to the stack. An asset already in another stack
   * is reconciled exactly as `create_stack` does. Ids already in this stack are
   * silently skipped.
   *
   * An add that changes membership marks the stack user-owned (`origin = user`),
   * which freezes it against burst re-detection; a request that changes nothing
   * leaves `origin` unchanged.
   *
   * If a concurrent stack change invalidates the request mid-flight, it returns 409
   * and nothing is changed; retry the request unchanged, except where the 409
   * reports the target stack itself is gone, which is terminal.
   */
  addAssetsToStack(
    stackID: string,
    body: StackAddAssetsToStackParams,
    options?: RequestOptions,
  ): APIPromise<StackAddAssetsToStackResponse> {
    return this._client.post(path`/api/stacks/${stackID}/assets`, { body, ...options });
  }

  /**
   * Groups two or more existing assets into a new user-owned stack (`origin = user`)
   * for collapsed display. A user-owned stack is never re-segmented by burst
   * re-detection.
   *
   * An asset already in another stack is repointed into the new one, folding that
   * stack in whole if it was its pinned cover; a stack left with fewer than 2
   * members dissolves. The photos themselves are untouched.
   *
   * If a concurrent stack change invalidates the request mid-flight, it returns 409
   * and nothing is created; retry the request unchanged.
   */
  createStack(body: StackCreateStackParams, options?: RequestOptions): APIPromise<StackCreateStackResponse> {
    return this._client.post('/api/stacks', { body, ...options });
  }

  /**
   * Returns a paginated list of stacks — assets grouped for collapsed display,
   * whether detected automatically or grouped by the user — ordered by `id`: stable,
   * but arbitrary rather than chronological.
   *
   * `list_stacks` returns stack metadata only; it does not return the assets inside
   * a stack. To get a stack's frames, use `list_assets` with `stack_id`.
   *
   * **Pagination** is cursor-based: when `has_more` is true, pass the `id` of the
   * last stack in `data` as `starting_after_id` to fetch the next page.
   */
  listStacks(
    query: StackListStacksParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<StackListStacksResponsesCursorPage, StackListStacksResponse> {
    return this._client.getAPIList('/api/stacks', CursorPage<StackListStacksResponse>, { query, ...options });
  }

  /**
   * Pulls one or more frames out of the stack. The assets themselves are untouched —
   * they remain in the library (and in any albums) and simply appear as individual
   * photos again. IDs that are not current members of the stack are silently
   * ignored.
   *
   * If a removed frame was the pinned cover, the pin is cleared with no automatic
   * re-pick — clients choose their own display cover. A stack that survives the
   * removal is marked user-owned (`origin = user`) so burst re-detection honors the
   * edit; a removal that leaves fewer than 2 members dissolves the stack entirely,
   * returning its remaining frames to loose display too. Trashed frames still count
   * as members for that threshold (unlike `asset_count`, which excludes them), so a
   * stack can survive with `asset_count` below 2.
   *
   * Up to 200 ids per request; over-cap requests return 422.
   */
  removeAssets(
    stackID: string,
    body: StackRemoveAssetsParams,
    options?: RequestOptions,
  ): APIPromise<StackRemoveAssetsResponse> {
    return this._client.delete(path`/api/stacks/${stackID}/assets`, { body, ...options });
  }

  /**
   * Fetches one stack's metadata by ID (pinned cover, live member count,
   * provenance). The response is metadata only and does not include the stack's
   * assets — to get its frames, use `list_assets` with `stack_id`.
   */
  retrieveStack(stackID: string, options?: RequestOptions): APIPromise<StackRetrieveStackResponse> {
    return this._client.get(path`/api/stacks/${stackID}`, options);
  }

  /**
   * Pins one of the stack's own live members as its cover (`primary_asset_id`).
   * Setting a cover marks the stack as user-owned (`origin = user`), which freezes
   * it — membership included — against burst re-detection, so neither the chosen
   * cover nor the frame grouping is ever silently reverted by a later detection
   * pass.
   *
   * `primary_asset_id` cannot be null: there is no manual clear-cover operation. A
   * pin clears automatically when the pinned frame is removed from the stack or
   * permanently deleted.
   */
  setCover(
    stackID: string,
    body: StackSetCoverParams,
    options?: RequestOptions,
  ): APIPromise<StackSetCoverResponse> {
    return this._client.patch(path`/api/stacks/${stackID}`, { body, ...options });
  }
}

export type StackListStacksResponsesCursorPage = CursorPage<StackListStacksResponse>;

/**
 * Acknowledgment body returned by destructive endpoints (delete / trash / restore
 * / permanently delete / remove-from-album / empty-trash).
 *
 * Carries no fields — the HTTP 200 + empty JSON object is itself the success
 * signal. Exists so MCP tools generated from these endpoints have a real
 * `outputSchema` (rather than the null schema FastMCP emits for 204 responses),
 * which ChatGPT's MCP submission tooling requires.
 */
export interface StackDeleteResponse {}

/**
 * Represents a group of assets displayed as a single tile.
 */
export interface StackAddAssetsToStackResponse {
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
   * ID of the asset the user pinned as the stack's cover, or null if none is pinned.
   * Null for an auto-detected burst unless a user has since pinned a cover — there
   * is no server-selected default, so a client showing a stack with no pinned cover
   * picks its own. A pinned cover that has been trashed keeps its ID here; it is
   * cleared only once the asset is permanently deleted.
   */
  primary_asset_id?: string | null;
}

/**
 * Represents a group of assets displayed as a single tile.
 */
export interface StackCreateStackResponse {
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
   * ID of the asset the user pinned as the stack's cover, or null if none is pinned.
   * Null for an auto-detected burst unless a user has since pinned a cover — there
   * is no server-selected default, so a client showing a stack with no pinned cover
   * picks its own. A pinned cover that has been trashed keeps its ID here; it is
   * cleared only once the asset is permanently deleted.
   */
  primary_asset_id?: string | null;
}

/**
 * Represents a group of assets displayed as a single tile.
 */
export interface StackListStacksResponse {
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
   * ID of the asset the user pinned as the stack's cover, or null if none is pinned.
   * Null for an auto-detected burst unless a user has since pinned a cover — there
   * is no server-selected default, so a client showing a stack with no pinned cover
   * picks its own. A pinned cover that has been trashed keeps its ID here; it is
   * cleared only once the asset is permanently deleted.
   */
  primary_asset_id?: string | null;
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
export interface StackRemoveAssetsResponse {}

/**
 * Represents a group of assets displayed as a single tile.
 */
export interface StackRetrieveStackResponse {
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
   * ID of the asset the user pinned as the stack's cover, or null if none is pinned.
   * Null for an auto-detected burst unless a user has since pinned a cover — there
   * is no server-selected default, so a client showing a stack with no pinned cover
   * picks its own. A pinned cover that has been trashed keeps its ID here; it is
   * cleared only once the asset is permanently deleted.
   */
  primary_asset_id?: string | null;
}

/**
 * Represents a group of assets displayed as a single tile.
 */
export interface StackSetCoverResponse {
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
   * ID of the asset the user pinned as the stack's cover, or null if none is pinned.
   * Null for an auto-detected burst unless a user has since pinned a cover — there
   * is no server-selected default, so a client showing a stack with no pinned cover
   * picks its own. A pinned cover that has been trashed keeps its ID here; it is
   * cleared only once the asset is permanently deleted.
   */
  primary_asset_id?: string | null;
}

export interface StackAddAssetsToStackParams {
  /**
   * Asset IDs (with `asset_` prefix) to add to the stack — all in the stack's
   * library.
   */
  asset_ids: Array<string>;
}

export interface StackCreateStackParams {
  /**
   * Asset IDs (with `asset_` prefix) to group into the new stack — at least 2
   * distinct ids, all in the target library.
   */
  asset_ids: Array<string>;

  /**
   * Library to create the stack in. Optional if the user has a single live
   * (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;

  /**
   * Asset ID (with `asset_` prefix) to pin as the stack's cover; must be one of
   * `asset_ids`. Omit to leave the cover unpinned — there is no automatic pick, and
   * clients choose their own display cover for an unpinned stack.
   */
  primary_asset_id?: string | null;
}

export interface StackListStacksParams extends CursorPageParams {
  /**
   * Look up specific stacks by ID (max 200; each ID has the `asset_stack_` prefix).
   * Accepts multiple `ids=` query params or a single comma-delimited value (e.g.,
   * `ids=asset_stack_1,asset_stack_2`).
   */
  ids?: Array<string> | null;

  /**
   * Library to list stacks from. Optional if the user has a single live
   * (non-trashed) library; required when they have multiple.
   */
  library_id?: string | null;

  /**
   * Return only stacks with this provenance.
   */
  origin?: 'auto_burst' | 'user' | null;

  /**
   * Return only the stack that pins this asset (with `asset_` prefix) as its cover.
   */
  primary_asset_id?: string | null;
}

export interface StackRemoveAssetsParams {
  /**
   * Asset IDs (with `asset_` prefix) to pull out of the stack. Get member IDs from
   * `list_assets` with `stack_id`. Up to 200 ids per request.
   */
  asset_ids: Array<string>;
}

export interface StackSetCoverParams {
  /**
   * Asset ID (with `asset_` prefix) to pin as the stack's cover. Must be a live,
   * current member of this stack — get member IDs from `list_assets` with
   * `stack_id`.
   */
  primary_asset_id: string;
}

export declare namespace Stacks {
  export {
    type StackDeleteResponse as StackDeleteResponse,
    type StackAddAssetsToStackResponse as StackAddAssetsToStackResponse,
    type StackCreateStackResponse as StackCreateStackResponse,
    type StackListStacksResponse as StackListStacksResponse,
    type StackRemoveAssetsResponse as StackRemoveAssetsResponse,
    type StackRetrieveStackResponse as StackRetrieveStackResponse,
    type StackSetCoverResponse as StackSetCoverResponse,
    type StackListStacksResponsesCursorPage as StackListStacksResponsesCursorPage,
    type StackAddAssetsToStackParams as StackAddAssetsToStackParams,
    type StackCreateStackParams as StackCreateStackParams,
    type StackListStacksParams as StackListStacksParams,
    type StackRemoveAssetsParams as StackRemoveAssetsParams,
    type StackSetCoverParams as StackSetCoverParams,
  };
}
