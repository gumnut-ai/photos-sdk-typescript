// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'assets',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/api/assets/{asset_id}',
  operationId: 'get_asset_metadata_api_assets__asset_id__get',
};

export const tool: Tool = {
  name: 'retrieve_assets',
  description:
    'Retrieves detailed metadata for a specific asset, including EXIF information and asset metrics.',
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

export const handler = (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { asset_id, ...body } = args as any;
  return client.assets.retrieve(asset_id);
};

export default { metadata, tool, handler };
