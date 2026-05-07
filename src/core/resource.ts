// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { Gumnut } from '../client';

export abstract class APIResource {
  protected _client: Gumnut;

  constructor(client: Gumnut) {
    this._client = client;
  }
}
