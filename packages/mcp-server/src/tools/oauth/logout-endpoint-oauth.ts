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
  httpPath: '/api/oauth/logout-endpoint',
  operationId: 'get_logout_endpoint_api_oauth_logout_endpoint_get',
};

export const tool: Tool = {
  name: 'logout_endpoint_oauth',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nReturns the OAuth provider's logout endpoint URL from OIDC discovery. This can be used to redirect users to logout from the OAuth provider after logging out locally.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/logout_endpoint_response',\n  $defs: {\n    logout_endpoint_response: {\n      type: 'object',\n      title: 'LogoutEndpointResponse',\n      description: 'Response containing OAuth provider logout endpoint',\n      properties: {\n        logout_endpoint: {\n          type: 'string',\n          title: 'Logout Endpoint'\n        }\n      },\n      required: [        'logout_endpoint'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: [],
  },
  annotations: {
    readOnlyHint: true,
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { jq_filter } = args as any;
  try {
    return asTextContentResult(await maybeFilter(jq_filter, await client.oauth.logoutEndpoint()));
  } catch (error) {
    if (isJqError(error)) {
      return asErrorResult(error.message);
    }
    throw error;
  }
};

export default { metadata, tool, handler };
