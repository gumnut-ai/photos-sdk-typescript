// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'libraries',
  operation: 'write',
  tags: [],
  httpMethod: 'delete',
  httpPath: '/api/libraries/{library_id}',
  operationId: 'delete_library_api_libraries__library_id__delete',
};

export const tool: Tool = {
  name: 'delete_libraries',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nDeletes a library and all its associated data (assets, albums, people, faces). Cannot delete the user's only library.\n\n# Response Schema\n```json\n{\n  type: 'object',\n  properties: {}\n}\n```",
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
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { library_id, ...body } = args as any;
  const response = await client.libraries.delete(library_id).asResponse();
  return asTextContentResult(await response.text());
};

export default { metadata, tool, handler };
