// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import GumnutAI from 'gumnut-sdk';

const client = new GumnutAI({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource oauth', () => {
  // Mock server tests are disabled
  test.skip('authURL: only required params', async () => {
    const responsePromise = client.oauth.authURL({ redirect_uri: 'redirect_uri' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('authURL: required and optional params', async () => {
    const response = await client.oauth.authURL({
      redirect_uri: 'redirect_uri',
      code_challenge: 'code_challenge',
      code_challenge_method: 'code_challenge_method',
    });
  });

  // Mock server tests are disabled
  test.skip('exchange', async () => {
    const responsePromise = client.oauth.exchange({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('logoutEndpoint', async () => {
    const responsePromise = client.oauth.logoutEndpoint();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
