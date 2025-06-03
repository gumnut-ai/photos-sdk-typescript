// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'api-keys',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/api-keys/',
  operationId: 'list_api_keys_api_keys__get',
};

export const tool: Tool = {
  name: 'list_api_keys',
  description: 'Retrieves a list of all API keys for the current user',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export const handler = (client: Gumnut, args: Record<string, unknown> | undefined) => {
  return client.apiKeys.list();
};

export default { metadata, tool, handler };
