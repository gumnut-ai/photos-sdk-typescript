// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Gumnut from 'gumnut-sdk';

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

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { person_id, ...body } = args as any;
  return asTextContentResult(await client.people.retrieve(person_id));
};

export default { metadata, tool, handler };
