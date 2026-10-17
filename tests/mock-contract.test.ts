import Gumnut, { BadRequestError, toFile } from 'gumnut-sdk';

const client = new Gumnut({
  apiKey: 'mock-only',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

test('the mock accepts existing multipart array serialization', async () => {
  const response = await client.search.searchAssets({
    image: await toFile(Buffer.from('Example data'), 'image.jpg'),
    person_ids: ['person_one', 'person_two'],
    ratings: [0, 1],
  });
  expect(response).toBeDefined();
});

test('the mock rejects a request that violates the specification', async () => {
  // Deliberately bypass compile-time validation to test the HTTP validator.
  const error = await client.albums
    .create({ name: 123 as unknown as string })
    .catch((error: unknown) => error);
  expect(error).toBeInstanceOf(Gumnut.BadRequestError);
  expect((error as BadRequestError).headers.get('x-steady-request-valid')).toBe('false');
});
