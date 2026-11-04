import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Modal } from 'react-native';
import { getStoredTags, storeTags } from '../services/storageService';

const defaultTagsList = [
  'Aniversário Dany',
  'Campos do Jordão',
  'Família',
  'Viagem',
  'Natureza',
  'Praia',
  'Amigos',
  'Trabalho',
];

export function TagsScreen() {
  const [tags, setTags] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newTagText, setNewTagText] = useState<string>('');

  useEffect(() => {
    async function loadTags() {
      const stored = await getStoredTags(defaultTagsList);
      setTags(stored);
    }
    loadTags();
  }, []);

  async function handleAddTag() {
    const trimmed = newTagText.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const updated = [...tags, trimmed];
      setTags(updated);
      await storeTags(updated);
      setNewTagText('');
      setModalVisible(false);
    }
  }

  async function handleDeleteTag(tagToDelete: string) {
    const updated = tags.filter((tag) => tag !== tagToDelete);
    setTags(updated);
    await storeTags(updated);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Gestão de Tags</Text>
          <Text style={styles.subtitle}>Total de {tags.length} etiquetas salvas no disco</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Nova</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {tags.map((tag) => (
          <View key={tag} style={styles.tagCard}>
            <View style={styles.tagInfo}>
              <Text style={styles.tagIcon}>🏷️</Text>
              <Text style={styles.tagName}>{tag}</Text>
            </View>
            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDeleteTag(tag)}
            >
              <Text style={styles.deleteText}>🗑️ Excluir</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Tag</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da tag (ex: Formatura)"
              value={newTagText}
              onChangeText={setNewTagText}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => {
                  setNewTagText('');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.confirmBtn]}
                onPress={handleAddTag}
              >
                <Text style={styles.confirmText}>Adicionar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F2942',
  },
  subtitle: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#1E6091',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  addButtonPressed: {
    backgroundColor: '#184E77',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  listContainer: {
    paddingBottom: 24,
    gap: 10,
  },
  tagCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tagIcon: {
    fontSize: 18,
  },
  tagName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#FFF5F5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FEB2B2',
  },
  deleteText: {
    fontSize: 12,
    color: '#E53E3E',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F2942',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  cancelBtn: {
    backgroundColor: '#EDF2F7',
  },
  confirmBtn: {
    backgroundColor: '#1E6091',
  },
  cancelText: {
    color: '#4A5568',
    fontWeight: '600',
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
