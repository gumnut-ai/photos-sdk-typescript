// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Gumnut from 'gumnut-sdk';

const client = new Gumnut({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource stacks', () => {
  test('delete', async () => {
    const responsePromise = client.stacks.delete('stack_id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('addAssetsToStack: only required params', async () => {
    const responsePromise = client.stacks.addAssetsToStack('stack_id', { asset_ids: ['string'] });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('addAssetsToStack: required and optional params', async () => {
    const response = await client.stacks.addAssetsToStack('stack_id', { asset_ids: ['string'] });
  });

  test('createStack: only required params', async () => {
    const responsePromise = client.stacks.createStack({ asset_ids: ['string', 'string'] });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('createStack: required and optional params', async () => {
    const response = await client.stacks.createStack({
      asset_ids: ['string', 'string'],
      library_id: 'library_id',
      primary_asset_id: 'primary_asset_id',
    });
  });

  test('listStacks', async () => {
    const responsePromise = client.stacks.listStacks();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('listStacks: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.stacks.listStacks(
        {
          ids: ['string', 'string'],
          include: ['string', 'string'],
          library_id: 'library_id',
          limit: 1,
          origin: 'auto_burst',
          primary_asset_id: 'primary_asset_id',
          starting_after_id: 'starting_after_id',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Gumnut.NotFoundError);
  });

  test('removeAssets: only required params', async () => {
    const responsePromise = client.stacks.removeAssets('stack_id', { asset_ids: ['string'] });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('removeAssets: required and optional params', async () => {
    const response = await client.stacks.removeAssets('stack_id', { asset_ids: ['string'] });
  });

  test('retrieveStack', async () => {
    const responsePromise = client.stacks.retrieveStack('stack_id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('setCover: only required params', async () => {
    const responsePromise = client.stacks.setCover('stack_id', { primary_asset_id: 'primary_asset_id' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('setCover: required and optional params', async () => {
    const response = await client.stacks.setCover('stack_id', { primary_asset_id: 'primary_asset_id' });
  });
});
