// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'albums',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/api/albums',
  operationId: 'create_album_api_albums_post',
};

export const tool: Tool = {
  name: 'create_albums',
  description:
    'Creates a new, empty album with a optional name and description. If no name is provided, the album will be given a default name.',
  inputSchema: {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        title: 'Description',
      },
      name: {
        type: 'string',
        title: 'Name',
      },
    },
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await client.albums.create(body));
};

export default { metadata, tool, handler };
