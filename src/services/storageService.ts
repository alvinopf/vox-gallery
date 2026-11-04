import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  CUSTOM_TAGS: '@vox_gallery_custom_tags',
  PHOTO_TAGS: '@vox_gallery_photo_tags',
  FOLDER_TAGS: '@vox_gallery_folder_tags',
};

export async function getStoredTags(defaultTags: string[]): Promise<string[]> {
  try {
    const json = await AsyncStorage.getItem(KEYS.CUSTOM_TAGS);
    if (!json) {
      await AsyncStorage.setItem(KEYS.CUSTOM_TAGS, JSON.stringify(defaultTags));
      return defaultTags;
    }
    return JSON.parse(json);
  } catch {
    return defaultTags;
  }
}

export async function storeTags(tags: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.CUSTOM_TAGS, JSON.stringify(tags));
  } catch {}
}

export async function getPhotoTagsMap(): Promise<Record<string, string[]>> {
  try {
    const json = await AsyncStorage.getItem(KEYS.PHOTO_TAGS);
    return json ? JSON.parse(json) : {};
  } catch {
    return {};
  }
}

export async function storePhotoTags(photoId: string, tags: string[]): Promise<void> {
  try {
    const currentMap = await getPhotoTagsMap();
    currentMap[photoId] = tags;
    await AsyncStorage.setItem(KEYS.PHOTO_TAGS, JSON.stringify(currentMap));
  } catch {}
}

export async function getFolderTagsMap(): Promise<Record<string, string[]>> {
  try {
    const json = await AsyncStorage.getItem(KEYS.FOLDER_TAGS);
    return json ? JSON.parse(json) : {};
  } catch {
    return {};
  }
}

export async function storeFolderTags(folderId: string, tags: string[]): Promise<void> {
  try {
    const currentMap = await getFolderTagsMap();
    currentMap[folderId] = tags;
    await AsyncStorage.setItem(KEYS.FOLDER_TAGS, JSON.stringify(currentMap));
  } catch {}
}
