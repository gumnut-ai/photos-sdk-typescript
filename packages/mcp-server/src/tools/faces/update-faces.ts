// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'faces',
  operation: 'write',
  tags: [],
  httpMethod: 'patch',
  httpPath: '/api/faces/{face_id}',
  operationId: 'update_face_api_faces__face_id__patch',
};

export const tool: Tool = {
  name: 'update_faces',
  description:
    'Updates the details of a specific face, currently only supporting associating/disassociating with a person.',
  inputSchema: {
    type: 'object',
    properties: {
      face_id: {
        type: 'string',
        title: 'Face Id',
      },
      person_id: {
        type: 'string',
        title: 'Person Id',
      },
    },
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { face_id, ...body } = args as any;
  return asTextContentResult(await client.faces.update(face_id, body));
};

export default { metadata, tool, handler };
