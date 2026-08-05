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
  url: string;
}

/**
 * Response containing JWT and user info
 */
export interface ExchangeResponse {
  access_token: string;

  /**
   * User information in token exchange response
   */
  user: ExchangeResponse.User;
}

export namespace ExchangeResponse {
  /**
   * User information in token exchange response
   */
  export interface User {
    id: string;

    clerk_user_id: string | null;

    email: string | null;

    first_name: string | null;

    is_active: boolean;

    is_verified: boolean;

    last_name: string | null;
  }
}

/**
 * Response containing OAuth provider logout endpoint
 */
export interface LogoutEndpointResponse {
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
