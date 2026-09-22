// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import { APIPromise } from '../../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * First-party session only. Manage membership in a library owned by the signed-in account, or leave a joined library. API keys and delegated OAuth credentials cannot call these methods.
 */
export class Members extends APIResource {
  /**
   * Change an active non-owner member's role. Repeating the same role is unchanged.
   * An inactive membership or attempt to change the owner returns 409; retrying
   * unchanged will not clear it.
   */
  update(
    userID: string,
    params: MemberUpdateParams,
    options?: RequestOptions,
  ): APIPromise<MembershipResponse> {
    const { library_id, ...body } = params;
    return this._client.patch(path`/api/libraries/${library_id}/members/${userID}`, { body, ...options });
  }

  /**
   * List non-owner membership records for a library owned by the caller, newest
   * first. Inactive records remain available through the state filter.
   */
  list(
    libraryID: string,
    query: MemberListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<MembershipResponsesCursorPage, MembershipResponse> {
    return this._client.getAPIList(
      path`/api/libraries/${libraryID}/members`,
      CursorPage<MembershipResponse>,
      { query, ...options },
    );
  }

  /**
   * End the caller's own non-owner membership, even when library content is
   * unavailable. Repeating departure returns the existing inactive state without
   * changing an owner-removal cutoff. An owner cannot leave; retrying unchanged
   * returns 409.
   */
  leave(libraryID: string, options?: RequestOptions): APIPromise<MembershipResponse> {
    return this._client.post(path`/api/libraries/${libraryID}/leave`, options);
  }

  /**
   * End a non-owner membership while retaining its owner-removal cutoff. Repeating
   * removal returns the same record without advancing the cutoff. The owner cannot
   * be removed; retrying that request unchanged returns 409.
   */
  remove(
    userID: string,
    params: MemberRemoveParams,
    options?: RequestOptions,
  ): APIPromise<MembershipResponse> {
    const { library_id } = params;
    return this._client.delete(path`/api/libraries/${library_id}/members/${userID}`, options);
  }
}

export type MembershipResponsesCursorPage = CursorPage<MembershipResponse>;

export interface MembershipPage {
  /**
   * Non-owner membership records in newest-first order.
   */
  data: Array<MembershipResponse>;

  /**
   * Whether another page exists. Pass the last item's ID as `starting_after_id` and
   * repeat the same `state` filter.
   */
  has_more: boolean;
}

export interface MembershipResponse {
  /**
   * Stable membership record identifier.
   */
  id: string;

  /**
   * When this record was created.
   */
  created_at: string;

  /**
   * Most recent departure or removal instant, or null while active.
   */
  ended_at: string | null;

  /**
   * Most recent admission instant.
   */
  joined_at: string;

  /**
   * Retained owner-removal cutoff for readmission, or null.
   */
  last_removed_at: string | null;

  /**
   * Library this membership belongs to.
   */
  library_id: string;

  /**
   * Current or last assigned role.
   */
  role: 'viewer' | 'collaborator';

  /**
   * A member's library access state.
   *
   * active grants the assigned role. left means the member departed; removed means
   * the owner revoked access. left and removed grant no access.
   */
  state: 'active' | 'left' | 'removed';

  /**
   * When this record last changed.
   */
  updated_at: string;

  /**
   * Member account summary.
   */
  user: Shared.UserSummary;
}

export interface MemberUpdateParams {
  /**
   * Path param: Library identifier.
   */
  library_id: string;

  /**
   * Body param: New role for an active member.
   */
  role: 'viewer' | 'collaborator';
}

export interface MemberListParams extends CursorPageParams {
  /**
   * Return only memberships in this state, or all states.
   */
  state?: 'active' | 'left' | 'removed' | 'all';
}

export interface MemberRemoveParams {
  /**
   * Library identifier.
   */
  library_id: string;
}

export declare namespace Members {
  export {
    type MembershipPage as MembershipPage,
    type MembershipResponse as MembershipResponse,
    type MembershipResponsesCursorPage as MembershipResponsesCursorPage,
    type MemberUpdateParams as MemberUpdateParams,
    type MemberListParams as MemberListParams,
    type MemberRemoveParams as MemberRemoveParams,
  };
}
