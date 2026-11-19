// File generated from our OpenAPI spec. See CONTRIBUTING.md for details.

import * as qs from '../qs/stringify';

export function stringifyQuery(query: object | Record<string, unknown>) {
  return qs.stringify(query, { arrayFormat: 'repeat' });
}
