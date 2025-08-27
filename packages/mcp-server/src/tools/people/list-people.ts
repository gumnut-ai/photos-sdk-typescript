// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'gumnut-sdk-mcp/filtering';
import { Metadata, asTextContentResult } from 'gumnut-sdk-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'people',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/api/people',
  operationId: 'list_people_api_people_get',
};

export const tool: Tool = {
  name: 'list_people',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nRetrieves a paginated list of people, ordered by creation time, descending.\n\n# Response Schema\n```json\n{\n  type: 'object',\n  title: 'PaginatedPeopleResponse',\n  properties: {\n    data: {\n      type: 'array',\n      title: 'Data',\n      items: {\n        $ref: '#/$defs/person_response'\n      }\n    },\n    has_more: {\n      type: 'boolean',\n      title: 'Has More'\n    }\n  },\n  required: [    'data',\n    'has_more'\n  ],\n  $defs: {\n    person_response: {\n      type: 'object',\n      title: 'PersonResponse',\n      description: 'Represents a person identified through face clustering and recognition.',\n      properties: {\n        id: {\n          type: 'string',\n          title: 'Id',\n          description: 'Unique person identifier with \\'person_\\' prefix'\n        },\n        created_at: {\n          type: 'string',\n          title: 'Created At',\n          description: 'When this person record was created',\n          format: 'date-time'\n        },\n        is_favorite: {\n          type: 'boolean',\n          title: 'Is Favorite',\n          description: 'Whether this person is marked as a favorite'\n        },\n        is_hidden: {\n          type: 'boolean',\n          title: 'Is Hidden',\n          description: 'Whether this person should be hidden from the UI'\n        },\n        updated_at: {\n          type: 'string',\n          title: 'Updated At',\n          description: 'When this person record was last updated',\n          format: 'date-time'\n        },\n        birth_date: {\n          type: 'string',\n          title: 'Birth Date',\n          description: 'Optional birth date of this person',\n          format: 'date'\n        },\n        name: {\n          type: 'string',\n          title: 'Name',\n          description: 'Optional name assigned to this person'\n        },\n        thumbnail_face_id: {\n          type: 'string',\n          title: 'Thumbnail Face Id',\n          description: 'ID of the face resource used as this person\\'s thumbnail'\n        },\n        thumbnail_face_url: {\n          type: 'string',\n          title: 'Thumbnail Face Url',\n          description: 'URL for this person\\'s profile thumbnail image'\n        }\n      },\n      required: [        'id',\n        'created_at',\n        'is_favorite',\n        'is_hidden',\n        'updated_at'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      album_id: {
        type: 'string',
        title: 'Album Id',
        description: 'Include only people associated with this album ID',
      },
      asset_id: {
        type: 'string',
        title: 'Asset Id',
        description: 'Include only people associated with this asset ID',
      },
      library_id: {
        type: 'string',
        title: 'Library Id',
        description: 'Library ID (required if user has multiple libraries)',
      },
      limit: {
        type: 'integer',
        title: 'Limit',
      },
      starting_after_id: {
        type: 'string',
        title: 'Starting After Id',
        description: 'Person ID to start listing people after',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: [],
  },
  annotations: {
    readOnlyHint: true,
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { jq_filter, ...body } = args as any;
  const response = await client.people.list(body).asResponse();
  return asTextContentResult(await maybeFilter(jq_filter, await response.json()));
};

export default { metadata, tool, handler };
