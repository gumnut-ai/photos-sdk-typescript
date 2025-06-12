// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'people',
  operation: 'write',
  tags: [],
  httpMethod: 'patch',
  httpPath: '/api/people/{person_id}',
  operationId: 'update_person_api_people__person_id__patch',
};

export const tool: Tool = {
  name: 'update_people',
  description: 'Updates the details of a specific person.',
  inputSchema: {
    type: 'object',
    properties: {
      person_id: {
        type: 'string',
        title: 'Person Id',
      },
      birth_date: {
        type: 'string',
        title: 'Birth Date',
        format: 'date',
      },
      is_favorite: {
        type: 'boolean',
        title: 'Is Favorite',
      },
      is_hidden: {
        type: 'boolean',
        title: 'Is Hidden',
      },
      name: {
        type: 'string',
        title: 'Name',
      },
      thumbnail_face_id: {
        type: 'string',
        title: 'Thumbnail Face Id',
      },
    },
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { person_id, ...body } = args as any;
  return asTextContentResult(await client.people.update(person_id, body));
};

export default { metadata, tool, handler };
