// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Photos from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'people',
  operation: 'write',
  tags: [],
  httpMethod: 'delete',
  httpPath: '/api/people/{person_id}',
  operationId: 'delete_person_api_people__person_id__delete',
};

export const tool: Tool = {
  name: 'delete_people',
  description: 'Deletes a specific person. Associated faces will have their person_id set to NULL.',
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
  return client.people.delete(person_id);
};

export default { metadata, tool, handler };
