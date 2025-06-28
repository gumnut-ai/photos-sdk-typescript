// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'api-keys',
  operation: 'write',
  tags: [],
  httpMethod: 'delete',
  httpPath: '/api-keys/{key_id}',
  operationId: 'delete_api_key_api_keys__key_id__delete',
};

export const tool: Tool = {
  name: 'delete_api_keys',
  description: 'Deletes a specific API key',
  inputSchema: {
    type: 'object',
    properties: {
      key_id: {
        type: 'string',
        title: 'Key Id',
      },
    },
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { key_id, ...body } = args as any;
  const response = await client.apiKeys.delete(key_id).asResponse();
  return asTextContentResult(await response.text());
};

export default { metadata, tool, handler };
