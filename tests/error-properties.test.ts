// File generated from our OpenAPI spec. See CONTRIBUTING.md for details.

import { APIConnectionError, APIError } from 'gumnut-sdk/core/error';

const body = { code: 'code' };

describe('error body properties', () => {
  test.each([400, 401, 403, 404, 409, 422, 429, 500])('%i reads them from the body', (status) => {
    const error = APIError.generate(status, body, undefined, new Headers());
    expect(error.status).toEqual(status);
    expect(error.code).toEqual('code');
  });

  test.each([
    {},
    ['not', 'an', 'object'],
    'not an object',
    undefined,
  ])('a body without them leaves them unset (%j)', (errorBody) => {
    const error = APIError.generate(409, errorBody, undefined, new Headers());
    expect(error.code).toBeUndefined();
  });

  test('an error without a response leaves them unset', () => {
    const error = new APIConnectionError({});
    expect(error.code).toBeUndefined();
  });
});
