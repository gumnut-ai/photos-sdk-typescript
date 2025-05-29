// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Photos from 'photos';

export const metadata: Metadata = {
  resource: 'assets',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/api/assets',
  operationId: 'create_asset_api_assets_post',
};

export const tool: Tool = {
  name: 'create_assets',
  description:
    "Uploads a new asset file (image or video) along with its metadata. If an asset with the same checksum already exists, returns the existing asset's metadata.",
  inputSchema: {
    type: 'object',
    properties: {
      asset_data: {
        type: 'string',
        title: 'Asset Data',
      },
      device_asset_id: {
        type: 'string',
        title: 'Device Asset Id',
      },
      device_id: {
        type: 'string',
        title: 'Device Id',
      },
      file_created_at: {
        type: 'string',
        title: 'File Created At',
        format: 'date-time',
      },
      file_modified_at: {
        type: 'string',
        title: 'File Modified At',
        format: 'date-time',
      },
    },
  },
};

export const handler = (client: Photos, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return client.assets.create(body);
};

export default { metadata, tool, handler };
