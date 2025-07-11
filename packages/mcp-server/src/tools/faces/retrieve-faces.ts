// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'gumnut-mcp/filtering';
import { asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'faces',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/api/faces/{face_id}',
  operationId: 'get_face_api_faces__face_id__get',
};

export const tool: Tool = {
  name: 'retrieve_faces',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nRetrieves details for a specific face.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/face_response',\n  $defs: {\n    face_response: {\n      type: 'object',\n      title: 'FaceResponse',\n      properties: {\n        id: {\n          type: 'string',\n          title: 'Id'\n        },\n        asset_id: {\n          type: 'string',\n          title: 'Asset Id'\n        },\n        bounding_box: {\n          type: 'object',\n          title: 'Bounding Box'\n        },\n        created_at: {\n          type: 'string',\n          title: 'Created At',\n          format: 'date-time'\n        },\n        updated_at: {\n          type: 'string',\n          title: 'Updated At',\n          format: 'date-time'\n        },\n        person_id: {\n          type: 'string',\n          title: 'Person Id'\n        },\n        thumbnail_url: {\n          type: 'string',\n          title: 'Thumbnail Url'\n        },\n        timestamp_ms: {\n          type: 'integer',\n          title: 'Timestamp Ms'\n        }\n      },\n      required: [        'id',\n        'asset_id',\n        'bounding_box',\n        'created_at',\n        'updated_at'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      face_id: {
        type: 'string',
        title: 'Face Id',
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
  const { face_id, ...body } = args as any;
  return asTextContentResult(await maybeFilter(args, await client.faces.retrieve(face_id)));
};

export default { metadata, tool, handler };
