// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, asBinaryContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'assets',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/api/assets/{asset_id}/thumbnail',
  operationId: 'download_asset_thumbnail_api_assets__asset_id__thumbnail_get',
};

export const tool: Tool = {
  name: 'download_thumbnail_assets',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nDownloads a thumbnail for a specific asset. The exact thumbnail returned depends on availability and the optional `size` parameter.\n\n# Response Schema\n```json\n{\n  type: 'string'\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      asset_id: {
        type: 'string',
        title: 'Asset Id',
      },
      size: {
        type: 'string',
        title: 'Size',
        description: 'Desired thumbnail size (e.g., thumbnail, preview)',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
  },
};

export const handler = async (client: Gumnut, args: Record<string, unknown> | undefined) => {
  const { asset_id, ...body } = args as any;
  return asBinaryContentResult(await client.assets.downloadThumbnail(asset_id, body));
};

export default { metadata, tool, handler };
