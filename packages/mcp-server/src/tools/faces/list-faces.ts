// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'faces',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/api/faces',
  operationId: 'list_faces_api_faces_get',
};

export const tool: Tool = {
  name: 'list_faces',
  description:
    'Retrieves a paginated list of faces, optionally filtered by asset or person, ordered by creation time, descending.',
  inputSchema: {
    type: 'object',
    properties: {
      asset_id: {
        type: 'string',
        title: 'Asset Id',
        description: 'Filter by faces in a specific asset',
      },
      limit: {
        type: 'integer',
        title: 'Limit',
      },
      person_id: {
        type: 'string',
        title: 'Person Id',
        description: 'Filter by faces associated with a specific person',
      },
      starting_after_id: {
        type: 'string',
        title: 'Starting After Id',
        description: 'Face ID to start listing faces after',
      },
    },
  },
};

export const handler = (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return client.faces.list(body);
};

export default { metadata, tool, handler };
