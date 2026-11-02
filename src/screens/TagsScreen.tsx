import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';

export function TagsScreen() {
  const sampleTags = [
    'Aniversário Dany',
    'Campos do Jordão',
    'Família',
    'Viagem',
    'Natureza',
    'Praia',
    'Amigos',
    'Trabalho',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Gestão de Tags</Text>
          <Text style={styles.subtitle}>Crie, edite ou exclua tags para suas fotos</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
          onPress={() => alert('Criar nova tag')}
        >
          <Text style={styles.addButtonText}>+ Nova</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {sampleTags.map((tag) => (
          <View key={tag} style={styles.tagCard}>
            <View style={styles.tagInfo}>
              <Text style={styles.tagIcon}>🏷️</Text>
              <Text style={styles.tagName}>{tag}</Text>
            </View>
            <View style={styles.tagActions}>
              <Pressable
                style={styles.actionBtn}
                onPress={() => alert(`Editar ${tag}`)}
              >
                <Text style={styles.editIcon}>✏️</Text>
              </Pressable>
              <Pressable
                style={styles.actionBtn}
                onPress={() => alert(`Excluir ${tag}`)}
              >
                <Text style={styles.deleteIcon}>🗑️</Text>
              </Pressable>
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
  tagActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    padding: 4,
  },
  editIcon: {
    fontSize: 16,
  },
  deleteIcon: {
    fontSize: 16,
  },
});

