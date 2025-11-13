// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { isJqError, maybeFilter } from 'gumnut-sdk-mcp/filtering';
import { Metadata, asErrorResult, asTextContentResult } from 'gumnut-sdk-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
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
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nUpdates the details of a specific person.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/person_response',\n  $defs: {\n    person_response: {\n      type: 'object',\n      title: 'PersonResponse',\n      description: 'Represents a person identified through face clustering and recognition.',\n      properties: {\n        id: {\n          type: 'string',\n          title: 'Id',\n          description: 'Unique person identifier with \\'person_\\' prefix'\n        },\n        created_at: {\n          type: 'string',\n          title: 'Created At',\n          description: 'When this person record was created',\n          format: 'date-time'\n        },\n        is_favorite: {\n          type: 'boolean',\n          title: 'Is Favorite',\n          description: 'Whether this person is marked as a favorite'\n        },\n        is_hidden: {\n          type: 'boolean',\n          title: 'Is Hidden',\n          description: 'Whether this person should be hidden from the UI'\n        },\n        updated_at: {\n          type: 'string',\n          title: 'Updated At',\n          description: 'When this person record was last updated',\n          format: 'date-time'\n        },\n        birth_date: {\n          type: 'string',\n          title: 'Birth Date',\n          description: 'Optional birth date of this person',\n          format: 'date'\n        },\n        name: {\n          type: 'string',\n          title: 'Name',\n          description: 'Optional name assigned to this person'\n        },\n        thumbnail_face_id: {\n          type: 'string',\n          title: 'Thumbnail Face Id',\n          description: 'ID of the face resource used as this person\\'s thumbnail'\n        },\n        thumbnail_face_url: {\n          type: 'string',\n          title: 'Thumbnail Face Url',\n          description: 'URL for this person\\'s profile thumbnail image'\n        }\n      },\n      required: [        'id',\n        'created_at',\n        'is_favorite',\n        'is_hidden',\n        'updated_at'\n      ]\n    }\n  }\n}\n```",
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
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: ['person_id'],
  },
  annotations: {},
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { person_id, jq_filter, ...body } = args as any;
  try {
    return asTextContentResult(await maybeFilter(jq_filter, await client.people.update(person_id, body)));
  } catch (error) {
    if (isJqError(error)) {
      return asErrorResult(error.message);
    }
    throw error;
  }
};

export default { metadata, tool, handler };
