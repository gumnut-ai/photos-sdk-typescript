// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Gumnut, { toFile } from 'gumnut-sdk';

const client = new Gumnut({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource versions', () => {
  // Mock server tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.assets.versions.list('asset_id');
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
      client.assets.versions.list(
        'asset_id',
        { include: ['string', 'string'] },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Gumnut.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('delete: only required params', async () => {
    const responsePromise = client.assets.versions.delete('version_id', { asset_id: 'asset_id' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('delete: required and optional params', async () => {
    const response = await client.assets.versions.delete('version_id', { asset_id: 'asset_id' });
  });

  // Mock server tests are disabled
  test.skip('append: only required params', async () => {
    const responsePromise = client.assets.versions.append('asset_id', {
      file: await toFile(Buffer.from('Example data'), 'README.md'),
      kind: 'kind',
      params: 'params',
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
  test.skip('append: required and optional params', async () => {
    const response = await client.assets.versions.append('asset_id', {
      file: await toFile(Buffer.from('Example data'), 'README.md'),
      kind: 'kind',
      params: 'params',
      include: ['string', 'string'],
    });
  });

  // Mock server tests are disabled
  test.skip('replace: only required params', async () => {
    const responsePromise = client.assets.versions.replace('version_id', {
      asset_id: 'asset_id',
      file: await toFile(Buffer.from('Example data'), 'README.md'),
      kind: 'kind',
      params: 'params',
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
  test.skip('replace: required and optional params', async () => {
    const response = await client.assets.versions.replace('version_id', {
      asset_id: 'asset_id',
      file: await toFile(Buffer.from('Example data'), 'README.md'),
      kind: 'kind',
      params: 'params',
      include: ['string', 'string'],
    });
  });

  // Mock server tests are disabled
  test.skip('revert: only required params', async () => {
    const responsePromise = client.assets.versions.revert('version_id', { asset_id: 'asset_id' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('revert: required and optional params', async () => {
    const response = await client.assets.versions.revert('version_id', { asset_id: 'asset_id' });
  });
});
