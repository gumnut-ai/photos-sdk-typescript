// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { isJqError, maybeFilter } from 'gumnut-sdk-mcp/filtering';
import { Metadata, asErrorResult, asTextContentResult } from 'gumnut-sdk-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'api-keys',
  operation: 'write',
  tags: [],
  httpMethod: 'patch',
  httpPath: '/api-keys/{key_id}',
  operationId: 'update_api_key_api_keys__key_id__patch',
};

export const tool: Tool = {
  name: 'update_api_keys',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nUpdates the name of a specific API key\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/api_key_response',\n  $defs: {\n    api_key_response: {\n      type: 'object',\n      title: 'APIKeyResponse',\n      description: 'Represents an API key for authentication (without exposing the actual key).',\n      properties: {\n        id: {\n          type: 'string',\n          title: 'Id',\n          description: 'Unique API key identifier with \\'apikey_\\' prefix'\n        },\n        created_at: {\n          type: 'string',\n          title: 'Created At',\n          description: 'When this API key was created',\n          format: 'date-time'\n        },\n        is_active: {\n          type: 'boolean',\n          title: 'Is Active',\n          description: 'Whether this API key is currently valid and can be used'\n        },\n        last_used_at: {\n          type: 'string',\n          title: 'Last Used At',\n          description: 'When this API key was last used for authentication',\n          format: 'date-time'\n        },\n        name: {\n          type: 'string',\n          title: 'Name',\n          description: 'Optional descriptive name for this API key'\n        }\n      },\n      required: [        'id',\n        'created_at',\n        'is_active'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      key_id: {
        type: 'string',
        title: 'Key Id',
      },
      name: {
        type: 'string',
        title: 'Name',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: ['key_id', 'name'],
  },
  annotations: {},
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { key_id, jq_filter, ...body } = args as any;
  try {
    return asTextContentResult(await maybeFilter(jq_filter, await client.apiKeys.update(key_id, body)));
  } catch (error) {
    if (isJqError(error)) {
      return asErrorResult(error.message);
    }
    throw error;
  }
};

export default { metadata, tool, handler };
