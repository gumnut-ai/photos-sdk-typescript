// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../../';
import Photos from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'albums.assets',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/api/albums/{album_id}/assets',
  operationId: 'add_assets_to_album_api_albums__album_id__assets_post',
};

export const tool: Tool = {
  name: 'add_albums_assets',
  description: 'Adds one or more existing assets to a specific album.',
  inputSchema: {
    type: 'object',
    properties: {
      album_id: {
        type: 'string',
        title: 'Album Id',
      },
      asset_ids: {
        type: 'array',
        title: 'Asset Ids',
        items: {
          type: 'string',
        },
      },
    },
  },
};

export const handler = (client: Photos, args: Record<string, unknown> | undefined) => {
  const { album_id, ...body } = args as any;
  return client.albums.assets.add(album_id, body);
};

export default { metadata, tool, handler };
