export interface UserFolder {
  id: string;
  name: string;
  resourceIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LocalLibraryState {
  schemaVersion: 1;
  favoriteResourceIds: string[];
  folders: UserFolder[];
}
