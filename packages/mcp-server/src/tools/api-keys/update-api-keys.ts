// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'api-keys',
  operation: 'write',
  tags: [],
  httpMethod: 'patch',
  httpPath: '/api-keys/{key_id}',
  operationId: 'update_api_key_api_keys__key_id__patch',
};

export const tool: Tool = {
  name: 'update_api_keys',
  description: 'Updates the name of a specific API key',
  inputSchema: {
    type: 'object',
    properties: {
      key_id: {
        type: 'string',
        title: 'Key Id',
      },
      name: {
        type: 'string',
        title: 'Name',
      },
    },
  },
};

export const handler = (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { key_id, ...body } = args as any;
  return client.apiKeys.update(key_id, body);
};

export default { metadata, tool, handler };
