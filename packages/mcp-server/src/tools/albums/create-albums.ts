// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'gumnut-sdk-mcp/filtering';
import { Metadata, asTextContentResult } from 'gumnut-sdk-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'albums',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/api/albums',
  operationId: 'create_album_api_albums_post',
};

export const tool: Tool = {
  name: 'create_albums',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nCreates a new, empty album with optional name and description in the specified library.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/album_response',\n  $defs: {\n    album_response: {\n      type: 'object',\n      title: 'AlbumResponse',\n      description: 'Represents a collection of assets organized by the user.',\n      properties: {\n        id: {\n          type: 'string',\n          title: 'Id',\n          description: 'Unique album identifier with \\'album_\\' prefix'\n        },\n        asset_count: {\n          type: 'integer',\n          title: 'Asset Count',\n          description: 'Total number of assets in this album'\n        },\n        created_at: {\n          type: 'string',\n          title: 'Created At',\n          description: 'When this album was created',\n          format: 'date-time'\n        },\n        name: {\n          type: 'string',\n          title: 'Name',\n          description: 'Display name of the album'\n        },\n        updated_at: {\n          type: 'string',\n          title: 'Updated At',\n          description: 'When this album was last updated',\n          format: 'date-time'\n        },\n        album_cover_asset_id: {\n          type: 'string',\n          title: 'Album Cover Asset Id',\n          description: 'ID of the asset used as the album cover'\n        },\n        description: {\n          type: 'string',\n          title: 'Description',\n          description: 'Optional description text for the album'\n        }\n      },\n      required: [        'id',\n        'asset_count',\n        'created_at',\n        'name',\n        'updated_at'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        title: 'Description',
      },
      library_id: {
        type: 'string',
        title: 'Library Id',
      },
      name: {
        type: 'string',
        title: 'Name',
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
  annotations: {},
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { jq_filter, ...body } = args as any;
  return asTextContentResult(await maybeFilter(jq_filter, await client.albums.create(body)));
};

export default { metadata, tool, handler };
