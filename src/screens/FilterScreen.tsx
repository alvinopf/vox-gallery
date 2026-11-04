import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { getFolders, Photo } from '../services/folderService';

export function FilterScreen() {
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Campos do Jordão']);

  useEffect(() => {
    async function loadData() {
      const folders = await getFolders();
      const photos: Photo[] = [];
      const tagsSet = new Set<string>();

      folders.forEach((f) => {
        f.photos.forEach((p) => {
          photos.push(p);
          p.tags.forEach((t) => tagsSet.add(t));
        });
      });

      setAllPhotos(photos);
      setAvailableTags(Array.from(tagsSet));
    }
    loadData();
  }, []);

  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  const filteredPhotos = allPhotos.filter((photo) => {
    if (selectedTags.length === 0) return true;
    return selectedTags.some((tag) => photo.tags.includes(tag));
  });

  return (
    <View style={styles.container}>
      <View style={styles.filterCard}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filtrar por Tags</Text>
          <Pressable onPress={() => setSelectedTags([])}>
            <Text style={styles.clearBtnText}>Limpar</Text>
          </Pressable>
        </View>

        <View style={styles.checkboxGrid}>
          {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <Pressable
                key={tag}
                style={[styles.checkboxItem, isSelected && styles.checkboxItemSelected]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={styles.checkboxCheck}>{isSelected ? '☑' : '☐'}</Text>
                <Text style={[styles.checkboxLabel, isSelected && styles.checkboxLabelSelected]}>
                  {tag}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.activeFilterNotice}>
        <Text style={styles.activeFilterText}>
          {selectedTags.length > 0
            ? `Exibindo ${filteredPhotos.length} fotos para: ${selectedTags.join(', ')}`
            : `Exibindo todas as ${filteredPhotos.length} fotos`}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.galleryGrid}>
        {filteredPhotos.map((photo) => (
          <View key={photo.id} style={styles.photoItem}>
            <Image source={{ uri: photo.uri }} style={styles.photoThumb} />
            <View style={styles.photoInfo}>
              <Text style={styles.photoCaption} numberOfLines={1}>{photo.title}</Text>
              <Text style={styles.photoDate}>{photo.date}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
    padding: 16,
  },
  filterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F2942',
  },
  clearBtnText: {
    fontSize: 12,
    color: '#3182CE',
    fontWeight: '600',
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF2F7',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  checkboxItemSelected: {
    backgroundColor: '#EBF8FF',
    borderColor: '#3182CE',
    borderWidth: 1,
  },
  checkboxCheck: {
    fontSize: 14,
    marginRight: 6,
    color: '#3182CE',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#4A5568',
  },
  checkboxLabelSelected: {
    color: '#2B6CB0',
    fontWeight: 'bold',
  },
  activeFilterNotice: {
    backgroundColor: '#E2E8F0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  activeFilterText: {
    fontSize: 12,
    color: '#2D3748',
    fontWeight: '500',
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    paddingBottom: 20,
  },
  photoItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CBD5E0',
    elevation: 2,
  },
  photoThumb: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  photoInfo: {
    padding: 8,
  },
  photoCaption: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D3748',
  },
  photoDate: {
    fontSize: 11,
    color: '#718096',
    marginTop: 2,
  },
});