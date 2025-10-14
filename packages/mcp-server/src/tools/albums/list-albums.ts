// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'gumnut-sdk-mcp/filtering';
import { Metadata, asTextContentResult } from 'gumnut-sdk-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'albums',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/api/albums',
  operationId: 'list_albums_api_albums_get',
};

export const tool: Tool = {
  name: 'list_albums',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nRetrieves a paginated list of albums from the specified library, ordered by creation time, descending. Can be filtered by asset_id.\n\n# Response Schema\n```json\n{\n  type: 'object',\n  title: 'PaginatedAlbumsResponse',\n  properties: {\n    data: {\n      type: 'array',\n      title: 'Data',\n      items: {\n        $ref: '#/$defs/album_response'\n      }\n    },\n    has_more: {\n      type: 'boolean',\n      title: 'Has More'\n    }\n  },\n  required: [    'data',\n    'has_more'\n  ],\n  $defs: {\n    album_response: {\n      type: 'object',\n      title: 'AlbumResponse',\n      description: 'Represents a collection of assets organized by the user.',\n      properties: {\n        id: {\n          type: 'string',\n          title: 'Id',\n          description: 'Unique album identifier with \\'album_\\' prefix'\n        },\n        asset_count: {\n          type: 'integer',\n          title: 'Asset Count',\n          description: 'Total number of assets in this album'\n        },\n        created_at: {\n          type: 'string',\n          title: 'Created At',\n          description: 'When this album was created',\n          format: 'date-time'\n        },\n        name: {\n          type: 'string',\n          title: 'Name',\n          description: 'Display name of the album'\n        },\n        updated_at: {\n          type: 'string',\n          title: 'Updated At',\n          description: 'When this album was last updated',\n          format: 'date-time'\n        },\n        description: {\n          type: 'string',\n          title: 'Description',\n          description: 'Optional description text for the album'\n        }\n      },\n      required: [        'id',\n        'asset_count',\n        'created_at',\n        'name',\n        'updated_at'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      asset_id: {
        type: 'string',
        title: 'Asset Id',
        description: 'Filter albums containing this asset ID (optional)',
      },
      library_id: {
        type: 'string',
        title: 'Library Id',
        description: 'Library to list albums from (optional)',
      },
      limit: {
        type: 'integer',
        title: 'Limit',
        description: 'Max number of albums to return',
      },
      starting_after_id: {
        type: 'string',
        title: 'Starting After Id',
        description: 'Album ID to start listing albums after',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: [],
  },
  annotations: {
    readOnlyHint: true,
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { jq_filter, ...body } = args as any;
  const response = await client.albums.list(body).asResponse();
  return asTextContentResult(await maybeFilter(jq_filter, await response.json()));
};

export default { metadata, tool, handler };
