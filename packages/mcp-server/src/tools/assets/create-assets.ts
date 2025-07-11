// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'gumnut-mcp/filtering';
import { asTextContentResult } from 'gumnut-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Gumnut from 'gumnut-sdk';

export const metadata: Metadata = {
  resource: 'assets',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/api/assets',
  operationId: 'create_asset_api_assets_post',
};

export const tool: Tool = {
  name: 'create_assets',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nUploads a new asset file (image or video) along with its metadata. If an asset with the same checksum already exists, returns the existing asset's metadata.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/asset_response',\n  $defs: {\n    asset_response: {\n      type: 'object',\n      title: 'AssetResponse',\n      properties: {\n        id: {\n          type: 'string',\n          title: 'Id'\n        },\n        checksum: {\n          type: 'string',\n          title: 'Checksum'\n        },\n        created_at: {\n          type: 'string',\n          title: 'Created At',\n          format: 'date-time'\n        },\n        device_asset_id: {\n          type: 'string',\n          title: 'Device Asset Id'\n        },\n        device_id: {\n          type: 'string',\n          title: 'Device Id'\n        },\n        file_created_at: {\n          type: 'string',\n          title: 'File Created At',\n          format: 'date-time'\n        },\n        file_modified_at: {\n          type: 'string',\n          title: 'File Modified At',\n          format: 'date-time'\n        },\n        local_datetime: {\n          type: 'string',\n          title: 'Local Datetime',\n          format: 'date-time'\n        },\n        mime_type: {\n          type: 'string',\n          title: 'Mime Type'\n        },\n        original_file_name: {\n          type: 'string',\n          title: 'Original File Name'\n        },\n        updated_at: {\n          type: 'string',\n          title: 'Updated At',\n          format: 'date-time'\n        },\n        download_url: {\n          type: 'string',\n          title: 'Download Url'\n        },\n        exif: {\n          type: 'object',\n          title: 'ExifResponse',\n          properties: {\n            altitude: {\n              type: 'number',\n              title: 'Altitude'\n            },\n            auto_stack_id: {\n              type: 'string',\n              title: 'Auto Stack Id'\n            },\n            city: {\n              type: 'string',\n              title: 'City'\n            },\n            country: {\n              type: 'string',\n              title: 'Country'\n            },\n            description: {\n              type: 'string',\n              title: 'Description'\n            },\n            digitized_datetime: {\n              type: 'string',\n              title: 'Digitized Datetime',\n              format: 'date-time'\n            },\n            exposure_bias: {\n              type: 'number',\n              title: 'Exposure Bias'\n            },\n            exposure_time: {\n              type: 'number',\n              title: 'Exposure Time'\n            },\n            f_number: {\n              type: 'number',\n              title: 'F Number'\n            },\n            focal_length: {\n              type: 'number',\n              title: 'Focal Length'\n            },\n            fps: {\n              type: 'number',\n              title: 'Fps'\n            },\n            iso: {\n              type: 'integer',\n              title: 'Iso'\n            },\n            latitude: {\n              type: 'number',\n              title: 'Latitude'\n            },\n            lens_model: {\n              type: 'string',\n              title: 'Lens Model'\n            },\n            live_photo_cid: {\n              type: 'string',\n              title: 'Live Photo Cid'\n            },\n            longitude: {\n              type: 'number',\n              title: 'Longitude'\n            },\n            make: {\n              type: 'string',\n              title: 'Make'\n            },\n            model: {\n              type: 'string',\n              title: 'Model'\n            },\n            modified_datetime: {\n              type: 'string',\n              title: 'Modified Datetime',\n              format: 'date-time'\n            },\n            orientation: {\n              type: 'integer',\n              title: 'Orientation'\n            },\n            original_datetime: {\n              type: 'string',\n              title: 'Original Datetime',\n              format: 'date-time'\n            },\n            profile_description: {\n              type: 'string',\n              title: 'Profile Description'\n            },\n            projection_type: {\n              type: 'string',\n              title: 'Projection Type'\n            },\n            rating: {\n              type: 'integer',\n              title: 'Rating'\n            },\n            state: {\n              type: 'string',\n              title: 'State'\n            }\n          },\n          required: []\n        },\n        metrics: {\n          type: 'object',\n          title: 'Metrics'\n        },\n        thumbnail_url: {\n          type: 'string',\n          title: 'Thumbnail Url'\n        }\n      },\n      required: [        'id',\n        'checksum',\n        'created_at',\n        'device_asset_id',\n        'device_id',\n        'file_created_at',\n        'file_modified_at',\n        'local_datetime',\n        'mime_type',\n        'original_file_name',\n        'updated_at'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      asset_data: {
        type: 'string',
        title: 'Asset Data',
      },
      device_asset_id: {
        type: 'string',
        title: 'Device Asset Id',
      },
      device_id: {
        type: 'string',
        title: 'Device Id',
      },
      file_created_at: {
        type: 'string',
        title: 'File Created At',
        format: 'date-time',
      },
      file_modified_at: {
        type: 'string',
        title: 'File Modified At',
        format: 'date-time',
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
  const body = args as any;
  return asTextContentResult(await maybeFilter(args, await client.assets.create(body)));
};

export default { metadata, tool, handler };
