// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Gumnut from 'gumnut-sdk';

const client = new Gumnut({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource invitations', () => {
  // Mock server tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.libraries.invitations.create({
      expires_at: '2019-12-27T18:11:19.117Z',
      library_id: 'library_id',
      max_joiners: 1,
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
  test.skip('create: required and optional params', async () => {
    const response = await client.libraries.invitations.create({
      expires_at: '2019-12-27T18:11:19.117Z',
      library_id: 'library_id',
      max_joiners: 1,
      role: 'viewer',
    });
  });

  // Mock server tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.libraries.invitations.list();
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
      client.libraries.invitations.list(
        {
          library_id: 'library_id',
          limit: 1,
          starting_after_id: 'starting_after_id',
          state: 'active',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Gumnut.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('disable', async () => {
    const responsePromise = client.libraries.invitations.disable('invitation_id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('join: only required params', async () => {
    const responsePromise = client.libraries.invitations.join('invitation_id', { secret: 'x' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('join: required and optional params', async () => {
    const response = await client.libraries.invitations.join('invitation_id', { secret: 'x' });
  });

  // Mock server tests are disabled
  test.skip('link', async () => {
    const responsePromise = client.libraries.invitations.link('invitation_id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('preview: only required params', async () => {
    const responsePromise = client.libraries.invitations.preview('invitation_id', { secret: 'x' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('preview: required and optional params', async () => {
    const response = await client.libraries.invitations.preview('invitation_id', { secret: 'x' });
  });
});
