import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';

export function FilterScreen() {
  const availableTags = [
    'Aniversário Dany',
    'Campos do Jordão',
    'Família',
    'Gatos',
    'Natureza',
    'Raissa',
  ];

  const [selectedTags, setSelectedTags] = useState<string[]>(['Campos do Jordão']);

  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterCard}>
        <Text style={styles.filterTitle}>Filtrar por Tags</Text>
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
          Exibindo fotos para: {selectedTags.length > 0 ? selectedTags.join(', ') : 'Todas'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.galleryGrid}>
        <View style={styles.photoItem}>
          <Text style={styles.photoThumb}>🏞️</Text>
          <Text style={styles.photoCaption}>Campos #1</Text>
        </View>
        <View style={styles.photoItem}>
          <Text style={styles.photoThumb}>🌲</Text>
          <Text style={styles.photoCaption}>Campos #2</Text>
        </View>
        <View style={styles.photoItem}>
          <Text style={styles.photoThumb}>🚠</Text>
          <Text style={styles.photoCaption}>Bondinho</Text>
        </View>
        <View style={styles.photoItem}>
          <Text style={styles.photoThumb}>☕</Text>
          <Text style={styles.photoCaption}>Café da tarde</Text>
        </View>
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
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F2942',
    marginBottom: 12,
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
  },
  photoItem: {
    width: '48%',
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E0',
  },
  photoThumb: {
    fontSize: 36,
    marginBottom: 4,
  },
  photoCaption: {
    fontSize: 12,
    color: '#718096',
  },
});

