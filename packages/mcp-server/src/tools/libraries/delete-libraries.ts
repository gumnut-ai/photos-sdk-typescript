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
    "Deletes a library and all its associated data (assets, albums, people, faces). Cannot delete the user's only library.",
  inputSchema: {
    type: 'object',
    properties: {
      library_id: {
        type: 'string',
        title: 'Library Id',
      },
    },
    required: ['library_id'],
  },
  annotations: {
    idempotentHint: true,
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { library_id, ...body } = args as any;
  const response = await client.libraries.delete(library_id).asResponse();
  return asTextContentResult(await response.text());
};

export default { metadata, tool, handler };
