// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'faces',
  operation: 'write',
  tags: [],
  httpMethod: 'delete',
  httpPath: '/api/faces/{face_id}',
  operationId: 'delete_face_api_faces__face_id__delete',
};

export const tool: Tool = {
  name: 'delete_faces',
  description: 'Deletes a specific face entry. This does not delete the associated asset or person.',
  inputSchema: {
    type: 'object',
    properties: {
      face_id: {
        type: 'string',
        title: 'Face Id',
      },
      library_id: {
        type: 'string',
        title: 'Library Id',
        description: 'Library ID (required if user has multiple libraries)',
      },
    },
    required: ['face_id'],
  },
  annotations: {
    idempotentHint: true,
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { face_id, ...body } = args as any;
  const response = await client.faces.delete(face_id, body).asResponse();
  return asTextContentResult(await response.text());
};

export default { metadata, tool, handler };
