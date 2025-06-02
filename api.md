# Assets

Types:

- <code><a href="./src/resources/assets.ts">AssetResponse</a></code>

Methods:

- <code title="post /api/assets">client.assets.<a href="./src/resources/assets.ts">create</a>({ ...params }) -> AssetResponse</code>
- <code title="get /api/assets/{asset_id}">client.assets.<a href="./src/resources/assets.ts">retrieve</a>(assetID) -> AssetResponse</code>
- <code title="get /api/assets">client.assets.<a href="./src/resources/assets.ts">list</a>({ ...params }) -> AssetResponsesCursorPage</code>
- <code title="delete /api/assets/{asset_id}">client.assets.<a href="./src/resources/assets.ts">delete</a>(assetID) -> void</code>
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

## Assets

Types:

- <code><a href="./src/resources/albums/assets.ts">AlbumAssetAssociation</a></code>
- <code><a href="./src/resources/albums/assets.ts">AssetListResponse</a></code>

Methods:

- <code title="get /api/albums/{album_id}/assets">client.albums.assets.<a href="./src/resources/albums/assets.ts">list</a>(albumID) -> AssetListResponse</code>
- <code title="post /api/albums/{album_id}/assets">client.albums.assets.<a href="./src/resources/albums/assets.ts">add</a>(albumID, { ...params }) -> void</code>
- <code title="delete /api/albums/{album_id}/assets">client.albums.assets.<a href="./src/resources/albums/assets.ts">remove</a>(albumID, { ...params }) -> void</code>

# Faces

Types:

- <code><a href="./src/resources/faces.ts">FaceResponse</a></code>

Methods:

- <code title="get /api/faces/{face_id}">client.faces.<a href="./src/resources/faces.ts">retrieve</a>(faceID) -> FaceResponse</code>
- <code title="patch /api/faces/{face_id}">client.faces.<a href="./src/resources/faces.ts">update</a>(faceID, { ...params }) -> FaceResponse</code>
- <code title="get /api/faces">client.faces.<a href="./src/resources/faces.ts">list</a>({ ...params }) -> FaceResponsesCursorPage</code>
- <code title="delete /api/faces/{face_id}">client.faces.<a href="./src/resources/faces.ts">delete</a>(faceID) -> void</code>
- <code title="get /api/faces/{face_id}/thumbnail">client.faces.<a href="./src/resources/faces.ts">downloadThumbnail</a>(faceID) -> Response</code>

# People

Types:

- <code><a href="./src/resources/people.ts">PersonResponse</a></code>

Methods:

- <code title="post /api/people">client.people.<a href="./src/resources/people.ts">create</a>({ ...params }) -> PersonResponse</code>
- <code title="get /api/people/{person_id}">client.people.<a href="./src/resources/people.ts">retrieve</a>(personID) -> PersonResponse</code>
- <code title="patch /api/people/{person_id}">client.people.<a href="./src/resources/people.ts">update</a>(personID, { ...params }) -> PersonResponse</code>
- <code title="get /api/people">client.people.<a href="./src/resources/people.ts">list</a>({ ...params }) -> PersonResponsesCursorPage</code>
- <code title="delete /api/people/{person_id}">client.people.<a href="./src/resources/people.ts">delete</a>(personID) -> void</code>

# Search

Types:

- <code><a href="./src/resources/search.ts">SearchResponse</a></code>

Methods:

- <code title="get /api/search">client.search.<a href="./src/resources/search.ts">search</a>({ ...params }) -> SearchResponse</code>
