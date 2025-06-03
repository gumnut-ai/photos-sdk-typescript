// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Photos from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'albums',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/api/albums',
  operationId: 'list_albums_api_albums_get',
};

export const tool: Tool = {
  name: 'list_albums',
  description: 'Retrieves a paginated list of albums, ordered by creation time, descending.',
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'integer',
        title: 'Limit',
      },
      starting_after_id: {
        type: 'string',
        title: 'Starting After Id',
        description: 'Album ID to start listing albums after',
      },
    },
  },
};

export const handler = (client: Photos, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return client.albums.list(body);
};

export default { metadata, tool, handler };
