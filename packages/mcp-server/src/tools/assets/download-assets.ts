// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asBinaryContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'assets',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/api/assets/{asset_id}/download',
  operationId: 'download_asset_file_api_assets__asset_id__download_get',
};

export const tool: Tool = {
  name: 'download_assets',
  description: 'Downloads the original file for a specific asset.',
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

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { asset_id, ...body } = args as any;
  return asBinaryContentResult(await client.assets.download(asset_id));
};

export default { metadata, tool, handler };
