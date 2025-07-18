// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'gumnut-mcp/filtering';
import { Metadata, asTextContentResult } from 'gumnut-mcp/tools/types';

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
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nCreates a new, empty album with a optional name and description. If no name is provided, the album will be given a default name.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/album_response',\n  $defs: {\n    album_response: {\n      type: 'object',\n      title: 'AlbumResponse',\n      description: 'Represents a collection of assets organized by the user.',\n      properties: {\n        id: {\n          type: 'string',\n          title: 'Id',\n          description: 'Unique album identifier with \\'album_\\' prefix'\n        },\n        created_at: {\n          type: 'string',\n          title: 'Created At',\n          description: 'When this album was created',\n          format: 'date-time'\n        },\n        name: {\n          type: 'string',\n          title: 'Name',\n          description: 'Display name of the album'\n        },\n        updated_at: {\n          type: 'string',\n          title: 'Updated At',\n          description: 'When this album was last updated',\n          format: 'date-time'\n        },\n        description: {\n          type: 'string',\n          title: 'Description',\n          description: 'Optional description text for the album'\n        }\n      },\n      required: [        'id',\n        'created_at',\n        'name',\n        'updated_at'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        title: 'Description',
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
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await maybeFilter(args, await client.albums.create(body)));
};

export default { metadata, tool, handler };
