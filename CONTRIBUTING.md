## Setting up the environment

Development uses [Bun](https://bun.com/) (the version in `.bun-version`) to manage dependencies
and run commands, and Node.js 24 to build the package and run Vitest.

```sh
$ ./scripts/bootstrap
$ bun run build
```

Bootstrap installs the committed `bun.lock` without changing it. To intentionally change dependencies,
use `bun add --dev <package>` or `bun install` and commit the updated lockfile. New dependency
resolutions have a 14-day minimum release age, configured in `bunfig.toml`.

## Modifying/Adding code

Most of the SDK is generated code. Modifications to code will be persisted between generations, but may
result in merge conflicts between manual patches and changes from the generator. The generator will never
modify the contents of the `src/lib/` and `examples/` directories.

## Adding and running examples

All files in the `examples/` directory are not modified by the generator and can be freely edited or added to.

```ts
// add an example to examples/<your-example>.ts

#!/usr/bin/env bun
…
```

```sh
$ chmod +x examples/<your-example>.ts
# run the example against your api
$ bun run examples/<your-example>.ts
```

## Using the repository from source

If you’d like to use the repository from source, you can either install from git or link to a cloned repository:

To install via git:

```sh
$ npm install git+ssh://git@github.com:gumnut-ai/photos-sdk-typescript.git
```

Alternatively, to link a local copy of the repo:

```sh
# Clone
$ git clone https://www.github.com/gumnut-ai/photos-sdk-typescript
$ cd photos-sdk-typescript

$ bun link
$ cd ../my-package
$ bun link gumnut-sdk
```

## Running tests

Tests use [Vitest](https://vitest.dev/) in Node.js. Run once with the command below;
use `bun run test --watch` for watch mode.

```sh
$ bun run test
```

## Linting and formatting

This repository uses [Biome](https://biomejs.dev/) to lint and format TypeScript, JavaScript, and JSON.
[Prettier](https://prettier.io/) formats Markdown and YAML. `bun run lint` also builds the package and checks
types and package exports.

Development uses TypeScript 6 because the dual CommonJS/ESM package builder requires its compiler API.
The published library continues to support TypeScript 4.9 and later.

To lint:

```sh
$ bun run lint
```

To format and fix all lint issues automatically:

```sh
$ bun run fix
```

## Publishing and releases

Changes made to this repository via the automated release PR pipeline should publish to npm automatically. If
the changes aren't made through the automated pipeline, you may want to make releases manually.

### Publish with a GitHub workflow

You can release to package managers by using [the `Publish NPM` GitHub action](https://www.github.com/gumnut-ai/photos-sdk-typescript/actions/workflows/publish-npm.yml). This requires a setup organization or repository secret to be set up.

### Publish manually

If you need to manually release a package, you can run the `bin/publish-npm` script with an `NPM_TOKEN` set on
the environment.
