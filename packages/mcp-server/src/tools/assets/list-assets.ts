// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, asTextContentResult } from 'gumnut-sdk-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'assets',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/api/assets',
  operationId: 'list_assets_api_assets_get',
};

export const tool: Tool = {
  name: 'list_assets',
  description:
    'Retrieves a paginated list of assets from the specified library, optionally filtered by album or person. Asset data includes metrics, EXIF data, faces, and people. Assets are ordered by local creation time, descending.',
  inputSchema: {
    type: 'object',
    properties: {
      album_id: {
        type: 'string',
        title: 'Album Id',
        description: 'Filter by assets in a specific album',
      },
      library_id: {
        type: 'string',
        title: 'Library Id',
        description: 'Library to list assets from (optional)',
      },
      limit: {
        type: 'integer',
        title: 'Limit',
      },
      person_id: {
        type: 'string',
        title: 'Person Id',
        description: 'Filter by assets associated with a specific person ID',
      },
      starting_after_id: {
        type: 'string',
        title: 'Starting After Id',
        description: 'Asset ID to start listing assets after',
      },
    },
    required: [],
  },
  annotations: {
    readOnlyHint: true,
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  const response = await client.assets.list(body).asResponse();
  return asTextContentResult(await response.json());
};

export default { metadata, tool, handler };
