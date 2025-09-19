// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, asTextContentResult } from 'gumnut-sdk-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'search',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/api/search',
  operationId: 'search_assets_post_api_search_post',
};

export const tool: Tool = {
  name: 'search_assets_search',
  description:
    'Searches for assets using semantic similarity and/or metadata filters. Results include asset metadata, faces, and people. At least one search criterion must be provided. Can search by text query, uploaded image, or both combined.',
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
      image: {
        type: 'string',
        title: 'Image',
        description: 'Image file to search for similar assets. Can be combined with text query.',
      },
      library_id: {
        type: 'string',
        title: 'Library Id',
        description: 'Library to search assets from (optional)',
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
          "Filter to only include assets containing ALL of these person IDs. Can be comma-delimited string (e.g. 'person_123,person_abc') or multiple query parameters.",
        items: {
          type: 'string',
        },
      },
      query: {
        type: 'string',
        title: 'Query',
        description:
          'The text query to search for. If you want to search for a specific person or set of people, use the person_ids parameter instead.If you want to search for a photos taken during a specific date range, use the captured_before and captured_after parameters instead.',
      },
      threshold: {
        type: 'number',
        title: 'Threshold',
        description: 'Similarity threshold (lower means more similar)',
      },
    },
    required: [],
  },
  annotations: {},
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await client.search.searchAssets(body));
};

export default { metadata, tool, handler };
