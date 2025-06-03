// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Photos from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'people',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/api/people/{person_id}',
  operationId: 'get_person_api_people__person_id__get',
};

export const tool: Tool = {
  name: 'retrieve_people',
  description: 'Retrieves details for a specific person.',
  inputSchema: {
    type: 'object',
    properties: {
      person_id: {
        type: 'string',
        title: 'Person Id',
      },
    },
  },
};

export const handler = (client: Photos, args: Record<string, unknown> | undefined) => {
  const { person_id, ...body } = args as any;
  return client.people.retrieve(person_id);
};

export default { metadata, tool, handler };
