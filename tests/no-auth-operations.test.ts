// File generated from our OpenAPI spec. See CONTRIBUTING.md for details.

import Gumnut, { type ClientOptions } from 'gumnut-sdk';

const authHeaders = ['Authorization'];

/** The auth headers each request sent. */
let sentAuthHeaders: string[][] = [];

const env = process.env;

beforeEach(() => {
  process.env = { ...env };
  delete process.env['GUMNUT_API_KEY'];
  sentAuthHeaders = [];
});

afterEach(() => {
  process.env = env;
});

/** A client whose requests all succeed, with credentials only if `options` gives them. */
const makeClient = (options: ClientOptions = {}) =>
  new Gumnut({
    baseURL: 'http://localhost:5000/',
    fetch: async (_url, init) => {
      const headers = new Headers(init?.headers);
      sentAuthHeaders.push(authHeaders.filter((name) => headers.has(name)));
      return new Response('{}', { headers: { 'Content-Type': 'application/json' } });
    },
    ...options,
  });

const keyOptions: ClientOptions = {
  apiKey: 'My API Key',
};

describe('methods that need no credentials', () => {
  test('oauth.authURL', async () => {
    await makeClient().oauth.authURL({ redirect_uri: 'redirect_uri' }).asResponse();
    await makeClient(keyOptions).oauth.authURL({ redirect_uri: 'redirect_uri' }).asResponse();
    expect(sentAuthHeaders).toEqual([[], []]);
  });

  test('oauth.exchange', async () => {
    await makeClient().oauth.exchange({}).asResponse();
    await makeClient(keyOptions).oauth.exchange({}).asResponse();
    expect(sentAuthHeaders).toEqual([[], []]);
  });

  test('oauth.logoutEndpoint', async () => {
    await makeClient().oauth.logoutEndpoint().asResponse();
    await makeClient(keyOptions).oauth.logoutEndpoint().asResponse();
    expect(sentAuthHeaders).toEqual([[], []]);
  });

  test('ping.get', async () => {
    await makeClient().ping.get().asResponse();
    await makeClient(keyOptions).ping.get().asResponse();
    expect(sentAuthHeaders).toEqual([[], []]);
  });
});

describe('other methods', () => {
  test('need credentials', async () => {
    await expect(makeClient().users.me()).rejects.toThrow(
      'Could not resolve authentication method. Expected the apiKey to be set. Or for the "Authorization" headers to be explicitly omitted',
    );
    expect(sentAuthHeaders).toEqual([]);
  });
});
