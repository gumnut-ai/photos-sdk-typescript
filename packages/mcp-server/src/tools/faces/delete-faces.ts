// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Photos from 'gumnut-sdk';

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
    },
  },
};

export const handler = (client: Photos, args: Record<string, unknown> | undefined) => {
  const { face_id, ...body } = args as any;
  return client.faces.delete(face_id);
};

export default { metadata, tool, handler };
