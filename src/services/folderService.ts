import * as MediaLibrary from 'expo-media-library';
import { api } from './api';
import {
  getFolderTagsMap,
  getPhotoTagsMap,
  storeFolderTags,
  storePhotoTags,
} from './storageService';

export interface Photo {
  id: string;
  title: string;
  uri: string;
  tags: string[];
  date: string;
  location?: string;
}

export interface Folder {
  id: string;
  name: string;
  photoCount: number;
  icon: string;
  tags: string[];
  photos: Photo[];
  isNativeAlbum?: boolean;
}

const sampleFolders: Folder[] = [
  {
    id: 'campos-2025',
    name: 'Viagem Campos do Jordão',
    photoCount: 4,
    icon: '🏔️',
    tags: ['Campos do Jordão', 'Viagem', 'Frio'],
    photos: [
      {
        id: 'cj-1',
        title: 'Vila Capivari',
        uri: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600',
        tags: ['Campos do Jordão', 'Viagem', 'Dany'],
        date: '18/10/2025',
        location: 'Campos do Jordão, SP',
      },
      {
        id: 'cj-2',
        title: 'Pico do Itapeva',
        uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
        tags: ['Campos do Jordão', 'Natureza'],
        date: '18/10/2025',
        location: 'Campos do Jordão, SP',
      },
      {
        id: 'cj-3',
        title: 'Passeio de Bondinho',
        uri: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600',
        tags: ['Bondinho', 'Campos do Jordão', 'Família'],
        date: '19/10/2025',
        location: 'Campos do Jordão, SP',
      },
      {
        id: 'cj-4',
        title: 'Café da Montanha',
        uri: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600',
        tags: ['Campos do Jordão', 'Café'],
        date: '19/10/2025',
        location: 'Campos do Jordão, SP',
      },
    ],
  },
  {
    id: 'aniver-dany',
    name: 'Aniversário Dany',
    photoCount: 3,
    icon: '🎂',
    tags: ['Aniversário Dany', 'Família', 'Festa'],
    photos: [
      {
        id: 'ad-1',
        title: 'Bolo e Parabéns',
        uri: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600',
        tags: ['Aniversário Dany', 'Dany', 'Festa'],
        date: '25/08/2026',
        location: 'João Pessoa, PB',
      },
      {
        id: 'ad-2',
        title: 'Foto em Família',
        uri: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600',
        tags: ['Aniversário Dany', 'Família', 'Alvino', 'Dany'],
        date: '25/08/2026',
        location: 'João Pessoa, PB',
      },
      {
        id: 'ad-3',
        title: 'Mesa de Doces',
        uri: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600',
        tags: ['Aniversário Dany', 'Doces'],
        date: '25/08/2026',
        location: 'João Pessoa, PB',
      },
    ],
  },
];

let cachedDeviceFolders: Folder[] = [];

export async function requestGalleryPermission(): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted';
}

export async function getFolders(simulateError = false): Promise<Folder[]> {
  if (simulateError) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    throw new Error('Falha ao conectar com o serviço de mídia.');
  }

  try {
    await api.get('/posts/1');
  } catch (err) {}

  const [folderTagsMap, photoTagsMap] = await Promise.all([
    getFolderTagsMap(),
    getPhotoTagsMap(),
  ]);

  const hasPermission = await requestGalleryPermission();
  const realFolders: Folder[] = [];

  if (hasPermission) {
    try {
      const albums = await MediaLibrary.getAlbumsAsync({ includeSmartAlbums: true });
      for (const album of albums.slice(0, 8)) {
        if (album.assetCount > 0) {
          const assets = await MediaLibrary.getAssetsAsync({
            album: album.id,
            mediaType: 'photo',
            first: 20,
          });

          const photos: Photo[] = assets.assets.map((asset, index) => {
            const savedPhotoTags = photoTagsMap[asset.id] || [];
            const dateObj = new Date(asset.creationTime || Date.now());
            const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;

            return {
              id: asset.id,
              title: asset.filename || `Foto #${index + 1}`,
              uri: asset.uri,
              tags: savedPhotoTags,
              date: formattedDate,
              location: 'Dispositivo Local',
            };
          });

          const savedFolderTags = folderTagsMap[album.id] || [];

          realFolders.push({
            id: album.id,
            name: album.title,
            photoCount: album.assetCount,
            icon: '📱',
            tags: savedFolderTags,
            photos,
            isNativeAlbum: true,
          });
        }
      }
    } catch {}
  }

  const baseList = realFolders.length > 0 ? [...realFolders, ...sampleFolders] : sampleFolders;

  const merged = baseList.map((folder) => {
    const savedFolderTags = folderTagsMap[folder.id];
    const updatedTags = savedFolderTags
      ? Array.from(new Set([...folder.tags, ...savedFolderTags]))
      : folder.tags;

    const updatedPhotos = folder.photos.map((photo) => {
      const savedPhotoTags = photoTagsMap[photo.id];
      const mergedTags = savedPhotoTags
        ? Array.from(new Set([...photo.tags, ...savedPhotoTags]))
        : photo.tags;
      return {
        ...photo,
        tags: mergedTags,
      };
    });

    return {
      ...folder,
      tags: updatedTags,
      photos: updatedPhotos,
    };
  });

  cachedDeviceFolders = merged;
  return merged;
}

export async function getFolderById(id: string): Promise<Folder | undefined> {
  if (cachedDeviceFolders.length > 0) {
    const found = cachedDeviceFolders.find((f) => f.id === id);
    if (found) return found;
  }
  const folders = await getFolders();
  return folders.find((f) => f.id === id);
}

export async function addTagToFolder(folderId: string, newTag: string): Promise<boolean> {
  const folders = await getFolders();
  const folder = folders.find((f) => f.id === folderId);
  if (!folder) return false;

  const currentFolderTags = Array.from(new Set([...folder.tags, newTag]));
  await storeFolderTags(folderId, currentFolderTags);

  for (const photo of folder.photos) {
    const updatedPhotoTags = Array.from(new Set([...photo.tags, newTag]));
    await storePhotoTags(photo.id, updatedPhotoTags);
  }

  return true;
}

export async function savePhotoTagsDirectly(photoId: string, tags: string[]): Promise<void> {
  await storePhotoTags(photoId, tags);
}