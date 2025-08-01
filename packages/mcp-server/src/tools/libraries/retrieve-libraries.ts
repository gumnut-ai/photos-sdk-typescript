// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'gumnut-mcp/filtering';
import { Metadata, asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'libraries',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/api/libraries/{library_id}',
  operationId: 'get_library_api_libraries__library_id__get',
};

export const tool: Tool = {
  name: 'retrieve_libraries',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nReturns details of a specific library owned by the authenticated user.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/library_response',\n  $defs: {\n    library_response: {\n      type: 'object',\n      title: 'LibraryResponse',\n      description: 'Represents a user\\'s photo library.',\n      properties: {\n        id: {\n          type: 'string',\n          title: 'Id',\n          description: 'Unique library identifier with \\'lib_\\' prefix'\n        },\n        created_at: {\n          type: 'string',\n          title: 'Created At',\n          description: 'When this library was created',\n          format: 'date-time'\n        },\n        name: {\n          type: 'string',\n          title: 'Name',\n          description: 'Display name of the library'\n        },\n        updated_at: {\n          type: 'string',\n          title: 'Updated At',\n          description: 'When this library was last updated',\n          format: 'date-time'\n        },\n        user_id: {\n          type: 'string',\n          title: 'User Id',\n          description: 'ID of the user who owns this library'\n        },\n        description: {\n          type: 'string',\n          title: 'Description',\n          description: 'Optional description text for the library'\n        }\n      },\n      required: [        'id',\n        'created_at',\n        'name',\n        'updated_at',\n        'user_id'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      library_id: {
        type: 'string',
        title: 'Library Id',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: ['library_id'],
  },
  annotations: {
    readOnlyHint: true,
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { library_id, jq_filter, ...body } = args as any;
  return asTextContentResult(await maybeFilter(jq_filter, await client.libraries.retrieve(library_id)));
};

export default { metadata, tool, handler };
