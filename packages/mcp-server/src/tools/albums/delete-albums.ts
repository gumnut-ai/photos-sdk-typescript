// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, asTextContentResult } from 'gumnut-sdk-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'albums',
  operation: 'write',
  tags: [],
  httpMethod: 'delete',
  httpPath: '/api/albums/{album_id}',
  operationId: 'delete_album_api_albums__album_id__delete',
};

export const tool: Tool = {
  name: 'delete_albums',
  description: 'Deletes a specific album. Note: This does not delete the assets within the album.',
  inputSchema: {
    type: 'object',
    properties: {
      album_id: {
        type: 'string',
        title: 'Album Id',
      },
    },
    required: ['album_id'],
  },
  annotations: {
    idempotentHint: true,
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { album_id, ...body } = args as any;
  const response = await client.albums.delete(album_id).asResponse();
  return asTextContentResult(await response.text());
};

export default { metadata, tool, handler };
