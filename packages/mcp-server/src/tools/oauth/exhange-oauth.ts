// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'gumnut-sdk-mcp/filtering';
import { Metadata, asTextContentResult } from 'gumnut-sdk-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'oauth',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/api/oauth/exchange',
  operationId: 'exchange_token_api_oauth_exchange_post',
};

export const tool: Tool = {
  name: 'exhange_oauth',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nExchange OAuth authorization code for application JWT after validating state, nonce, and ID token signature. User is retrieved from or created in the database and details added to the JWT.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/exhchange_response',\n  $defs: {\n    exhchange_response: {\n      type: 'object',\n      title: 'TokenExchangeResponse',\n      description: 'Response containing JWT and user info',\n      properties: {\n        access_token: {\n          type: 'string',\n          title: 'Access Token'\n        },\n        user: {\n          type: 'object',\n          title: 'UserInfo',\n          description: 'User information in token exchange response',\n          properties: {\n            id: {\n              type: 'string',\n              title: 'Id'\n            },\n            clerk_user_id: {\n              type: 'string',\n              title: 'Clerk User Id'\n            },\n            email: {\n              type: 'string',\n              title: 'Email'\n            },\n            first_name: {\n              type: 'string',\n              title: 'First Name'\n            },\n            is_active: {\n              type: 'boolean',\n              title: 'Is Active'\n            },\n            is_verified: {\n              type: 'boolean',\n              title: 'Is Verified'\n            },\n            last_name: {\n              type: 'string',\n              title: 'Last Name'\n            }\n          },\n          required: [            'id',\n            'clerk_user_id',\n            'email',\n            'first_name',\n            'is_active',\n            'is_verified',\n            'last_name'\n          ]\n        }\n      },\n      required: [        'access_token',\n        'user'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        title: 'Code',
        description: 'Authorization code returned by the OAuth provider after user consent',
      },
      code_verifier: {
        type: 'string',
        title: 'Code Verifier',
        description:
          'PKCE code verifier that corresponds to the code_challenge sent in the authorization request',
      },
      error: {
        type: 'string',
        title: 'Error',
        description: 'Error code if OAuth provider returned an error instead of authorization code',
      },
      state: {
        type: 'string',
        title: 'State',
        description: 'State token from the initial auth request, used for CSRF protection',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: [],
  },
  annotations: {},
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { jq_filter, ...body } = args as any;
  return asTextContentResult(await maybeFilter(jq_filter, await client.oauth.exhange(body)));
};

export default { metadata, tool, handler };
