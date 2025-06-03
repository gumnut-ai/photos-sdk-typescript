// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'faces',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/api/faces/{face_id}/thumbnail',
  operationId: 'get_face_thumbnail_api_faces__face_id__thumbnail_get',
};

export const tool: Tool = {
  name: 'download_thumbnail_faces',
  description: 'Retrieves a thumbnail for a specific face.',
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

export const handler = (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { face_id, ...body } = args as any;
  return client.faces.downloadThumbnail(face_id);
};

export default { metadata, tool, handler };
