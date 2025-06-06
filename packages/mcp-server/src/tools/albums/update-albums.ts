// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'albums',
  operation: 'write',
  tags: [],
  httpMethod: 'patch',
  httpPath: '/api/albums/{album_id}',
  operationId: 'update_album_api_albums__album_id__patch',
};

export const tool: Tool = {
  name: 'update_albums',
  description: 'Updates the name and/or description of a specific album.',
  inputSchema: {
    type: 'object',
    properties: {
      album_id: {
        type: 'string',
        title: 'Album Id',
      },
      description: {
        type: 'string',
        title: 'Description',
      },
      name: {
        type: 'string',
        title: 'Name',
      },
    },
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { album_id, ...body } = args as any;
  return asTextContentResult(await client.albums.update(album_id, body));
};

export default { metadata, tool, handler };
