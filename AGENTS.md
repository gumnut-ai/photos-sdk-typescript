# AI Agent Instructions

## Generated SDK and Custom Changes

This SDK is generated from an OpenAPI specification. Make endpoint and request/response
schema changes in the specification or generator configuration.

Development-tooling fixes and other intentional custom changes are persisted and replayed
between generations, as described in [CONTRIBUTING.md](./CONTRIBUTING.md). They may conflict
with future generator changes; verify regeneration preserves them. `src/lib/` and
`examples/` are never modified by the generator.

## Hand-Maintained Tooling

`.agents/daemons/` holds Charlie daemon definitions — repo-authored operating roles, not
generated output. It is outside the generator's preserved set but has persisted across
regeneration; leave it in place. See [`.agents/daemons/AGENTS.md`](.agents/daemons/AGENTS.md).

## Contributing

For information on running tests, linting, and local development, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Resources

- [Stainless Documentation](https://www.stainless.com/docs/)
- [Stainless SDK Configuration Guide](https://www.stainless.com/docs/guides/configure/)
