import { api } from './api';

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
}

const mockFolders: Folder[] = [
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
  {
    id: 'praia-ubatuba',
    name: 'Praia e Litoral',
    photoCount: 2,
    icon: '🏖️',
    tags: ['Praia', 'Verão', 'Natureza'],
    photos: [
      {
        id: 'pr-1',
        title: 'Pôr do Sol na Praia',
        uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
        tags: ['Praia', 'Pôr do Sol', 'Natureza'],
        date: '15/01/2026',
        location: 'Litoral, PB',
      },
      {
        id: 'pr-2',
        title: 'Caminhada na Areia',
        uri: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600',
        tags: ['Praia', 'Dany', 'Alvino'],
        date: '15/01/2026',
        location: 'Litoral, PB',
      },
    ],
  },
  {
    id: 'pets-gatos',
    name: 'Gatos e Pets',
    photoCount: 2,
    icon: '🐾',
    tags: ['Pets', 'Gatos'],
    photos: [
      {
        id: 'pt-1',
        title: 'Gato Dormindo',
        uri: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600',
        tags: ['Pets', 'Gatos', 'Fofura'],
        date: '10/05/2026',
      },
      {
        id: 'pt-2',
        title: 'Brincando na Sala',
        uri: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600',
        tags: ['Pets', 'Gatos'],
        date: '12/05/2026',
      },
    ],
  },
];

export async function getFolders(simulateError = false): Promise<Folder[]> {
  if (simulateError) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    throw new Error('Falha ao conectar com o serviço de mídia.');
  }

  try {
    await api.get('/posts/1');
  } catch (err) {
  }

  await new Promise((resolve) => setTimeout(resolve, 600));
  return mockFolders;
}

export async function getFolderById(id: string): Promise<Folder | undefined> {
  const folders = await getFolders();
  return folders.find((f) => f.id === id);
}

export async function addTagToFolder(folderId: string, newTag: string): Promise<boolean> {
  const folder = mockFolders.find((f) => f.id === folderId);
  if (!folder) return false;
  if (!folder.tags.includes(newTag)) {
    folder.tags.push(newTag);
  }
  folder.photos.forEach((photo) => {
    if (!photo.tags.includes(newTag)) {
      photo.tags.push(newTag);
    }
  });
  return true;
}
