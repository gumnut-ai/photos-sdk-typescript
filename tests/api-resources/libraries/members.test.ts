// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Gumnut from 'gumnut-sdk';

const client = new Gumnut({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource members', () => {
  // Mock server tests are disabled
  test.skip('update: only required params', async () => {
    const responsePromise = client.libraries.members.update('user_id', {
      library_id: 'library_id',
      role: 'viewer',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('update: required and optional params', async () => {
    const response = await client.libraries.members.update('user_id', {
      library_id: 'library_id',
      role: 'viewer',
    });
  });

  // Mock server tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.libraries.members.list('library_id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('list: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.libraries.members.list(
        'library_id',
        {
          limit: 1,
          starting_after_id: 'starting_after_id',
          state: 'active',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Gumnut.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('leave', async () => {
    const responsePromise = client.libraries.members.leave('library_id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('remove: only required params', async () => {
    const responsePromise = client.libraries.members.remove('user_id', { library_id: 'library_id' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('remove: required and optional params', async () => {
    const response = await client.libraries.members.remove('user_id', { library_id: 'library_id' });
  });
});
