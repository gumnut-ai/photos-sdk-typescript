import {
  APIError,
  BadRequestError,
  NotFoundError,
  PermissionDeniedError,
  UnprocessableEntityError,
} from 'gumnut-sdk/core/error';

const validationErrors = [
  { loc: ['body', 'name'], msg: 'Field required', type: 'missing' },
  { loc: ['query', 'limit'], msg: 'Input should be less than or equal to 200', type: 'less_than_equal' },
  { loc: ['body', 'ids', 3], msg: 'Input should be a valid string', type: 'string_type' },
];

describe('error messages', () => {
  test.each([
    [404, { detail: 'Asset not found' }, NotFoundError, '404 Asset not found'],
    [422, { detail: 'Album name is taken' }, UnprocessableEntityError, '422 Album name is taken'],
    [403, { detail: 'No access', code: 'not_shared' }, PermissionDeniedError, '403 No access'],
    [
      422,
      { detail: validationErrors },
      UnprocessableEntityError,
      '422 body.name: Field required; query.limit: Input should be less than or equal to 200; body.ids.3: Input should be a valid string',
    ],
    [422, { detail: [{ msg: 'Value error' }] }, UnprocessableEntityError, '422 Value error'],
  ])('%i with detail %j', (status, body, errorClass, expected) => {
    const error = APIError.generate(status, body, undefined, new Headers());
    expect(error).toBeInstanceOf(errorClass);
    expect(error.message).toEqual(expected);
    expect(error.status).toEqual(status);
    expect(error.error).toEqual(body);
  });

  test.each([
    [400, { error: 'bad request' }],
    [400, { detail: '' }],
    [400, { detail: [] }],
    [400, { detail: [{ loc: ['body'] }] }],
    [400, { detail: { reason: 'nested' } }],
    [400, ['not', 'an', 'object']],
    [400, 'not an object'],
  ])('%i without a usable detail keeps the JSON body (%j)', (status, body) => {
    const error = APIError.generate(status, body, undefined, new Headers());
    expect(error).toBeInstanceOf(BadRequestError);
    expect(error.message).toEqual(`${status} ${JSON.stringify(body)}`);
    expect(error.error).toEqual(body);
  });

  test('a body that is not JSON keeps its text', () => {
    const error = APIError.generate(502, undefined, 'Bad Gateway', new Headers());
    expect(error.message).toEqual('502 Bad Gateway');
  });

  test('no body', () => {
    const error = APIError.generate(500, undefined, undefined, new Headers());
    expect(error.message).toEqual('500 status code (no body)');
  });
});
