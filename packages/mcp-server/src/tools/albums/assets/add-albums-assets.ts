// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'gumnut-mcp/filtering';
import { Metadata, asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'albums.assets',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/api/albums/{album_id}/assets',
  operationId: 'add_assets_to_album_api_albums__album_id__assets_post',
};

export const tool: Tool = {
  name: 'add_albums_assets',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nAdds one or more existing assets to a specific album. Assets must be in the same library as the album. Duplicate assets are ignored.\n\n# Response Schema\n```json\n{\n  type: 'object',\n  title: 'AddAssetsToAlbumResponse',\n  properties: {\n    added_assets: {\n      type: 'array',\n      title: 'Added Assets',\n      items: {\n        type: 'string'\n      }\n    },\n    duplicate_assets: {\n      type: 'array',\n      title: 'Duplicate Assets',\n      items: {\n        type: 'string'\n      }\n    }\n  },\n  required: [    'added_assets',\n    'duplicate_assets'\n  ]\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      album_id: {
        type: 'string',
        title: 'Album Id',
      },
      asset_ids: {
        type: 'array',
        title: 'Asset Ids',
        items: {
          type: 'string',
        },
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: ['album_id', 'asset_ids'],
  },
  annotations: {},
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { album_id, jq_filter, ...body } = args as any;
  return asTextContentResult(await maybeFilter(jq_filter, await client.albums.assets.add(album_id, body)));
};

export default { metadata, tool, handler };
