import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../types/navigation';

export function FoldersScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();

  function handleOpenFolder(folderName: string, folderId: string) {
    navigation.navigate('Swipe', {
      folderId,
      folderName,
      initialPhotoIndex: 0,
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vox Gallery - Pastas</Text>
        <Pressable
          style={({ pressed }) => [styles.voiceFab, pressed && styles.voiceFabPressed]}
          onPress={() => alert('Modo voz para pastas acionado')}
        >
          <Text style={styles.voiceFabText}>🎤 Taguear Pasta</Text>
        </Pressable>
      </View>

      <View style={styles.gridContainer}>
        <Pressable
          style={({ pressed }) => [styles.folderCard, pressed && styles.folderCardPressed]}
          onPress={() => handleOpenFolder('Viagem Campos do Jordão', 'campos-2025')}
        >
          <Text style={styles.folderIcon}>📁</Text>
          <Text style={styles.folderName}>Campos do Jordão</Text>
          <Text style={styles.folderInfo}>34 fotos</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.folderCard, pressed && styles.folderCardPressed]}
          onPress={() => handleOpenFolder('Aniversário Dany', 'aniver-dany')}
        >
          <Text style={styles.folderIcon}>📁</Text>
          <Text style={styles.folderName}>Aniversário Dany</Text>
          <Text style={styles.folderInfo}>112 fotos</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
    padding: 16,
  },
  header: {
    marginBottom: 20,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F2942',
    marginBottom: 12,
  },
  voiceFab: {
    backgroundColor: '#1E6091',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  voiceFabPressed: {
    backgroundColor: '#184E77',
    opacity: 0.9,
  },
  voiceFabText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  folderCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  folderCardPressed: {
    backgroundColor: '#EDF2F7',
  },
  folderIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  folderName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  folderInfo: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
});
