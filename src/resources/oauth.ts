// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * OAuth flow endpoints for obtaining and refreshing access tokens.
 */
export class OAuth extends APIResource {
  /**
   * Generate OAuth authorization URL with state and nonce for CSRF and replay attack
   * protection. State is stored with TTL for validation.
   */
  authURL(query: OAuthAuthURLParams, options?: RequestOptions): APIPromise<AuthURLResponse> {
    return this._client.get('/api/oauth/auth-url', { query, ...options });
  }

  /**
   * Exchange OAuth authorization code for application JWT after validating state,
   * nonce, and ID token signature. User is retrieved from or created in the database
   * and details added to the JWT.
   */
  exchange(body: OAuthExchangeParams, options?: RequestOptions): APIPromise<ExchangeResponse> {
    return this._client.post('/api/oauth/exchange', { body, ...options });
  }

  /**
   * Returns the OAuth provider's logout endpoint URL from OIDC discovery. This can
   * be used to redirect users to logout from the OAuth provider after logging out
   * locally.
   */
  logoutEndpoint(options?: RequestOptions): APIPromise<LogoutEndpointResponse> {
    return this._client.get('/api/oauth/logout-endpoint', options);
  }
}

/**
 * Response containing OAuth authorization URL
 */
export interface AuthURLResponse {
  /**
   * OAuth provider authorization URL to redirect the user to for consent
   */
  url: string;
}

/**
 * Response containing JWT and user info
 */
export interface ExchangeResponse {
  /**
   * JWT to send as a Bearer token in the `Authorization` header on subsequent
   * requests
   */
  access_token: string;

  /**
   * The authenticated user
   */
  user: ExchangeResponse.User;
}

export namespace ExchangeResponse {
  /**
   * The authenticated user
   */
  export interface User {
    /**
     * Unique Gumnut user identifier with `intuser_` prefix
     */
    id: string;

    /**
     * Identifier of the linked identity-provider account
     */
    clerk_user_id: string | null;

    /**
     * Email address reported by the OAuth provider; null if not shared
     */
    email: string | null;

    /**
     * Given name reported by the OAuth provider; null if not shared
     */
    first_name: string | null;

    /**
     * Whether the account is active. A token exchange can still succeed for an
     * inactive account, but subsequent authenticated API requests are rejected with
     * 401
     */
    is_active: boolean;

    /**
     * Whether the account is marked verified. An internal account flag, not proof of
     * email verification — it can be true even when `email` is null
     */
    is_verified: boolean;

    /**
     * Family name reported by the OAuth provider; null if not shared
     */
    last_name: string | null;
  }
}

/**
 * Response containing OAuth provider logout endpoint
 */
export interface LogoutEndpointResponse {
  /**
   * OAuth provider logout URL to redirect the user to after ending the local session
   */
  logout_endpoint: string;
}

export interface OAuthAuthURLParams {
  /**
   * The URI to redirect to after OAuth consent. Must match the registered redirect
   * URI in OAuth client configuration.
   */
  redirect_uri: string;

  /**
   * PKCE code challenge derived from code_verifier. Required for public clients to
   * prevent authorization code interception attacks.
   */
  code_challenge?: string | null;

  /**
   * PKCE code challenge method, typically 'S256' (SHA-256 hash). Must be provided if
   * code_challenge is specified.
   */
  code_challenge_method?: string | null;
}

export interface OAuthExchangeParams {
  /**
   * Authorization code returned by the OAuth provider after user consent
   */
  code?: string | null;

  /**
   * PKCE code verifier that corresponds to the code_challenge sent in the
   * authorization request
   */
  code_verifier?: string | null;

  /**
   * Error code if OAuth provider returned an error instead of authorization code
   */
  error?: string | null;

  /**
   * State token from the initial auth request, used for CSRF protection
   */
  state?: string | null;
}

export declare namespace OAuth {
  export {
    type AuthURLResponse as AuthURLResponse,
    type ExchangeResponse as ExchangeResponse,
    type LogoutEndpointResponse as LogoutEndpointResponse,
    type OAuthAuthURLParams as OAuthAuthURLParams,
    type OAuthExchangeParams as OAuthExchangeParams,
  };
}
