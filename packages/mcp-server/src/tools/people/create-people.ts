// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'gumnut-mcp/filtering';
import { asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'people',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/api/people',
  operationId: 'create_person_api_people_post',
};

export const tool: Tool = {
  name: 'create_people',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nCreates a new person entry.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/person_response',\n  $defs: {\n    person_response: {\n      type: 'object',\n      title: 'PersonResponse',\n      properties: {\n        id: {\n          type: 'string',\n          title: 'Id'\n        },\n        created_at: {\n          type: 'string',\n          title: 'Created At',\n          format: 'date-time'\n        },\n        is_favorite: {\n          type: 'boolean',\n          title: 'Is Favorite'\n        },\n        is_hidden: {\n          type: 'boolean',\n          title: 'Is Hidden'\n        },\n        updated_at: {\n          type: 'string',\n          title: 'Updated At',\n          format: 'date-time'\n        },\n        birth_date: {\n          type: 'string',\n          title: 'Birth Date',\n          format: 'date'\n        },\n        name: {\n          type: 'string',\n          title: 'Name'\n        },\n        thumbnail_face_id: {\n          type: 'string',\n          title: 'Thumbnail Face Id'\n        },\n        thumbnail_face_url: {\n          type: 'string',\n          title: 'Thumbnail Face Url'\n        }\n      },\n      required: [        'id',\n        'created_at',\n        'is_favorite',\n        'is_hidden',\n        'updated_at'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
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
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await maybeFilter(args, await client.people.create(body)));
};

export default { metadata, tool, handler };
