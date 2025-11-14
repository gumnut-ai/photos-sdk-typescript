// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, Endpoint, HandlerFunction } from './types';

export { Metadata, Endpoint, HandlerFunction };

import create_api_keys from './api-keys/create-api-keys';
import update_api_keys from './api-keys/update-api-keys';
import list_api_keys from './api-keys/list-api-keys';
import delete_api_keys from './api-keys/delete-api-keys';
import create_assets from './assets/create-assets';
import retrieve_assets from './assets/retrieve-assets';
import list_assets from './assets/list-assets';
import delete_assets from './assets/delete-assets';
import download_assets from './assets/download-assets';
import download_thumbnail_assets from './assets/download-thumbnail-assets';
import create_albums from './albums/create-albums';
import retrieve_albums from './albums/retrieve-albums';
import update_albums from './albums/update-albums';
import list_albums from './albums/list-albums';
import delete_albums from './albums/delete-albums';
import list_albums_assets from './albums/assets/list-albums-assets';
import add_albums_assets from './albums/assets/add-albums-assets';
import remove_albums_assets from './albums/assets/remove-albums-assets';
import retrieve_faces from './faces/retrieve-faces';
import update_faces from './faces/update-faces';
import list_faces from './faces/list-faces';
import delete_faces from './faces/delete-faces';
import download_thumbnail_faces from './faces/download-thumbnail-faces';
import create_libraries from './libraries/create-libraries';
import retrieve_libraries from './libraries/retrieve-libraries';
import update_libraries from './libraries/update-libraries';
import list_libraries from './libraries/list-libraries';
import delete_libraries from './libraries/delete-libraries';
import auth_url_oauth from './oauth/auth-url-oauth';
import exchange_oauth from './oauth/exchange-oauth';
import create_people from './people/create-people';
import retrieve_people from './people/retrieve-people';
import update_people from './people/update-people';
import list_people from './people/list-people';
import delete_people from './people/delete-people';
import search_search from './search/search-search';
import search_assets_search from './search/search-assets-search';
import me_users from './users/me-users';

export const endpoints: Endpoint[] = [];

function addEndpoint(endpoint: Endpoint) {
  endpoints.push(endpoint);
}

addEndpoint(create_api_keys);
addEndpoint(update_api_keys);
addEndpoint(list_api_keys);
addEndpoint(delete_api_keys);
addEndpoint(create_assets);
addEndpoint(retrieve_assets);
addEndpoint(list_assets);
addEndpoint(delete_assets);
addEndpoint(download_assets);
addEndpoint(download_thumbnail_assets);
addEndpoint(create_albums);
addEndpoint(retrieve_albums);
addEndpoint(update_albums);
addEndpoint(list_albums);
addEndpoint(delete_albums);
addEndpoint(list_albums_assets);
addEndpoint(add_albums_assets);
addEndpoint(remove_albums_assets);
addEndpoint(retrieve_faces);
addEndpoint(update_faces);
addEndpoint(list_faces);
addEndpoint(delete_faces);
addEndpoint(download_thumbnail_faces);
addEndpoint(create_libraries);
addEndpoint(retrieve_libraries);
addEndpoint(update_libraries);
addEndpoint(list_libraries);
addEndpoint(delete_libraries);
addEndpoint(auth_url_oauth);
addEndpoint(exchange_oauth);
addEndpoint(create_people);
addEndpoint(retrieve_people);
addEndpoint(update_people);
addEndpoint(list_people);
addEndpoint(delete_people);
addEndpoint(search_search);
addEndpoint(search_assets_search);
addEndpoint(me_users);

export type Filter = {
  type: 'resource' | 'operation' | 'tag' | 'tool';
  op: 'include' | 'exclude';
  value: string;
};

export function query(filters: Filter[], endpoints: Endpoint[]): Endpoint[] {
  const allExcludes = filters.length > 0 && filters.every((filter) => filter.op === 'exclude');
  const unmatchedFilters = new Set(filters);

  const filtered = endpoints.filter((endpoint: Endpoint) => {
    let included = false || allExcludes;

    for (const filter of filters) {
      if (match(filter, endpoint)) {
        unmatchedFilters.delete(filter);
        included = filter.op === 'include';
      }
    }

    return included;
  });

  // Check if any filters didn't match
  const unmatched = Array.from(unmatchedFilters).filter((f) => f.type === 'tool' || f.type === 'resource');
  if (unmatched.length > 0) {
    throw new Error(
      `The following filters did not match any endpoints: ${unmatched
        .map((f) => `${f.type}=${f.value}`)
        .join(', ')}`,
    );
  }

  return filtered;
}

function match({ type, value }: Filter, endpoint: Endpoint): boolean {
  switch (type) {
    case 'resource': {
      const regexStr = '^' + normalizeResource(value).replace(/\*/g, '.*') + '$';
      const regex = new RegExp(regexStr);
      return regex.test(normalizeResource(endpoint.metadata.resource));
    }
    case 'operation':
      return endpoint.metadata.operation === value;
    case 'tag':
      return endpoint.metadata.tags.includes(value);
    case 'tool':
      return endpoint.tool.name === value;
  }
}

function normalizeResource(resource: string): string {
  return resource.toLowerCase().replace(/[^a-z.*\-_]*/g, '');
}
