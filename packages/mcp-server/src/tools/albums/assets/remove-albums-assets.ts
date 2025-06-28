// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../../';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'albums.assets',
  operation: 'write',
  tags: [],
  httpMethod: 'delete',
  httpPath: '/api/albums/{album_id}/assets',
  operationId: 'remove_assets_from_album_api_albums__album_id__assets_delete',
};

export const tool: Tool = {
  name: 'remove_albums_assets',
  description:
    'Removes one or more assets from a specific album. Note: This does not delete the assets themselves.',
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

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { album_id, ...body } = args as any;
  const response = await client.albums.assets.remove(album_id, body).asResponse();
  return asTextContentResult(await response.text());
};

export default { metadata, tool, handler };
