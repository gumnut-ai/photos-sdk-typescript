// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'gumnut-mcp/filtering';
import { Metadata, asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
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
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nRetrieves a paginated list of faces, optionally filtered by asset or person, ordered by creation time, descending.\n\n# Response Schema\n```json\n{\n  type: 'object',\n  title: 'PaginatedFacesResponse',\n  properties: {\n    data: {\n      type: 'array',\n      title: 'Data',\n      items: {\n        $ref: '#/$defs/face_response'\n      }\n    },\n    has_more: {\n      type: 'boolean',\n      title: 'Has More'\n    }\n  },\n  required: [    'data',\n    'has_more'\n  ],\n  $defs: {\n    face_response: {\n      type: 'object',\n      title: 'FaceResponse',\n      description: 'Represents a detected face in an asset with facial recognition data.',\n      properties: {\n        id: {\n          type: 'string',\n          title: 'Id',\n          description: 'Unique face identifier with \\'face_\\' prefix'\n        },\n        asset_id: {\n          type: 'string',\n          title: 'Asset Id',\n          description: 'ID of the asset containing this face'\n        },\n        bounding_box: {\n          type: 'object',\n          title: 'Bounding Box',\n          description: 'Face location as {x, y, w, h} coordinates in pixels',\n          additionalProperties: true\n        },\n        created_at: {\n          type: 'string',\n          title: 'Created At',\n          description: 'When this face was detected and recorded',\n          format: 'date-time'\n        },\n        updated_at: {\n          type: 'string',\n          title: 'Updated At',\n          description: 'When this face record was last updated',\n          format: 'date-time'\n        },\n        person_id: {\n          type: 'string',\n          title: 'Person Id',\n          description: 'ID of the person this face belongs to (if identified)'\n        },\n        thumbnail_url: {\n          type: 'string',\n          title: 'Thumbnail Url',\n          description: 'URL to get a cropped thumbnail of just this face'\n        },\n        timestamp_ms: {\n          type: 'integer',\n          title: 'Timestamp Ms',\n          description: 'For video files, timestamp in milliseconds when face appears'\n        }\n      },\n      required: [        'id',\n        'asset_id',\n        'bounding_box',\n        'created_at',\n        'updated_at'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      asset_id: {
        type: 'string',
        title: 'Asset Id',
        description: 'Filter by faces in a specific asset',
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
  const response = await client.faces.list(body).asResponse();
  return asTextContentResult(await maybeFilter(jq_filter, await response.json()));
};

export default { metadata, tool, handler };
