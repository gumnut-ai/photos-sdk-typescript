// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Gumnut from 'gumnut-sdk';

const client = new Gumnut({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource people', () => {
  test('create', async () => {
    const responsePromise = client.people.create({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieve', async () => {
    const responsePromise = client.people.retrieve('person_id');
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
      client.people.retrieve(
        'person_id',
        { include: ['string', 'string'] },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Gumnut.NotFoundError);
  });

  test('update', async () => {
    const responsePromise = client.people.update('person_id', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list', async () => {
    const responsePromise = client.people.list();
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
      client.people.list(
        {
          album_id: 'album_id',
          asset_id: 'asset_id',
          ids: ['string', 'string'],
          include: ['string', 'string'],
          include_hidden: true,
          library_id: 'library_id',
          limit: 1,
          name: 'name',
          name_filter: 'named',
          sort: 'created_at_desc',
          starting_after_id: 'starting_after_id',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Gumnut.NotFoundError);
  });

  test('delete', async () => {
    const responsePromise = client.people.delete('person_id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('bulkUpdatePeople: only required params', async () => {
    const responsePromise = client.people.bulkUpdatePeople({
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

  test('bulkUpdatePeople: required and optional params', async () => {
    const response = await client.people.bulkUpdatePeople({
      updates: [
        {
          id: 'id',
          change: {
            birth_date: '2019-12-27',
            is_favorite: true,
            is_hidden: true,
            name: 'x',
            thumbnail_face_id: 'thumbnail_face_id',
          },
        },
      ],
    });
  });

  test('merge: only required params', async () => {
    const responsePromise = client.people.merge('person_id', { source_person_ids: ['string'] });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('merge: required and optional params', async () => {
    const response = await client.people.merge('person_id', { source_person_ids: ['string'] });
  });
});
