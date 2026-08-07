// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Gumnut, { toFile } from 'gumnut-sdk';

const client = new Gumnut({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource search', () => {
  // Mock server tests are disabled
  test.skip('search', async () => {
    const responsePromise = client.search.search();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('search: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.search.search(
        {
          album_id: 'album_id',
          bbox: 'bbox',
          center: 'center',
          include: ['string', 'string'],
          library_id: 'library_id',
          limit: 1,
          local_datetime_after: '2019-12-27T18:11:19.117Z',
          local_datetime_before: '2019-12-27T18:11:19.117Z',
          page: 1,
          person_ids: ['string', 'string'],
          query: 'query',
          radius: 0,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Gumnut.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('searchAssets', async () => {
    const responsePromise = client.search.searchAssets();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('searchAssets: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.search.searchAssets(
        {
          include: ['string', 'string'],
          album_id: 'album_id',
          bbox: 'bbox',
          center: 'center',
          image: await toFile(Buffer.from('Example data'), 'README.md'),
          library_id: 'library_id',
          limit: 1,
          local_datetime_after: '2019-12-27T18:11:19.117Z',
          local_datetime_before: '2019-12-27T18:11:19.117Z',
          page: 1,
          person_ids: ['string'],
          query: 'query',
          radius: 0,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Gumnut.NotFoundError);
  });
});
