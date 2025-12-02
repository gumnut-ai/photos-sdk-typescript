// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { isJqError, maybeFilter } from 'gumnut-sdk-mcp/filtering';
import { Metadata, asErrorResult, asTextContentResult } from 'gumnut-sdk-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'oauth',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/api/oauth/auth-url',
  operationId: 'get_auth_url_api_oauth_auth_url_get',
};

export const tool: Tool = {
  name: 'auth_url_oauth',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nGenerate OAuth authorization URL with state and nonce for CSRF and replay attack protection. State is stored with TTL for validation.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/auth_url_response',\n  $defs: {\n    auth_url_response: {\n      type: 'object',\n      title: 'AuthUrlResponse',\n      description: 'Response containing OAuth authorization URL',\n      properties: {\n        url: {\n          type: 'string',\n          title: 'Url'\n        }\n      },\n      required: [        'url'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      redirect_uri: {
        type: 'string',
        title: 'Redirect Uri',
        description:
          'The URI to redirect to after OAuth consent. Must match the registered redirect URI in OAuth client configuration.',
      },
      code_challenge: {
        type: 'string',
        title: 'Code Challenge',
        description:
          'PKCE code challenge derived from code_verifier. Required for public clients to prevent authorization code interception attacks.',
      },
      code_challenge_method: {
        type: 'string',
        title: 'Code Challenge Method',
        description:
          "PKCE code challenge method, typically 'S256' (SHA-256 hash). Must be provided if code_challenge is specified.",
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: ['redirect_uri'],
  },
  annotations: {
    readOnlyHint: true,
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { jq_filter, ...body } = args as any;
  try {
    return asTextContentResult(await maybeFilter(jq_filter, await client.oauth.authURL(body)));
  } catch (error) {
    if (error instanceof Gumnut.APIError || isJqError(error)) {
      return asErrorResult(error.message);
    }
    throw error;
  }
};

export default { metadata, tool, handler };
