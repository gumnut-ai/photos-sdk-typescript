// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'search',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/api/search',
  operationId: 'search_assets_api_search_get',
};

export const tool: Tool = {
  name: 'search_search',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nSearches for assets using semantic similarity and/or metadata filters. At least one search criterion must be provided.",
  inputSchema: {
    type: 'object',
    properties: {
      captured_after: {
        type: 'string',
        title: 'Captured After',
        description: 'Filter to only include assets captured after this date (ISO format).',
        format: 'date-time',
      },
      captured_before: {
        type: 'string',
        title: 'Captured Before',
        description: 'Filter to only include assets captured before this date (ISO format).',
        format: 'date-time',
      },
      limit: {
        type: 'integer',
        title: 'Limit',
        description: 'Number of results per page',
      },
      page: {
        type: 'integer',
        title: 'Page',
        description: 'Page number',
      },
      person_ids: {
        type: 'array',
        title: 'Person Ids',
        description:
          "Filter to only include assets containing ALL of these person IDs. Can be comma-delimited string (e.g., 'person_123,person_abc') or multiple query parameters.",
        items: {
          type: 'string',
        },
      },
      query: {
        type: 'string',
        title: 'Query',
        description: 'The text query to search for',
      },
      threshold: {
        type: 'number',
        title: 'Threshold',
        description: 'Similarity threshold (lower means more similar)',
      },
    },
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await client.search.search(body));
};

export default { metadata, tool, handler };
