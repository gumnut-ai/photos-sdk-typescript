// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

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
  description:
    'Deletes a specific person. Associated faces will have their person_id set to the closest matching person, or null if no one matches.',
  inputSchema: {
    type: 'object',
    properties: {
      person_id: {
        type: 'string',
        title: 'Person Id',
      },
    },
    required: ['person_id'],
  },
  annotations: {
    idempotentHint: true,
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { person_id, ...body } = args as any;
  const response = await client.people.delete(person_id).asResponse();
  return asTextContentResult(await response.text());
};

export default { metadata, tool, handler };
