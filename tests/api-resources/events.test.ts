// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Gumnut from 'gumnut-sdk';

const client = new Gumnut({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource events', () => {
  // Prism tests are disabled
  test.skip('get', async () => {
    const responsePromise = client.events.get();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('get: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.events.get(
        {
          after_cursor: 'after_cursor',
          created_at_gte: '2019-12-27T18:11:19.117Z',
          created_at_lt: '2019-12-27T18:11:19.117Z',
          entity_types: 'entity_types',
          library_id: 'library_id',
          limit: 1,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Gumnut.NotFoundError);
  });
});
