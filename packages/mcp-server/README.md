# Gumnut TypeScript MCP Server

It is generated with [Stainless](https://www.stainless.com/).

## Installation

### Direct invocation

You can run the MCP Server directly via `npx`:

```sh
export GUMNUT_API_KEY="My API Key"
npx -y gumnut-mcp@latest
```

### Via MCP Client

There is a partial list of existing clients at [modelcontextprotocol.io](https://modelcontextprotocol.io/clients). If you already
have a client, consult their documentation to install the MCP server.

For clients with a configuration JSON, it might look something like this:

```json
{
  "mcpServers": {
    "gumnut_sdk_api": {
      "command": "npx",
      "args": ["-y", "gumnut-mcp", "--client=claude", "--tools=dynamic"],
      "env": {
        "GUMNUT_API_KEY": "My API Key"
      }
    }
  }
}
```

## Exposing endpoints to your MCP Client

There are two ways to expose endpoints as tools in the MCP server:

1. Exposing one tool per endpoint, and filtering as necessary
2. Exposing a set of tools to dynamically discover and invoke endpoints from the API

### Filtering endpoints and tools

You can run the package on the command line to discover and filter the set of tools that are exposed by the
MCP Server. This can be helpful for large APIs where including all endpoints at once is too much for your AI's
context window.

You can filter by multiple aspects:

- `--tool` includes a specific tool by name
- `--resource` includes all tools under a specific resource, and can have wildcards, e.g. `my.resource*`
- `--operation` includes just read (get/list) or just write operations

### Dynamic tools

If you specify `--tools=dynamic` to the MCP server, instead of exposing one tool per endpoint in the API, it will
expose the following tools:

1. `list_api_endpoints` - Discovers available endpoints, with optional filtering by search query
2. `get_api_endpoint_schema` - Gets detailed schema information for a specific endpoint
3. `invoke_api_endpoint` - Executes any endpoint with the appropriate parameters

This allows you to have the full set of API endpoints available to your MCP Client, while not requiring that all
of their schemas be loaded into context at once. Instead, the LLM will automatically use these tools together to
search for, look up, and invoke endpoints dynamically. However, due to the indirect nature of the schemas, it
can struggle to provide the correct properties a bit more than when tools are imported explicitly. Therefore,
you can opt-in to explicit tools, the dynamic tools, or both.

See more information with `--help`.

All of these command-line options can be repeated, combined together, and have corresponding exclusion versions (e.g. `--no-tool`).

Use `--list` to see the list of available tools, or see below.

### Specifying the MCP Client

Different clients have varying abilities to handle arbitrary tools and schemas.

You can specify the client you are using with the `--client` argument, and the MCP server will automatically
serve tools and schemas that are more compatible with that client.

- `--client=<type>`: Set all capabilities based on a known MCP client

  - Valid values: `openai-agents`, `claude`, `claude-code`, `cursor`
  - Example: `--client=cursor`

Additionally, if you have a client not on the above list, or the client has gotten better
over time, you can manually enable or disable certain capabilities:

- `--capability=<name>`: Specify individual client capabilities
  - Available capabilities:
    - `top-level-unions`: Enable support for top-level unions in tool schemas
    - `valid-json`: Enable JSON string parsing for arguments
    - `refs`: Enable support for $ref pointers in schemas
    - `unions`: Enable support for union types (anyOf) in schemas
    - `formats`: Enable support for format validations in schemas (e.g. date-time, email)
    - `tool-name-length=N`: Set maximum tool name length to N characters
  - Example: `--capability=top-level-unions --capability=tool-name-length=40`
  - Example: `--capability=top-level-unions,tool-name-length=40`

### Examples

1. Filter for read operations on cards:

```bash
--resource=cards --operation=read
```

2. Exclude specific tools while including others:

```bash
--resource=cards --no-tool=create_cards
```

3. Configure for Cursor client with custom max tool name length:

```bash
--client=cursor --capability=tool-name-length=40
```

4. Complex filtering with multiple criteria:

```bash
--resource=cards,accounts --operation=read --tag=kyc --no-tool=create_cards
```

## Importing the tools and server individually

```js
// Import the server, generated endpoints, or the init function
import { server, endpoints, init } from "gumnut-mcp/server";

// import a specific tool
import createAPIKeys from "gumnut-mcp/tools/api-keys/create-api-keys";

// initialize the server and all endpoints
init({ server, endpoints });

// manually start server
const transport = new StdioServerTransport();
await server.connect(transport);

// or initialize your own server with specific tools
const myServer = new McpServer(...);

// define your own endpoint
const myCustomEndpoint = {
  tool: {
    name: 'my_custom_tool',
    description: 'My custom tool',
    inputSchema: zodToJsonSchema(z.object({ a_property: z.string() })),
  },
  handler: async (client: client, args: any) => {
    return { myResponse: 'Hello world!' };
  })
};

// initialize the server with your custom endpoints
init({ server: myServer, endpoints: [createAPIKeys, myCustomEndpoint] });
```

## Available Tools

The following tools are available in this MCP server.

### Resource `api-keys`:

- `create_api_keys` (`write`): Creates a new API key for the current user
- `update_api_keys` (`write`): Updates the name of a specific API key
- `list_api_keys` (`read`): Retrieves a list of all API keys for the current user
- `delete_api_keys` (`write`): Deletes a specific API key

### Resource `assets`:

- `create_assets` (`write`): Uploads a new asset file (image or video) along with its metadata. If an asset with the same checksum already exists, returns the existing asset's metadata.
- `retrieve_assets` (`read`): Retrieves detailed metadata for a specific asset, including EXIF information and asset metrics.
- `list_assets` (`read`): Retrieves a paginated list of assets, optionally filtered by album. Assets are ordered by local creation time, descending.
- `delete_assets` (`write`): Deletes a specific asset and its associated data (including the file from storage).
- `download_assets` (`read`): Downloads the original file for a specific asset.
- `download_thumbnail_assets` (`read`): Downloads a thumbnail for a specific asset. The exact thumbnail returned depends on availability and the optional `size` parameter.

### Resource `albums`:

- `create_albums` (`write`): Creates a new, empty album with a optional name and description. If no name is provided, the album will be given a default name.
- `retrieve_albums` (`read`): Retrieves details for a specific album.
- `update_albums` (`write`): Updates the name and/or description of a specific album.
- `list_albums` (`read`): Retrieves a paginated list of albums, ordered by creation time, descending.
- `delete_albums` (`write`): Deletes a specific album. Note: This does not delete the assets within the album.

### Resource `albums.assets`:

- `list_albums_assets` (`read`): Retrieves a list of all assets contained within a specific album.
- `add_albums_assets` (`write`): Adds one or more existing assets to a specific album. Duplicate assets are ignored. Returns the IDs of the assets that were added and the IDs of the assets that were already in the album.
- `remove_albums_assets` (`write`): Removes one or more assets from a specific album. Note: This does not delete the assets themselves.

### Resource `faces`:

- `retrieve_faces` (`read`): Retrieves details for a specific face.
- `update_faces` (`write`): Updates the details of a specific face, currently only supporting associating/disassociating with a person.
- `list_faces` (`read`): Retrieves a paginated list of faces, optionally filtered by asset or person, ordered by creation time, descending.
- `delete_faces` (`write`): Deletes a specific face entry. This does not delete the associated asset or person.
- `download_thumbnail_faces` (`read`): Retrieves a thumbnail for a specific face.

### Resource `people`:

- `create_people` (`write`): Creates a new person entry.
- `retrieve_people` (`read`): Retrieves details for a specific person.
- `update_people` (`write`): Updates the details of a specific person.
- `list_people` (`read`): Retrieves a paginated list of people, ordered by creation time, descending.
- `delete_people` (`write`): Deletes a specific person. Associated faces will have their person_id set to the closest matching person, or null if no one matches.

### Resource `search`:

- `search_search` (`read`): Searches for assets using semantic similarity and/or metadata filters. At least one search criterion must be provided.
