// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

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
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nUploads a new asset file (image or video) along with its metadata to the specified library. If no library_id is provided and the user only has one library, uses that library.  If the user has multiple libraries, library_id is required.",
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
      library_id: {
        type: 'string',
        title: 'Library Id',
        description: 'Library to upload asset to (optional)',
      },
    },
    required: ['asset_data', 'device_asset_id', 'device_id', 'file_created_at', 'file_modified_at'],
  },
  annotations: {},
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await client.assets.create(body));
};

export default { metadata, tool, handler };
