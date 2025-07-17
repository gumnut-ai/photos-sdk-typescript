// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'gumnut-mcp/filtering';
import { Metadata, asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'api-keys',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/api-keys/',
  operationId: 'create_api_key_api_keys__post',
};

export const tool: Tool = {
  name: 'create_api_keys',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nCreates a new API key for the current user\n\n# Response Schema\n```json\n{\n  type: 'object',\n  title: 'APIKeyCreateResponse',\n  description: 'Response when creating a new API key - includes the actual key value.\\n\\nThis is the only time the raw API key is exposed. After creation,\\nonly the hashed version is stored and the raw key cannot be retrieved.',\n  properties: {\n    id: {\n      type: 'string',\n      title: 'Id',\n      description: 'Unique API key identifier with \\'apikey_\\' prefix'\n    },\n    api_key: {\n      type: 'string',\n      title: 'Api Key',\n      description: 'The actual API key value - store this securely as it cannot be retrieved later'\n    },\n    created_at: {\n      type: 'string',\n      title: 'Created At',\n      description: 'When this API key was created',\n      format: 'date-time'\n    },\n    is_active: {\n      type: 'boolean',\n      title: 'Is Active',\n      description: 'Whether this API key is currently valid and can be used'\n    },\n    last_used_at: {\n      type: 'string',\n      title: 'Last Used At',\n      description: 'When this API key was last used for authentication',\n      format: 'date-time'\n    },\n    name: {\n      type: 'string',\n      title: 'Name',\n      description: 'Optional descriptive name for this API key'\n    }\n  },\n  required: [    'id',\n    'api_key',\n    'created_at',\n    'is_active'\n  ]\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
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
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await maybeFilter(args, await client.apiKeys.create(body)));
};

export default { metadata, tool, handler };
