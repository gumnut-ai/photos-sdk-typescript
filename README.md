# Gumnut TypeScript API Library

[![NPM version](<https://img.shields.io/npm/v/gumnut-sdk.svg?label=npm%20(stable)>)](https://npmjs.org/package/gumnut-sdk) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/gumnut-sdk)

This library provides convenient access to the Gumnut REST API from TypeScript or JavaScript.

The REST API documentation can be found on [docs.gumnut.ai](https://docs.gumnut.ai). The full API of this library can be found in [api.md](api.md).

## Installation

```sh
npm install gumnut-sdk
```

## Usage

The full API of this library can be found in [api.md](api.md).

<!-- prettier-ignore -->
```js
import Gumnut from 'gumnut-sdk';

const client = new Gumnut({
  apiKey: process.env['GUMNUT_API_KEY'], // This is the default and can be omitted
});

const userResponse = await client.users.me();

console.log(userResponse.email);
```

### Request & Response types

This library includes TypeScript definitions for all request params and response fields. You may import and use them like so:

<!-- prettier-ignore -->
```ts
import Gumnut from 'gumnut-sdk';

const client = new Gumnut({
  apiKey: process.env['GUMNUT_API_KEY'], // This is the default and can be omitted
});

const userResponse: Gumnut.UserResponse = await client.users.me();
```

Documentation for each method, request param, and response field are available in docstrings and will appear on hover in most modern editors.

## OAuth tokens

An app can sign people in with OAuth and call the API as them, without
an API key. `client.oauth.authURL()`, `client.oauth.exchange()`,
`client.oauth.logoutEndpoint()` and `client.ping.get()` need no
credentials and send no `Authorization` header. Pass the
`access_token` that `exchange()` returns as `apiKey`:

```ts
import Gumnut from 'gumnut-sdk';

export async function signIn(code: string, state: string, code_verifier: string): Promise<Gumnut> {
  const token = await new Gumnut().oauth.exchange({ code, state, code_verifier });
  return new Gumnut({ apiKey: token.access_token });
}
```

The token is short-lived. When it nears expiry, a successful response
carries a replacement in its `x-new-access-token` header, which
`.withResponse()` exposes. Once it expires, requests throw
`Gumnut.AuthenticationError` until the person signs in again.

## File uploads

Request parameters that correspond to file uploads can be passed in many different forms:

- `File` (or an object with the same structure)
- a `fetch` `Response` (or an object with the same structure)
- an `fs.ReadStream`
- the return value of our `toFile` helper

```ts
import fs from 'fs';
import Gumnut, { toFile } from 'gumnut-sdk';

const client = new Gumnut();

// If you have access to Node `fs` we recommend using `fs.createReadStream()`:
await client.assets.create({
  asset_data: fs.createReadStream('/path/to/file'),
  device_asset_id: 'IMG_0421',
  device_id: 'teds-iphone',
  file_created_at: '2026-05-04T10:30:00+10:00',
  file_modified_at: '2026-05-04T10:30:00+10:00',
});

// Or if you have the web `File` API you can pass a `File` instance:
await client.assets.create({
  asset_data: new File(['my bytes'], 'file'),
  device_asset_id: 'IMG_0421',
  device_id: 'teds-iphone',
  file_created_at: '2026-05-04T10:30:00+10:00',
  file_modified_at: '2026-05-04T10:30:00+10:00',
});

// You can also pass a `fetch` `Response`:
await client.assets.create({
  asset_data: await fetch('https://somesite/file'),
  device_asset_id: 'IMG_0421',
  device_id: 'teds-iphone',
  file_created_at: '2026-05-04T10:30:00+10:00',
  file_modified_at: '2026-05-04T10:30:00+10:00',
});

// Finally, if none of the above are convenient, you can use our `toFile` helper:
await client.assets.create({
  asset_data: await toFile(Buffer.from('my bytes'), 'file'),
  device_asset_id: 'IMG_0421',
  device_id: 'teds-iphone',
  file_created_at: '2026-05-04T10:30:00+10:00',
  file_modified_at: '2026-05-04T10:30:00+10:00',
});
await client.assets.create({
  asset_data: await toFile(new Uint8Array([0, 1, 2]), 'file'),
  device_asset_id: 'IMG_0421',
  device_id: 'teds-iphone',
  file_created_at: '2026-05-04T10:30:00+10:00',
  file_modified_at: '2026-05-04T10:30:00+10:00',
});
```

## Handling errors

When the library is unable to connect to the API,
or if the API returns a non-success status code (i.e., 4xx or 5xx response),
a subclass of `APIError` will be thrown:

<!-- prettier-ignore -->
```ts
const userResponse = await client.users.me().catch(async (err) => {
  if (err instanceof Gumnut.APIError) {
    console.log(err.status); // 400
    console.log(err.name); // BadRequestError
    console.log(err.headers); // {server: 'nginx', ...}
  } else {
    throw err;
  }
});
```

Error codes are as follows:

| Status Code | Error Type                 |
| ----------- | -------------------------- |
| 400         | `BadRequestError`          |
| 401         | `AuthenticationError`      |
| 403         | `PermissionDeniedError`    |
| 404         | `NotFoundError`            |
| 409         | `ConflictError`            |
| 422         | `UnprocessableEntityError` |
| 429         | `RateLimitError`           |
| >=500       | `InternalServerError`      |
| N/A         | `APIConnectionError`       |

### Retries

Certain errors will be automatically retried 2 times by default, with a short exponential backoff.
Connection errors (for example, due to a network connectivity problem), 408 Request Timeout, 409 Conflict,
429 Rate Limit, and >=500 Internal errors will all be retried by default. Some methods use their own defaults; see [Method defaults](#method-defaults).

You can use the `maxRetries` option to configure or disable this:

<!-- prettier-ignore -->
```js
// Configure the default for all requests:
const client = new Gumnut({
  maxRetries: 0, // default is 2
});

// Or, configure per-request:
await client.users.me({
  maxRetries: 5,
});
```

### Timeouts

Requests time out after 1 minute by default. You can configure this with a `timeout` option:

<!-- prettier-ignore -->
```ts
// Configure the default for all requests:
const client = new Gumnut({
  timeout: 20 * 1000, // 20 seconds (default is 1 minute)
});

// Override per-request:
await client.users.me({
  timeout: 5 * 1000,
});
```

On timeout, an `APIConnectionTimeoutError` is thrown.

Note that requests which time out will be [retried twice by default](#retries).

### Method defaults

These methods use their own retry and timeout defaults:

- `client.feedback.submit()` doesn't retry.
- `client.assets.create()` doesn't retry, and times out after 10 minutes or its files' upload time at 125,000 bytes per second, whichever is longer.
- `client.assets.versions.append()` doesn't retry, and times out after 10 minutes or its files' upload time at 125,000 bytes per second, whichever is longer.
- `client.assets.versions.replace()` doesn't retry, and times out after 10 minutes or its files' upload time at 125,000 bytes per second, whichever is longer.
- `client.faces.create()` doesn't retry.

To override them, set `maxRetries` or `timeout` on the client or per request. A client setting equal to the SDK default (2 retries, 1 minute) keeps the method's default.

## Auto-pagination

List methods in the Gumnut API are paginated.
You can use the `for await … of` syntax to iterate through items across all pages:

```ts
async function fetchAllAssetResponses() {
  const allAssetResponses = [];
  // Automatically fetches more pages as needed.
  for await (const assetResponse of client.assets.list()) {
    allAssetResponses.push(assetResponse);
  }
  return allAssetResponses;
}
```

Alternatively, you can request a single page at a time:

```ts
let page = await client.assets.list();
for (const assetResponse of page.data) {
  console.log(assetResponse);
}

// Convenience methods are provided for manually paginating:
while (page.hasNextPage()) {
  page = await page.getNextPage();
  // ...
}
```

## Advanced Usage

### Accessing raw Response data (e.g., headers)

The "raw" `Response` returned by `fetch()` can be accessed through the `.asResponse()` method on the `APIPromise` type that all methods return.
This method returns as soon as the headers for a successful response are received and does not consume the response body, so you are free to write custom parsing or streaming logic.

You can also use the `.withResponse()` method to get the raw `Response` along with the parsed data.
Unlike `.asResponse()` this method consumes the body, returning once it is parsed.

<!-- prettier-ignore -->
```ts
const client = new Gumnut();

const response = await client.users.me().asResponse();
console.log(response.headers.get('X-My-Header'));
console.log(response.statusText); // access the underlying Response object

const { data: userResponse, response: raw } = await client.users.me().withResponse();
console.log(raw.headers.get('X-My-Header'));
console.log(userResponse.id);
```

### Logging

> [!IMPORTANT]
> All log messages are intended for debugging only. The format and content of log messages
> may change between releases.

#### Log levels

The log level can be configured in two ways:

1. Via the `GUMNUT_LOG` environment variable
2. Using the `logLevel` client option (overrides the environment variable if set)

```ts
import Gumnut from 'gumnut-sdk';

const client = new Gumnut({
  logLevel: 'debug', // Show all log messages
});
```

Available log levels, from most to least verbose:

- `'debug'` - Show debug messages, info, warnings, and errors
- `'info'` - Show info messages, warnings, and errors
- `'warn'` - Show warnings and errors (default)
- `'error'` - Show only errors
- `'off'` - Disable all logging

At the `'debug'` level, all HTTP requests and responses are logged, including headers and bodies.
Some authentication-related headers are redacted, but sensitive data in request and response bodies
may still be visible.

#### Custom logger

By default, this library logs to `globalThis.console`. You can also provide a custom logger.
Most logging libraries are supported, including [pino](https://www.npmjs.com/package/pino), [winston](https://www.npmjs.com/package/winston), [bunyan](https://www.npmjs.com/package/bunyan), [consola](https://www.npmjs.com/package/consola), [signale](https://www.npmjs.com/package/signale), and [@std/log](https://jsr.io/@std/log). If your logger doesn't work, please open an issue.

When providing a custom logger, the `logLevel` option still controls which messages are emitted, messages
below the configured level will not be sent to your logger.

<!-- readme-snippet-check: skip -->

```ts
import Gumnut from 'gumnut-sdk';
import pino from 'pino';

const logger = pino();

const client = new Gumnut({
  logger: logger.child({ name: 'Gumnut' }),
  logLevel: 'debug', // Send all messages to pino, allowing it to filter
});
```

### Making custom/undocumented requests

This library is typed for convenient access to the documented API. If you need to access undocumented
endpoints, params, or response properties, the library can still be used.

#### Undocumented endpoints

To make requests to undocumented endpoints, you can use `client.get`, `client.post`, and other HTTP verbs.
Options on the client, such as retries, will be respected when making these requests.

```ts
await client.post('/some/path', {
  body: { some_prop: 'foo' },
  query: { some_query_arg: 'bar' },
});
```

#### Undocumented request params

To make requests using undocumented parameters, you may use `// @ts-expect-error` on the undocumented
parameter. This library doesn't validate at runtime that the request matches the type, so any extra values you
send will be sent as-is.

```ts
client.assets.list({
  // ...
  // @ts-expect-error baz is not yet public
  baz: 'undocumented option',
});
```

For requests with the `GET` verb, any extra params will be in the query, all other requests will send the
extra param in the body.

If you want to explicitly send an extra argument, you can do so with the `query`, `body`, and `headers` request
options.

#### Undocumented response properties

To access undocumented response properties, you may access the response object with `// @ts-expect-error` on
the response object, or cast the response object to the requisite type. Like the request params, we do not
validate or strip extra properties from the response from the API.

### Customizing the fetch client

By default, this library expects a global `fetch` function is defined.

If you want to use a different `fetch` function, you can either polyfill the global:

<!-- readme-snippet-check: skip -->

```ts
import fetch from 'my-fetch';

globalThis.fetch = fetch;
```

Or pass it to the client:

<!-- readme-snippet-check: skip -->

```ts
import Gumnut from 'gumnut-sdk';
import fetch from 'my-fetch';

const client = new Gumnut({ fetch });
```

### Fetch options

If you want to set custom `fetch` options without overriding the `fetch` function, you can provide a `fetchOptions` object when instantiating the client or making a request. (Request-specific options override client options.)

```ts
import Gumnut from 'gumnut-sdk';

const client = new Gumnut({
  fetchOptions: {
    // `RequestInit` options
  },
});
```

#### Configuring proxies

To modify proxy behavior, you can provide custom `fetchOptions` that add runtime-specific proxy
options to requests:

**Node** <sup>[[docs](https://github.com/nodejs/undici/blob/main/docs/docs/api/ProxyAgent.md#example---proxyagent-with-fetch)]</sup>

<!-- readme-snippet-check: installed-package -->

```ts
import Gumnut from 'gumnut-sdk';
import * as undici from 'undici';

const proxyAgent = new undici.ProxyAgent('http://localhost:8888');
const client = new Gumnut({
  fetchOptions: {
    dispatcher: proxyAgent,
  },
});
```

**Bun** <sup>[[docs](https://bun.sh/guides/http/proxy)]</sup>

<!-- readme-snippet-check: skip -->

```ts
import Gumnut from 'gumnut-sdk';

const client = new Gumnut({
  fetchOptions: {
    proxy: 'http://localhost:8888',
  },
});
```

## Versioning

This package is pre-1.0, so any minor release (0.x.0) may include backwards-incompatible changes, such as
renamed or removed methods and changed types. Patch releases (0.x.y) carry fixes and aren't meant to break callers.

Pin to a minor version, and read the [changelog](./CHANGELOG.md) before moving to the next one. For example,
`gumnut-sdk@~0.193.0` accepts later patch releases but not 0.194.0:

```sh
npm install gumnut-sdk@~0.193.0
```

We are keen for your feedback; please open an [issue](https://www.github.com/gumnut-ai/photos-sdk-typescript/issues) with questions, bugs, or suggestions.

## Requirements

TypeScript >= 5.0 is supported, including TypeScript 7.

The following runtimes are supported:

- Web browsers (Up-to-date Chrome, Firefox, Safari, Edge, and more)
- Node.js 22 LTS or later ([non-EOL](https://endoflife.date/nodejs)) versions.
- Bun 1.4 or later.

> [!WARNING]
> Don't put a secret API key in browser code: anyone who loads the page can read it. In a browser,
> use a short-lived credential issued to the signed-in user, or call the API from your server.

React Native isn't tested. A React Native app uses the SDK's JSON API requests and error classes, passing the client its own `fetch`; pagination helpers and file uploads through the SDK are untested there.

If you are interested in other runtime environments, please open or upvote an issue on GitHub.

## Contributing

See [the contributing documentation](./CONTRIBUTING.md).
