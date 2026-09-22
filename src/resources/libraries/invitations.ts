// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as LibrariesAPI from './libraries';
import * as MembersAPI from './members';
import { APIPromise } from '../../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * First-party session only. Owners manage links; signed-in recipients preview and join with the secret in the POST body. API keys and delegated OAuth credentials cannot call these methods.
 */
export class Invitations extends APIResource {
  /**
   * Issue an invitation for one library. An identical active policy returns the same
   * link with 200; a new policy returns 201. A matching inactive invitation returns
   * 409 without a link; retry with a new policy. Admission disabled returns 503;
   * retry after it becomes available.
   */
  create(body: InvitationCreateParams, options?: RequestOptions): APIPromise<InvitationLinkResponse> {
    return this._client.post('/api/libraries/invitations', { body, ...options });
  }

  /**
   * List invitation metadata across libraries owned by the caller, newest first.
   * Secrets are never included.
   */
  list(
    query: InvitationListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<InvitationResponsesCursorPage, InvitationResponse> {
    return this._client.getAPIList('/api/libraries/invitations', CursorPage<InvitationResponse>, {
      query,
      ...options,
    });
  }

  /**
   * Prevent future admissions through this invitation without removing existing
   * members. Repeating disablement returns the same inactive record.
   */
  disable(invitationID: string, options?: RequestOptions): APIPromise<InvitationResponse> {
    return this._client.post(path`/api/libraries/invitations/${invitationID}/disable`, options);
  }

  /**
   * Admit the caller atomically or return their unchanged existing access. Retrying
   * an uncertain join unchanged consumes no additional place. Invalid secrets or
   * unavailable libraries return a generic 404; retry with a valid, available link.
   * Expired, disabled, exhausted, or removal-cutoff invitations return 409; request
   * a new invitation. Admission disabled returns 503; retry after it becomes
   * available.
   */
  join(
    invitationID: string,
    body: InvitationJoinParams,
    options?: RequestOptions,
  ): APIPromise<InvitationJoinResponse> {
    return this._client.post(path`/api/libraries/invitations/${invitationID}/join`, { body, ...options });
  }

  /**
   * Return an active invitation's existing link without changing its policy or
   * usage. Inactive invitations return 409 without a link; retrying unchanged cannot
   * reactivate one.
   */
  link(invitationID: string, options?: RequestOptions): APIPromise<InvitationLinkResponse> {
    return this._client.get(path`/api/libraries/invitations/${invitationID}/link`, options);
  }

  /**
   * Return library attribution and the caller's current eligibility without
   * admitting them or reserving a place. Invalid secrets and unavailable libraries
   * return the same generic 404; retry with a valid, available invitation link.
   */
  preview(
    invitationID: string,
    body: InvitationPreviewParams,
    options?: RequestOptions,
  ): APIPromise<InvitationPreviewResponse> {
    return this._client.post(path`/api/libraries/invitations/${invitationID}/preview`, { body, ...options });
  }
}

export type InvitationResponsesCursorPage = CursorPage<InvitationResponse>;

export interface InvitationJoinResponse {
  /**
   * Library context with the caller's actual role.
   */
  library: LibrariesAPI.LibraryResponse;

  /**
   * Active non-owner membership; null only when the caller owns the library.
   */
  membership: MembersAPI.MembershipResponse | null;

  /**
   * Whether this request admitted the account or returned unchanged access.
   */
  outcome: 'joined' | 'already_member';
}

export interface InvitationLinkResponse {
  /**
   * Active invitation whose link is being returned.
   */
  invitation: InvitationResponse;

  /**
   * Complete browser invitation URL; its fragment contains a bearer secret.
   */
  url: string;
}

export interface InvitationPage {
  /**
   * Invitation metadata in newest-first order; secrets are omitted.
   */
  data: Array<InvitationResponse>;

  /**
   * Whether another page exists. Pass the last item's ID as `starting_after_id` and
   * repeat the same `library_id` and `state` filters.
   */
  has_more: boolean;
}

export interface InvitationPreviewResponse {
  /**
   * Existing active role, or null when the account has no current access.
   */
  current_role: 'owner' | 'viewer' | 'collaborator' | null;

  /**
   * Current eligibility; preview does not reserve a place.
   */
  eligibility:
    | 'joinable'
    | 'already_member'
    | 'expired'
    | 'disabled'
    | 'exhausted'
    | 'new_invitation_required';

  /**
   * Invitation expiration instant.
   */
  expires_at: string;

  /**
   * Previewed invitation identifier.
   */
  invitation_id: string;

  /**
   * Library attribution without content or storage details.
   */
  library: InvitationPreviewResponse.Library;

  /**
   * Role offered if this account joins.
   */
  offered_role: 'viewer' | 'collaborator';
}

export namespace InvitationPreviewResponse {
  /**
   * Library attribution without content or storage details.
   */
  export interface Library {
    /**
     * Library identifier.
     */
    id: string;

    /**
     * Library name.
     */
    name: string;

    /**
     * Owning account summary.
     */
    owner: Shared.UserSummary;
  }
}

export interface InvitationResponse {
  /**
   * Stable invitation identifier.
   */
  id: string;

  /**
   * When this invitation was issued.
   */
  created_at: string;

  /**
   * Account that created this invitation.
   */
  created_by: Shared.UserSummary;

  /**
   * When the owner disabled this invitation, or null.
   */
  disabled_at: string | null;

  /**
   * Exclusive expiration instant.
   */
  expires_at: string;

  /**
   * Number of accounts that have redeemed this invitation, including departed
   * members.
   */
  joiner_count: number;

  /**
   * ID of the target library.
   */
  library_id: string;

  /**
   * Fixed maximum number of distinct redemptions.
   */
  max_joiners: number;

  /**
   * Places remaining for new accounts; never negative.
   */
  remaining_places: number;

  /**
   * Role offered to admitted members.
   */
  role: 'viewer' | 'collaborator';

  /**
   * Derived invitation state, with disablement taking precedence over expiration and
   * exhaustion.
   */
  state: 'active' | 'exhausted' | 'expired' | 'disabled';

  /**
   * When this invitation last changed.
   */
  updated_at: string;
}

export interface InvitationCreateParams {
  /**
   * Absolute expiration instant with a timezone offset; must be in the future.
   */
  expires_at: string;

  /**
   * ID of the single library this invitation targets.
   */
  library_id: string;

  /**
   * Maximum number of distinct accounts that can redeem this invitation.
   */
  max_joiners: number;

  /**
   * Role offered to admitted members.
   */
  role: 'viewer' | 'collaborator';
}

export interface InvitationListParams extends CursorPageParams {
  /**
   * Optional owner-library filter; omit to list invitations across all libraries you
   * own.
   */
  library_id?: string | null;

  /**
   * Return only invitations in this state, or all states.
   */
  state?: 'active' | 'exhausted' | 'expired' | 'disabled' | 'all';
}

export interface InvitationJoinParams {
  /**
   * Opaque secret from the invitation URL fragment.
   */
  secret: string;
}

export interface InvitationPreviewParams {
  /**
   * Opaque secret from the invitation URL fragment.
   */
  secret: string;
}

export declare namespace Invitations {
  export {
    type InvitationJoinResponse as InvitationJoinResponse,
    type InvitationLinkResponse as InvitationLinkResponse,
    type InvitationPage as InvitationPage,
    type InvitationPreviewResponse as InvitationPreviewResponse,
    type InvitationResponse as InvitationResponse,
    type InvitationResponsesCursorPage as InvitationResponsesCursorPage,
    type InvitationCreateParams as InvitationCreateParams,
    type InvitationListParams as InvitationListParams,
    type InvitationJoinParams as InvitationJoinParams,
    type InvitationPreviewParams as InvitationPreviewParams,
  };
}
