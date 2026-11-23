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
result in merge conflicts between manual patches and changes from the generator.

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

Tests use [Vitest](https://vitest.dev/) in Node.js 24. `bun run test` starts an
isolated [Steady](https://github.com/dgellow/steady) mock server using the embedded
OpenAPI specification, then stops it when testing finishes. The first run downloads
the pinned mock CLI through npm. The runner overrides `TEST_API_BASE_URL` and
`MOCK_SERVER_SPEC_URL` so the suite uses only its owned loopback server.
Run once with the command below; use `bun run test --watch` for watch mode.

```sh
$ bun run test
```

## Linting and formatting

This repository uses [Biome](https://biomejs.dev/) to lint and format TypeScript, JavaScript, and JSON.
[Prettier](https://prettier.io/) formats Markdown and YAML. `bun run lint` checks source formatting and
types without building the package. CI builds once, then runs `bun run check-package`
against that output to check package exports and installed consumers.

Development uses TypeScript 6 because the dual CommonJS/ESM package builder requires its compiler API.
The published library supports TypeScript 5.0 and later.
The build retains `tsc-multi`: the evaluated `tsdown` replacement produced circular namespace aliases
in declarations.

To lint:

```sh
$ bun run lint
```

To run the full source and package checks locally:

```sh
$ bun run lint
$ bun run build
$ bun run check-package
```

Package checks preserve Are The Types Wrong? and publint validation. They also use Node.js 24 and npm
to pack `dist`, install the tarball outside the checkout without development dependencies or lifecycle
scripts, and construct clients through CommonJS and ESM root and resource imports, including explicit
`.js` and `.mjs` aliases. They verify shipped JavaScript and declaration maps reference packaged sources
and preserve the CommonJS root's mapping to its original source. A separate temporary
installation of the pinned TypeScript 5.0.4 compiler checks root, resource, promise, and client namespace type imports
with legacy Node, Node16 CommonJS, Node16 ESM, and bundler resolution. The compiler download needs npm registry
access; its pinned release predates the dependency cooldown. These checks make no API requests.
Temporary packages are removed after success or failure.

To format and fix all lint issues automatically:

```sh
$ bun run fix
```

## Publishing and releases

Merging the automated release PR creates a GitHub release, which runs [the `Publish NPM` workflow](https://www.github.com/gumnut-ai/photos-sdk-typescript/actions/workflows/publish-npm.yml) to publish to npm.
It publishes with trusted publishing (OIDC), so no registry token is stored.
The publish job runs in the protected `release` environment and waits until a maintainer approves the deployment.

If publishing fails, fix the cause and re-run the failed workflow run, which waits for approval again. There is no manual publish script.
