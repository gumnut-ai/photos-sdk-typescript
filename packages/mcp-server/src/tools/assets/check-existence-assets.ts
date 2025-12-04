// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { isJqError, maybeFilter } from 'gumnut-sdk-mcp/filtering';
import { Metadata, asErrorResult, asTextContentResult } from 'gumnut-sdk-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'assets',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/api/assets/exist',
  operationId: 'check_asset_existence_api_assets_exist_post',
};

export const tool: Tool = {
  name: 'check_existence_assets',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nChecks which assets exist in the user's library based on checksums or device identifiers. Provide exactly one of: checksums, checksum_sha1s, or (deviceId AND deviceAssetIds). List parameters are limited to 5000 items.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/asset_existence_response',\n  $defs: {\n    asset_existence_response: {\n      type: 'object',\n      title: 'AssetExistenceResponse',\n      description: 'Response for asset existence check endpoint.',\n      properties: {\n        assets: {\n          type: 'array',\n          title: 'Assets',\n          description: 'List of assets matching the query criteria',\n          items: {\n            type: 'object',\n            title: 'AssetLiteResponse',\n            description: 'Lightweight asset response for existence checks.',\n            properties: {\n              id: {\n                type: 'string',\n                title: 'Id',\n                description: 'Unique asset identifier with \\'asset_\\' prefix'\n              },\n              checksum: {\n                type: 'string',\n                title: 'Checksum',\n                description: 'Base64-encoded SHA-256 hash of the asset contents for duplicate detection and integrity'\n              },\n              device_asset_id: {\n                type: 'string',\n                title: 'Device Asset Id',\n                description: 'Original asset identifier from the device that uploaded this asset'\n              },\n              device_id: {\n                type: 'string',\n                title: 'Device Id',\n                description: 'Identifier of the device that uploaded this asset'\n              },\n              checksum_sha1: {\n                type: 'string',\n                title: 'Checksum Sha1',\n                description: 'Base64-encoded SHA-1 hash for Immich client compatibility. May be null for older assets.'\n              }\n            },\n            required: [              'id',\n              'checksum',\n              'device_asset_id',\n              'device_id'\n            ]\n          }\n        }\n      },\n      required: [        'assets'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      library_id: {
        type: 'string',
        title: 'Library Id',
        description: 'Library to check assets in (optional)',
      },
      checksum_sha1s: {
        type: 'array',
        title: 'Checksum Sha1S',
        description:
          'List of base64-encoded SHA-1 checksums to check for existence (for Immich compatibility)',
        items: {
          type: 'string',
        },
      },
      checksums: {
        type: 'array',
        title: 'Checksums',
        description: 'List of base64-encoded SHA-256 checksums to check for existence',
        items: {
          type: 'string',
        },
      },
      deviceAssetIds: {
        type: 'array',
        title: 'Deviceassetids',
        description: 'List of device asset IDs to check for existence (requires deviceId)',
        items: {
          type: 'string',
        },
      },
      deviceId: {
        type: 'string',
        title: 'Deviceid',
        description: 'Device ID to filter assets by (required with deviceAssetIds)',
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
  try {
    return asTextContentResult(await maybeFilter(jq_filter, await client.assets.checkExistence(body)));
  } catch (error) {
    if (error instanceof Gumnut.APIError || isJqError(error)) {
      return asErrorResult(error.message);
    }
    throw error;
  }
};

export default { metadata, tool, handler };
