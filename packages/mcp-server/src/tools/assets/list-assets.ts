// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
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
    'Retrieves a paginated list of assets, optionally filtered by album. Assets are ordered by local creation time, descending.',
  inputSchema: {
    type: 'object',
    properties: {
      album_id: {
        type: 'string',
        title: 'Album Id',
        description: 'Filter by assets in a specific album',
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
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await client.assets.list(body));
};

export default { metadata, tool, handler };
