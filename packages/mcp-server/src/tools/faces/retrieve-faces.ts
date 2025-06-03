// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Photos from 'gumnut-sdk';

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
  description: 'Retrieves details for a specific face.',
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
  return client.faces.retrieve(face_id);
};

export default { metadata, tool, handler };
