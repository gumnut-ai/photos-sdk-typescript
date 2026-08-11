# Shared

Types:

- <code><a href="./src/resources/shared.ts">AssetVariant</a></code>

# APIKeys

Types:

- <code><a href="./src/resources/api-keys.ts">APIKeyResponse</a></code>
- <code><a href="./src/resources/api-keys.ts">APIKeyCreateResponse</a></code>
- <code><a href="./src/resources/api-keys.ts">APIKeyListResponse</a></code>
- <code><a href="./src/resources/api-keys.ts">APIKeyDeleteResponse</a></code>

Methods:

- <code title="post /api/api-keys/">client.apiKeys.<a href="./src/resources/api-keys.ts">create</a>({ ...params }) -> APIKeyCreateResponse</code>
- <code title="patch /api/api-keys/{key_id}">client.apiKeys.<a href="./src/resources/api-keys.ts">update</a>(keyID, { ...params }) -> APIKeyResponse</code>
- <code title="get /api/api-keys/">client.apiKeys.<a href="./src/resources/api-keys.ts">list</a>() -> APIKeyListResponse</code>
- <code title="delete /api/api-keys/{key_id}">client.apiKeys.<a href="./src/resources/api-keys.ts">delete</a>(keyID) -> APIKeyDeleteResponse</code>

# Assets

Types:

- <code><a href="./src/resources/assets/assets.ts">AssetCountResponse</a></code>
- <code><a href="./src/resources/assets/assets.ts">AssetExistenceResponse</a></code>
- <code><a href="./src/resources/assets/assets.ts">AssetLiteResponse</a></code>
- <code><a href="./src/resources/assets/assets.ts">AssetResponse</a></code>
- <code><a href="./src/resources/assets/assets.ts">FileDataResponse</a></code>
- <code><a href="./src/resources/assets/assets.ts">MetadataResponse</a></code>
- <code><a href="./src/resources/assets/assets.ts">AssetDeleteResponse</a></code>
- <code><a href="./src/resources/assets/assets.ts">AssetBulkUpdateAssetsResponse</a></code>
- <code><a href="./src/resources/assets/assets.ts">AssetClusterByGeoResponse</a></code>
- <code><a href="./src/resources/assets/assets.ts">AssetDeleteListResponse</a></code>
- <code><a href="./src/resources/assets/assets.ts">AssetEmptyTrashResponse</a></code>
- <code><a href="./src/resources/assets/assets.ts">AssetRestoreResponse</a></code>
- <code><a href="./src/resources/assets/assets.ts">AssetTrashResponse</a></code>

Methods:

- <code title="post /api/assets">client.assets.<a href="./src/resources/assets/assets.ts">create</a>({ ...params }) -> AssetResponse</code>
- <code title="get /api/assets/{asset_id}">client.assets.<a href="./src/resources/assets/assets.ts">retrieve</a>(assetID, { ...params }) -> AssetResponse</code>
- <code title="get /api/assets">client.assets.<a href="./src/resources/assets/assets.ts">list</a>({ ...params }) -> AssetResponsesCursorPage</code>
- <code title="delete /api/assets/{asset_id}">client.assets.<a href="./src/resources/assets/assets.ts">delete</a>(assetID) -> AssetDeleteResponse</code>
- <code title="post /api/assets/bulk-update">client.assets.<a href="./src/resources/assets/assets.ts">bulkUpdateAssets</a>({ ...params }) -> AssetBulkUpdateAssetsResponse</code>
- <code title="post /api/assets/exist">client.assets.<a href="./src/resources/assets/assets.ts">checkExistence</a>({ ...params }) -> AssetExistenceResponse</code>
- <code title="get /api/assets/geo-clusters">client.assets.<a href="./src/resources/assets/assets.ts">clusterByGeo</a>({ ...params }) -> AssetClusterByGeoResponse</code>
- <code title="get /api/assets/counts">client.assets.<a href="./src/resources/assets/assets.ts">counts</a>({ ...params }) -> AssetCountResponse</code>
- <code title="delete /api/assets">client.assets.<a href="./src/resources/assets/assets.ts">deleteList</a>({ ...params }) -> AssetDeleteListResponse</code>
- <code title="post /api/assets/empty-trash">client.assets.<a href="./src/resources/assets/assets.ts">emptyTrash</a>({ ...params }) -> AssetEmptyTrashResponse</code>
- <code title="post /api/assets/restore">client.assets.<a href="./src/resources/assets/assets.ts">restore</a>({ ...params }) -> AssetRestoreResponse</code>
- <code title="post /api/assets/trash">client.assets.<a href="./src/resources/assets/assets.ts">trash</a>({ ...params }) -> AssetTrashResponse</code>
- <code title="patch /api/assets/{asset_id}">client.assets.<a href="./src/resources/assets/assets.ts">updateAsset</a>(assetID, { ...params }) -> AssetResponse</code>

## Versions

Types:

- <code><a href="./src/resources/assets/versions.ts">VersionListResponse</a></code>

Methods:

- <code title="get /api/assets/{asset_id}/versions">client.assets.versions.<a href="./src/resources/assets/versions.ts">list</a>(assetID, { ...params }) -> VersionListResponse</code>
- <code title="delete /api/assets/{asset_id}/versions/{version_id}">client.assets.versions.<a href="./src/resources/assets/versions.ts">delete</a>(versionID, { ...params }) -> AssetResponse</code>
- <code title="post /api/assets/{asset_id}/versions/{version_id}/revert">client.assets.versions.<a href="./src/resources/assets/versions.ts">revert</a>(versionID, { ...params }) -> AssetResponse</code>

# Albums

Types:

- <code><a href="./src/resources/albums/albums.ts">AlbumResponse</a></code>
- <code><a href="./src/resources/albums/albums.ts">AlbumDeleteResponse</a></code>

Methods:

- <code title="post /api/albums">client.albums.<a href="./src/resources/albums/albums.ts">create</a>({ ...params }) -> AlbumResponse</code>
- <code title="get /api/albums/{album_id}">client.albums.<a href="./src/resources/albums/albums.ts">retrieve</a>(albumID) -> AlbumResponse</code>
- <code title="patch /api/albums/{album_id}">client.albums.<a href="./src/resources/albums/albums.ts">update</a>(albumID, { ...params }) -> AlbumResponse</code>
- <code title="get /api/albums">client.albums.<a href="./src/resources/albums/albums.ts">list</a>({ ...params }) -> AlbumResponsesCursorPage</code>
- <code title="delete /api/albums/{album_id}">client.albums.<a href="./src/resources/albums/albums.ts">delete</a>(albumID) -> AlbumDeleteResponse</code>

## AssetsAssociations

Types:

- <code><a href="./src/resources/albums/assets-associations.ts">AlbumAssetAssociation</a></code>
- <code><a href="./src/resources/albums/assets-associations.ts">AssetsAssociationAddResponse</a></code>
- <code><a href="./src/resources/albums/assets-associations.ts">AssetsAssociationRemoveResponse</a></code>

Methods:

- <code title="post /api/albums/{album_id}/assets">client.albums.assetsAssociations.<a href="./src/resources/albums/assets-associations.ts">add</a>(albumID, { ...params }) -> AssetsAssociationAddResponse</code>
- <code title="delete /api/albums/{album_id}/assets">client.albums.assetsAssociations.<a href="./src/resources/albums/assets-associations.ts">remove</a>(albumID, { ...params }) -> AssetsAssociationRemoveResponse</code>

# AlbumAssets

Types:

- <code><a href="./src/resources/album-assets.ts">AlbumAssetResponse</a></code>

Methods:

- <code title="get /api/album-assets">client.albumAssets.<a href="./src/resources/album-assets.ts">list</a>({ ...params }) -> AlbumAssetResponsesCursorPage</code>
- <code title="get /api/album-assets/{album_asset_id}">client.albumAssets.<a href="./src/resources/album-assets.ts">get</a>(albumAssetID) -> AlbumAssetResponse</code>

# Events

Types:

- <code><a href="./src/resources/events.ts">EventsResponse</a></code>

Methods:

- <code title="get /api/events">client.events.<a href="./src/resources/events.ts">get</a>({ ...params }) -> EventsResponse</code>

# Faces

Types:

- <code><a href="./src/resources/faces.ts">ClusterAssignmentResponse</a></code>
- <code><a href="./src/resources/faces.ts">FaceResponse</a></code>
- <code><a href="./src/resources/faces.ts">FaceDeleteResponse</a></code>

Methods:

- <code title="post /api/faces">client.faces.<a href="./src/resources/faces.ts">create</a>({ ...params }) -> FaceResponse</code>
- <code title="get /api/faces/{face_id}">client.faces.<a href="./src/resources/faces.ts">retrieve</a>(faceID, { ...params }) -> FaceResponse</code>
- <code title="patch /api/faces/{face_id}">client.faces.<a href="./src/resources/faces.ts">update</a>(faceID, { ...params }) -> FaceResponse</code>
- <code title="get /api/faces">client.faces.<a href="./src/resources/faces.ts">list</a>({ ...params }) -> FaceResponsesCursorPage</code>
- <code title="delete /api/faces/{face_id}">client.faces.<a href="./src/resources/faces.ts">delete</a>(faceID, { ...params }) -> FaceDeleteResponse</code>

# Libraries

Types:

- <code><a href="./src/resources/libraries.ts">LibraryResponse</a></code>
- <code><a href="./src/resources/libraries.ts">LibraryListResponse</a></code>
- <code><a href="./src/resources/libraries.ts">LibraryDeleteResponse</a></code>
- <code><a href="./src/resources/libraries.ts">LibraryTrashResponse</a></code>

Methods:

- <code title="post /api/libraries">client.libraries.<a href="./src/resources/libraries.ts">create</a>({ ...params }) -> LibraryResponse</code>
- <code title="get /api/libraries/{library_id}">client.libraries.<a href="./src/resources/libraries.ts">retrieve</a>(libraryID) -> LibraryResponse</code>
- <code title="patch /api/libraries/{library_id}">client.libraries.<a href="./src/resources/libraries.ts">update</a>(libraryID, { ...params }) -> LibraryResponse</code>
- <code title="get /api/libraries">client.libraries.<a href="./src/resources/libraries.ts">list</a>({ ...params }) -> LibraryListResponse</code>
- <code title="delete /api/libraries/{library_id}">client.libraries.<a href="./src/resources/libraries.ts">delete</a>(libraryID) -> LibraryDeleteResponse</code>
- <code title="post /api/libraries/{library_id}/restore">client.libraries.<a href="./src/resources/libraries.ts">restore</a>(libraryID) -> LibraryResponse</code>
- <code title="post /api/libraries/{library_id}/trash">client.libraries.<a href="./src/resources/libraries.ts">trash</a>(libraryID) -> LibraryTrashResponse</code>

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

- <code><a href="./src/resources/people.ts">ClusterMetricsResponse</a></code>
- <code><a href="./src/resources/people.ts">PersonResponse</a></code>
- <code><a href="./src/resources/people.ts">PersonDeleteResponse</a></code>

Methods:

- <code title="post /api/people">client.people.<a href="./src/resources/people.ts">create</a>({ ...params }) -> PersonResponse</code>
- <code title="get /api/people/{person_id}">client.people.<a href="./src/resources/people.ts">retrieve</a>(personID, { ...params }) -> PersonResponse</code>
- <code title="patch /api/people/{person_id}">client.people.<a href="./src/resources/people.ts">update</a>(personID, { ...params }) -> PersonResponse</code>
- <code title="get /api/people">client.people.<a href="./src/resources/people.ts">list</a>({ ...params }) -> PersonResponsesCursorPage</code>
- <code title="delete /api/people/{person_id}">client.people.<a href="./src/resources/people.ts">delete</a>(personID) -> PersonDeleteResponse</code>
- <code title="post /api/people/{person_id}/merge">client.people.<a href="./src/resources/people.ts">merge</a>(personID, { ...params }) -> PersonResponse</code>

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

# Stacks

Types:

- <code><a href="./src/resources/stacks.ts">StackDeleteResponse</a></code>
- <code><a href="./src/resources/stacks.ts">StackAddAssetsToStackResponse</a></code>
- <code><a href="./src/resources/stacks.ts">StackCreateStackResponse</a></code>
- <code><a href="./src/resources/stacks.ts">StackListStacksResponse</a></code>
- <code><a href="./src/resources/stacks.ts">StackRemoveAssetsResponse</a></code>
- <code><a href="./src/resources/stacks.ts">StackRetrieveStackResponse</a></code>
- <code><a href="./src/resources/stacks.ts">StackSetCoverResponse</a></code>

Methods:

- <code title="delete /api/stacks/{stack_id}">client.stacks.<a href="./src/resources/stacks.ts">delete</a>(stackID) -> StackDeleteResponse</code>
- <code title="post /api/stacks/{stack_id}/assets">client.stacks.<a href="./src/resources/stacks.ts">addAssetsToStack</a>(stackID, { ...params }) -> StackAddAssetsToStackResponse</code>
- <code title="post /api/stacks">client.stacks.<a href="./src/resources/stacks.ts">createStack</a>({ ...params }) -> StackCreateStackResponse</code>
- <code title="get /api/stacks">client.stacks.<a href="./src/resources/stacks.ts">listStacks</a>({ ...params }) -> StackListStacksResponsesCursorPage</code>
- <code title="delete /api/stacks/{stack_id}/assets">client.stacks.<a href="./src/resources/stacks.ts">removeAssets</a>(stackID, { ...params }) -> StackRemoveAssetsResponse</code>
- <code title="get /api/stacks/{stack_id}">client.stacks.<a href="./src/resources/stacks.ts">retrieveStack</a>(stackID) -> StackRetrieveStackResponse</code>
- <code title="patch /api/stacks/{stack_id}">client.stacks.<a href="./src/resources/stacks.ts">setCover</a>(stackID, { ...params }) -> StackSetCoverResponse</code>

# Tasks

Types:

- <code><a href="./src/resources/tasks.ts">TaskListResponse</a></code>
- <code><a href="./src/resources/tasks.ts">TaskGetResponse</a></code>
- <code><a href="./src/resources/tasks.ts">TaskListForAssetResponse</a></code>

Methods:

- <code title="get /api/tasks/">client.tasks.<a href="./src/resources/tasks.ts">list</a>({ ...params }) -> TaskListResponse</code>
- <code title="get /api/tasks/{task_id}">client.tasks.<a href="./src/resources/tasks.ts">get</a>(taskID) -> TaskGetResponse</code>
- <code title="get /api/tasks/asset/{asset_id}">client.tasks.<a href="./src/resources/tasks.ts">listForAsset</a>(assetID) -> TaskListForAssetResponse</code>

# Users

Types:

- <code><a href="./src/resources/users.ts">UserResponse</a></code>

Methods:

- <code title="get /api/users/me">client.users.<a href="./src/resources/users.ts">me</a>() -> UserResponse</code>
