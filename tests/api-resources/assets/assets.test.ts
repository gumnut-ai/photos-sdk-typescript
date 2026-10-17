// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Gumnut, { toFile } from 'gumnut-sdk';

const client = new Gumnut({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource assets', () => {
  test('create: only required params', async () => {
    const responsePromise = client.assets.create({
      asset_data: await toFile(Buffer.from('Example data'), 'README.md'),
      device_asset_id: 'IMG_0421',
      device_id: 'teds-iphone',
      file_created_at: '2026-05-04T10:30:00+10:00',
      file_modified_at: '2026-05-04T10:30:00+10:00',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('create: required and optional params', async () => {
    const response = await client.assets.create({
      asset_data: await toFile(Buffer.from('Example data'), 'README.md'),
      device_asset_id: 'IMG_0421',
      device_id: 'teds-iphone',
      file_created_at: '2026-05-04T10:30:00+10:00',
      file_modified_at: '2026-05-04T10:30:00+10:00',
      library_id: 'lib_2c6ihMLYJUt3vctZWi9SNP',
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.assets.retrieve('asset_id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieve: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.assets.retrieve(
        'asset_id',
        { include: ['string', 'string'] },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Gumnut.NotFoundError);
  });

  test('list', async () => {
    const responsePromise = client.assets.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.assets.list(
        {
          album_filter: 'all',
          album_id: 'album_id',
          bbox: 'bbox',
          center: 'center',
          ids: ['string', 'string'],
          include: ['string', 'string'],
          library_id: 'library_id',
          limit: 1,
          local_datetime_after: '2019-12-27T18:11:19.117Z',
          local_datetime_before: '2019-12-27T18:11:19.117Z',
          media_type: 'image',
          order: 'asc',
          person_ids: ['string', 'string'],
          radius: 0,
          ratings: [0, 0],
          stack_id: 'stack_id',
          starting_after_id: 'starting_after_id',
          state: 'live',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Gumnut.NotFoundError);
  });

  test('delete', async () => {
    const responsePromise = client.assets.delete('asset_id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('bulkUpdateAssets: only required params', async () => {
    const responsePromise = client.assets.bulkUpdateAssets({
      updates: [
        {
          id: 'id',
          change: {},
        },
      ],
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('bulkUpdateAssets: required and optional params', async () => {
    const response = await client.assets.bulkUpdateAssets({
      updates: [
        {
          id: 'id',
          change: {
            description: 'description',
            latitude: 0,
            longitude: 0,
            original_datetime: '2019-12-27T18:11:19.117Z',
            rating: 0,
          },
        },
      ],
    });
  });

  test('checkExistence', async () => {
    const responsePromise = client.assets.checkExistence({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('clusterByGeo: only required params', async () => {
    const responsePromise = client.assets.clusterByGeo({ bbox: 'bbox', cell_size: 0 });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('clusterByGeo: required and optional params', async () => {
    const response = await client.assets.clusterByGeo({
      bbox: 'bbox',
      cell_size: 0,
      album_filter: 'all',
      album_id: 'album_id',
      library_id: 'library_id',
      local_datetime_after: '2019-12-27T18:11:19.117Z',
      local_datetime_before: '2019-12-27T18:11:19.117Z',
      media_type: 'image',
      person_ids: ['string', 'string'],
      ratings: [0, 0],
      state: 'live',
    });
  });

  test('counts', async () => {
    const responsePromise = client.assets.counts();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('counts: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.assets.counts(
        {
          album_filter: 'all',
          album_id: 'album_id',
          bbox: 'bbox',
          center: 'center',
          group_by: 'day',
          library_id: 'library_id',
          limit: 1,
          local_datetime_after: '2019-12-27T18:11:19.117Z',
          local_datetime_before: '2019-12-27T18:11:19.117Z',
          media_type: 'image',
          order: 'asc',
          person_id: 'person_id',
          person_ids: ['string', 'string'],
          radius: 0,
          ratings: [0, 0],
          starting_after_bucket: '2019-12-27T18:11:19.117Z',
          state: 'live',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Gumnut.NotFoundError);
  });

  test('deleteList: only required params', async () => {
    const responsePromise = client.assets.deleteList({ ids: ['string'] });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('deleteList: required and optional params', async () => {
    const response = await client.assets.deleteList({ ids: ['string'], library_id: 'library_id' });
  });

  test('emptyTrash', async () => {
    const responsePromise = client.assets.emptyTrash();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('emptyTrash: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.assets.emptyTrash({ library_id: 'library_id' }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(Gumnut.NotFoundError);
  });

  test('move: only required params', async () => {
    const responsePromise = client.assets.move({
      asset_ids: ['string'],
      destination_library_id: 'destination_library_id',
      source_library_id: 'source_library_id',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('move: required and optional params', async () => {
    const response = await client.assets.move({
      asset_ids: ['string'],
      destination_library_id: 'destination_library_id',
      source_library_id: 'source_library_id',
    });
  });

  test('restore: only required params', async () => {
    const responsePromise = client.assets.restore({ ids: ['string'] });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('restore: required and optional params', async () => {
    const response = await client.assets.restore({ ids: ['string'], library_id: 'library_id' });
  });

  test('trash: only required params', async () => {
    const responsePromise = client.assets.trash({ ids: ['string'] });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('trash: required and optional params', async () => {
    const response = await client.assets.trash({ ids: ['string'], library_id: 'library_id' });
  });

  test('updateAsset', async () => {
    const responsePromise = client.assets.updateAsset('asset_id', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
