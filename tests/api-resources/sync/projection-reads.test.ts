// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Gumnut from 'gumnut-sdk';

const client = new Gumnut({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource projectionReads', () => {
  test('read: only required params', async () => {
    const responsePromise = client.sync.projectionReads.read({
      keys: [{ id: 'x', kind: 'current_user' }],
      library_id: 'x',
      mode: 'roots',
      profile: { name: 'gumnut-library', version: 1 },
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('read: required and optional params', async () => {
    const response = await client.sync.projectionReads.read({
      keys: [{ id: 'x', kind: 'current_user' }],
      library_id: 'x',
      mode: 'roots',
      profile: { name: 'gumnut-library', version: 1 },
    });
  });
});
