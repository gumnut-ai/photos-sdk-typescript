// File generated from our OpenAPI spec. See CONTRIBUTING.md for details.

import Gumnut, { toFile, type ClientOptions } from 'gumnut-sdk';

/** The timeout of each request attempt, in milliseconds. */
let sentTimeouts: number[] = [];

beforeEach(() => {
  sentTimeouts = [];
});

class RecordingClient extends Gumnut {
  override fetchWithTimeout(...args: Parameters<Gumnut['fetchWithTimeout']>) {
    sentTimeouts.push(args[2]);
    return super.fetchWithTimeout(...args);
  }
}

/** A client whose requests all get a response with `status`. */
const makeClient = (status: number, options: ClientOptions = {}) =>
  new RecordingClient({
    apiKey: 'My API Key',
    baseURL: 'http://localhost:5000/',
    fetch: async () =>
      new Response('{}', {
        status,
        headers: { 'Content-Type': 'application/json', 'Retry-After-Ms': '1' },
      }),
    ...options,
  });

describe('assets.create request defaults', () => {
  test('retries as configured', async () => {
    await expect(
      makeClient(500).assets.create({
        asset_data: await toFile(Buffer.from('Example data'), 'README.md'),
        device_asset_id: 'IMG_0421',
        device_id: 'teds-iphone',
        file_created_at: '2026-05-04T10:30:00+10:00',
        file_modified_at: '2026-05-04T10:30:00+10:00',
      }),
    ).rejects.toThrow();
    expect(sentTimeouts).toHaveLength(1);

    sentTimeouts = [];
    await expect(
      makeClient(500, { maxRetries: 1 }).assets.create({
        asset_data: await toFile(Buffer.from('Example data'), 'README.md'),
        device_asset_id: 'IMG_0421',
        device_id: 'teds-iphone',
        file_created_at: '2026-05-04T10:30:00+10:00',
        file_modified_at: '2026-05-04T10:30:00+10:00',
      }),
    ).rejects.toThrow();
    expect(sentTimeouts).toHaveLength(2);

    sentTimeouts = [];
    await expect(
      makeClient(500).assets.create(
        {
          asset_data: await toFile(Buffer.from('Example data'), 'README.md'),
          device_asset_id: 'IMG_0421',
          device_id: 'teds-iphone',
          file_created_at: '2026-05-04T10:30:00+10:00',
          file_modified_at: '2026-05-04T10:30:00+10:00',
        },
        { maxRetries: 1 },
      ),
    ).rejects.toThrow();
    expect(sentTimeouts).toHaveLength(2);

    // An unset per-request option keeps the default.
    sentTimeouts = [];
    await expect(
      makeClient(500).assets.create(
        {
          asset_data: await toFile(Buffer.from('Example data'), 'README.md'),
          device_asset_id: 'IMG_0421',
          device_id: 'teds-iphone',
          file_created_at: '2026-05-04T10:30:00+10:00',
          file_modified_at: '2026-05-04T10:30:00+10:00',
        },
        { maxRetries: undefined } as {},
      ),
    ).rejects.toThrow();
    expect(sentTimeouts).toHaveLength(1);
  });

  test('times out as configured', async () => {
    await makeClient(200).assets.create({
      asset_data: await toFile(Buffer.from('Example data'), 'README.md'),
      device_asset_id: 'IMG_0421',
      device_id: 'teds-iphone',
      file_created_at: '2026-05-04T10:30:00+10:00',
      file_modified_at: '2026-05-04T10:30:00+10:00',
    });
    // A derived client keeps the method default.
    await makeClient(200)
      .withOptions({ logLevel: 'warn' })
      .assets.create({
        asset_data: await toFile(Buffer.from('Example data'), 'README.md'),
        device_asset_id: 'IMG_0421',
        device_id: 'teds-iphone',
        file_created_at: '2026-05-04T10:30:00+10:00',
        file_modified_at: '2026-05-04T10:30:00+10:00',
      });
    await makeClient(200, { timeout: 30000 }).assets.create({
      asset_data: await toFile(Buffer.from('Example data'), 'README.md'),
      device_asset_id: 'IMG_0421',
      device_id: 'teds-iphone',
      file_created_at: '2026-05-04T10:30:00+10:00',
      file_modified_at: '2026-05-04T10:30:00+10:00',
    });
    await makeClient(200).assets.create(
      {
        asset_data: await toFile(Buffer.from('Example data'), 'README.md'),
        device_asset_id: 'IMG_0421',
        device_id: 'teds-iphone',
        file_created_at: '2026-05-04T10:30:00+10:00',
        file_modified_at: '2026-05-04T10:30:00+10:00',
      },
      { timeout: 5_000 },
    );
    expect(sentTimeouts).toEqual([600000, 600000, 30000, 5000]);
  });

  test('lengthens the timeout to fit large files, including streams', async () => {
    const chunks: Uint8Array[] = Array(660).fill(new Uint8Array(125000));
    await makeClient(200).assets.create({
      asset_data: new File(chunks, 'large'),
      device_asset_id: 'IMG_0421',
      device_id: 'teds-iphone',
      file_created_at: '2026-05-04T10:30:00+10:00',
      file_modified_at: '2026-05-04T10:30:00+10:00',
    });
    await makeClient(200).assets.create({
      asset_data: Object.assign(
        (async function* () {
          yield* chunks;
        })(),
        { path: 'large' },
      ),
      device_asset_id: 'IMG_0421',
      device_id: 'teds-iphone',
      file_created_at: '2026-05-04T10:30:00+10:00',
      file_modified_at: '2026-05-04T10:30:00+10:00',
    });
    expect(sentTimeouts).toEqual([660000, 660000]);
  });
});

describe('other methods', () => {
  test('keep the SDK defaults', async () => {
    await expect(makeClient(500).users.me()).rejects.toThrow();
    expect(sentTimeouts).toEqual(Array(3).fill(60000));
  });
});
