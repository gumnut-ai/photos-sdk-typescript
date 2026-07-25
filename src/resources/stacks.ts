// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../core/pagination';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Stacks extends APIResource {
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
   * Fetches one stack's metadata by ID (pinned cover, live member count,
   * provenance). The response is metadata only and does not include the stack's
   * assets — to get its frames, use `list_assets` with `stack_id`.
   */
  retrieveStack(stackID: string, options?: RequestOptions): APIPromise<StackRetrieveStackResponse> {
    return this._client.get(path`/api/stacks/${stackID}`, options);
  }
}

export type StackListStacksResponsesCursorPage = CursorPage<StackListStacksResponse>;

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

export interface StackListStacksParams extends CursorPageParams {
  /**
   * Look up specific stacks by ID (max 200; each ID has the `asset_stack_` prefix).
   * Accepts multiple `ids=` query params or a single comma-delimited value (e.g.,
   * `ids=asset_stack_1,asset_stack_2`).
   */
  ids?: Array<string> | null;

  /**
   * Library to list stacks from. Optional if the user has a single library; required
   * when they have multiple.
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

export declare namespace Stacks {
  export {
    type StackListStacksResponse as StackListStacksResponse,
    type StackRetrieveStackResponse as StackRetrieveStackResponse,
    type StackListStacksResponsesCursorPage as StackListStacksResponsesCursorPage,
    type StackListStacksParams as StackListStacksParams,
  };
}
