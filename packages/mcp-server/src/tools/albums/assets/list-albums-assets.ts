// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../../';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'albums.assets',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/api/albums/{album_id}/assets',
  operationId: 'list_album_assets_api_albums__album_id__assets_get',
};

export const tool: Tool = {
  name: 'list_albums_assets',
  description: 'Retrieves a list of all assets contained within a specific album.',
  inputSchema: {
    type: 'object',
    properties: {
      album_id: {
        type: 'string',
        title: 'Album Id',
      },
    },
  },
};

export const handler = (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { album_id, ...body } = args as any;
  return client.albums.assets.list(album_id);
};

export default { metadata, tool, handler };
