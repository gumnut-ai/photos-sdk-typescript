// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, asTextContentResult } from 'gumnut-sdk-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
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
    'Retrieves detailed metadata for a specific asset, including EXIF information, asset metrics, faces, and people.',
  inputSchema: {
    type: 'object',
    properties: {
      asset_id: {
        type: 'string',
        title: 'Asset Id',
      },
    },
    required: ['asset_id'],
  },
  annotations: {
    readOnlyHint: true,
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { asset_id, ...body } = args as any;
  return asTextContentResult(await client.assets.retrieve(asset_id));
};

export default { metadata, tool, handler };
