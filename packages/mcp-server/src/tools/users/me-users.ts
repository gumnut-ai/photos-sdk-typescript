// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { isJqError, maybeFilter } from 'gumnut-sdk-mcp/filtering';
import { Metadata, asErrorResult, asTextContentResult } from 'gumnut-sdk-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'users',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/api/users/me',
  operationId: 'get_current_user_api_users_me_get',
};

export const tool: Tool = {
  name: 'me_users',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nReturns information about the authenticated user making the request.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/user_response',\n  $defs: {\n    user_response: {\n      type: 'object',\n      title: 'UserResponse',\n      description: 'Represents a user account with profile information.',\n      properties: {\n        id: {\n          type: 'string',\n          title: 'Id',\n          description: 'Unique user identifier with \\'intuser_\\' prefix'\n        },\n        created_at: {\n          type: 'string',\n          title: 'Created At',\n          description: 'When this user account was created',\n          format: 'date-time'\n        },\n        is_active: {\n          type: 'boolean',\n          title: 'Is Active',\n          description: 'Whether this user account is currently active'\n        },\n        is_superuser: {\n          type: 'boolean',\n          title: 'Is Superuser',\n          description: 'Whether this user has superuser/admin privileges'\n        },\n        is_verified: {\n          type: 'boolean',\n          title: 'Is Verified',\n          description: 'Whether this user\\'s email is verified'\n        },\n        updated_at: {\n          type: 'string',\n          title: 'Updated At',\n          description: 'When this user account was last updated',\n          format: 'date-time'\n        },\n        email: {\n          type: 'string',\n          title: 'Email',\n          description: 'User\\'s email address'\n        },\n        first_name: {\n          type: 'string',\n          title: 'First Name',\n          description: 'User\\'s first name'\n        },\n        last_name: {\n          type: 'string',\n          title: 'Last Name',\n          description: 'User\\'s last name'\n        }\n      },\n      required: [        'id',\n        'created_at',\n        'is_active',\n        'is_superuser',\n        'is_verified',\n        'updated_at'\n      ]\n    }\n  }\n}\n```",
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
    return asTextContentResult(await maybeFilter(jq_filter, await client.users.me()));
  } catch (error) {
    if (isJqError(error)) {
      return asErrorResult(error.message);
    }
    throw error;
  }
};

export default { metadata, tool, handler };
