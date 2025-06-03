// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Photos from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'assets',
  operation: 'write',
  tags: [],
  httpMethod: 'delete',
  httpPath: '/api/assets/{asset_id}',
  operationId: 'delete_asset_api_assets__asset_id__delete',
};

export const tool: Tool = {
  name: 'delete_assets',
  description: 'Deletes a specific asset and its associated data (including the file from storage).',
  inputSchema: {
    type: 'object',
    properties: {
      asset_id: {
        type: 'string',
        title: 'Asset Id',
      },
    },
  },
};

export const handler = (client: Photos, args: Record<string, unknown> | undefined) => {
  const { asset_id, ...body } = args as any;
  return client.assets.delete(asset_id);
};

export default { metadata, tool, handler };
