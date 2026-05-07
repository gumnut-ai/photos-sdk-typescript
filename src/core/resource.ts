// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { GumnutAI } from '../client';

export abstract class APIResource {
  protected _client: GumnutAI;

  constructor(client: GumnutAI) {
    this._client = client;
  }
}
