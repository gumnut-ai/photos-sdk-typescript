# APIKeys

Types:

- <code><a href="./src/resources/api-keys.ts">APIKeyResponse</a></code>
- <code><a href="./src/resources/api-keys.ts">APIKeyCreateResponse</a></code>
- <code><a href="./src/resources/api-keys.ts">APIKeyListResponse</a></code>

Methods:

- <code title="post /api-keys/">client.apiKeys.<a href="./src/resources/api-keys.ts">create</a>({ ...params }) -> APIKeyCreateResponse</code>
- <code title="patch /api-keys/{key_id}">client.apiKeys.<a href="./src/resources/api-keys.ts">update</a>(keyID, { ...params }) -> APIKeyResponse</code>
- <code title="get /api-keys/">client.apiKeys.<a href="./src/resources/api-keys.ts">list</a>() -> APIKeyListResponse</code>
- <code title="delete /api-keys/{key_id}">client.apiKeys.<a href="./src/resources/api-keys.ts">delete</a>(keyID) -> void</code>

# Assets

Types:

- <code><a href="./src/resources/assets.ts">AssetCountResponse</a></code>
- <code><a href="./src/resources/assets.ts">AssetExistenceResponse</a></code>
- <code><a href="./src/resources/assets.ts">AssetLiteResponse</a></code>
- <code><a href="./src/resources/assets.ts">AssetResponse</a></code>

Methods:

- <code title="post /api/assets">client.assets.<a href="./src/resources/assets.ts">create</a>({ ...params }) -> AssetResponse</code>
- <code title="get /api/assets/{asset_id}">client.assets.<a href="./src/resources/assets.ts">retrieve</a>(assetID) -> AssetResponse</code>
- <code title="get /api/assets">client.assets.<a href="./src/resources/assets.ts">list</a>({ ...params }) -> AssetResponsesCursorPage</code>
- <code title="delete /api/assets/{asset_id}">client.assets.<a href="./src/resources/assets.ts">delete</a>(assetID) -> void</code>
- <code title="post /api/assets/exist">client.assets.<a href="./src/resources/assets.ts">checkExistence</a>({ ...params }) -> AssetExistenceResponse</code>
- <code title="get /api/assets/counts">client.assets.<a href="./src/resources/assets.ts">counts</a>({ ...params }) -> AssetCountResponse</code>
- <code title="get /api/assets/{asset_id}/download">client.assets.<a href="./src/resources/assets.ts">download</a>(assetID) -> Response</code>
- <code title="get /api/assets/{asset_id}/thumbnail">client.assets.<a href="./src/resources/assets.ts">downloadThumbnail</a>(assetID, { ...params }) -> Response</code>

# Albums

Types:

- <code><a href="./src/resources/albums/albums.ts">AlbumResponse</a></code>

Methods:

- <code title="post /api/albums">client.albums.<a href="./src/resources/albums/albums.ts">create</a>({ ...params }) -> AlbumResponse</code>
- <code title="get /api/albums/{album_id}">client.albums.<a href="./src/resources/albums/albums.ts">retrieve</a>(albumID) -> AlbumResponse</code>
- <code title="patch /api/albums/{album_id}">client.albums.<a href="./src/resources/albums/albums.ts">update</a>(albumID, { ...params }) -> AlbumResponse</code>
- <code title="get /api/albums">client.albums.<a href="./src/resources/albums/albums.ts">list</a>({ ...params }) -> AlbumResponsesCursorPage</code>
- <code title="delete /api/albums/{album_id}">client.albums.<a href="./src/resources/albums/albums.ts">delete</a>(albumID) -> void</code>

## AssetsAssociations

Types:

- <code><a href="./src/resources/albums/assets-associations.ts">AlbumAssetAssociation</a></code>
- <code><a href="./src/resources/albums/assets-associations.ts">AssetsAssociationListResponse</a></code>
- <code><a href="./src/resources/albums/assets-associations.ts">AssetsAssociationAddResponse</a></code>

Methods:

- <code title="get /api/albums/{album_id}/assets">client.albums.assetsAssociations.<a href="./src/resources/albums/assets-associations.ts">list</a>(albumID) -> AssetsAssociationListResponse</code>
- <code title="post /api/albums/{album_id}/assets">client.albums.assetsAssociations.<a href="./src/resources/albums/assets-associations.ts">add</a>(albumID, { ...params }) -> AssetsAssociationAddResponse</code>
- <code title="delete /api/albums/{album_id}/assets">client.albums.assetsAssociations.<a href="./src/resources/albums/assets-associations.ts">remove</a>(albumID, { ...params }) -> void</code>

# AlbumAssets

Types:

- <code><a href="./src/resources/album-assets.ts">AlbumAssetResponse</a></code>

Methods:

- <code title="get /api/album-assets">client.albumAssets.<a href="./src/resources/album-assets.ts">list</a>({ ...params }) -> AlbumAssetResponsesCursorPage</code>
- <code title="get /api/album-assets/{album_asset_id}">client.albumAssets.<a href="./src/resources/album-assets.ts">get</a>(albumAssetID) -> AlbumAssetResponse</code>

# Events

Types:

- <code><a href="./src/resources/events.ts">EventsResponse</a></code>
- <code><a href="./src/resources/events.ts">ExifResponse</a></code>

Methods:

- <code title="get /api/events">client.events.<a href="./src/resources/events.ts">get</a>({ ...params }) -> EventsResponse</code>

# Faces

Types:

- <code><a href="./src/resources/faces.ts">FaceResponse</a></code>

Methods:

- <code title="get /api/faces/{face_id}">client.faces.<a href="./src/resources/faces.ts">retrieve</a>(faceID, { ...params }) -> FaceResponse</code>
- <code title="patch /api/faces/{face_id}">client.faces.<a href="./src/resources/faces.ts">update</a>(faceID, { ...params }) -> FaceResponse</code>
- <code title="get /api/faces">client.faces.<a href="./src/resources/faces.ts">list</a>({ ...params }) -> FaceResponsesCursorPage</code>
- <code title="delete /api/faces/{face_id}">client.faces.<a href="./src/resources/faces.ts">delete</a>(faceID, { ...params }) -> void</code>
- <code title="get /api/faces/{face_id}/thumbnail">client.faces.<a href="./src/resources/faces.ts">downloadThumbnail</a>(faceID) -> Response</code>

# Libraries

Types:

- <code><a href="./src/resources/libraries.ts">LibraryResponse</a></code>
- <code><a href="./src/resources/libraries.ts">LibraryListResponse</a></code>

Methods:

- <code title="post /api/libraries">client.libraries.<a href="./src/resources/libraries.ts">create</a>({ ...params }) -> LibraryResponse</code>
- <code title="get /api/libraries/{library_id}">client.libraries.<a href="./src/resources/libraries.ts">retrieve</a>(libraryID) -> LibraryResponse</code>
- <code title="patch /api/libraries/{library_id}">client.libraries.<a href="./src/resources/libraries.ts">update</a>(libraryID, { ...params }) -> LibraryResponse</code>
- <code title="get /api/libraries">client.libraries.<a href="./src/resources/libraries.ts">list</a>() -> LibraryListResponse</code>
- <code title="delete /api/libraries/{library_id}">client.libraries.<a href="./src/resources/libraries.ts">delete</a>(libraryID) -> void</code>

# OAuth

Types:

- <code><a href="./src/resources/oauth.ts">AuthURLResponse</a></code>
- <code><a href="./src/resources/oauth.ts">ExchangeResponse</a></code>
- <code><a href="./src/resources/oauth.ts">LogoutEndpointResponse</a></code>

Methods:

- <code title="get /api/oauth/auth-url">client.oauth.<a href="./src/resources/oauth.ts">authURL</a>({ ...params }) -> AuthURLResponse</code>
- <code title="post /api/oauth/exchange">client.oauth.<a href="./src/resources/oauth.ts">exchange</a>({ ...params }) -> ExchangeResponse</code>
- <code title="get /api/oauth/logout-endpoint">client.oauth.<a href="./src/resources/oauth.ts">logoutEndpoint</a>() -> LogoutEndpointResponse</code>

# People

Types:

- <code><a href="./src/resources/people.ts">PersonResponse</a></code>

Methods:

- <code title="post /api/people">client.people.<a href="./src/resources/people.ts">create</a>({ ...params }) -> PersonResponse</code>
- <code title="get /api/people/{person_id}">client.people.<a href="./src/resources/people.ts">retrieve</a>(personID) -> PersonResponse</code>
- <code title="patch /api/people/{person_id}">client.people.<a href="./src/resources/people.ts">update</a>(personID, { ...params }) -> PersonResponse</code>
- <code title="get /api/people">client.people.<a href="./src/resources/people.ts">list</a>({ ...params }) -> PersonResponsesCursorPage</code>
- <code title="delete /api/people/{person_id}">client.people.<a href="./src/resources/people.ts">delete</a>(personID) -> void</code>

# Ping

Types:

- <code><a href="./src/resources/ping.ts">PingGetResponse</a></code>

Methods:

- <code title="get /api/server/ping">client.ping.<a href="./src/resources/ping.ts">get</a>() -> string</code>

# Search

Types:

- <code><a href="./src/resources/search.ts">SearchResponse</a></code>
- <code><a href="./src/resources/search.ts">SearchResultItem</a></code>

Methods:

- <code title="get /api/search">client.search.<a href="./src/resources/search.ts">search</a>({ ...params }) -> SearchResponse</code>
- <code title="post /api/search">client.search.<a href="./src/resources/search.ts">searchAssets</a>({ ...params }) -> SearchResponse</code>

# Users

Types:

- <code><a href="./src/resources/users.ts">UserResponse</a></code>

Methods:

- <code title="get /api/users/me">client.users.<a href="./src/resources/users.ts">me</a>() -> UserResponse</code>
