import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SwipeScreenRouteProp } from '../types/navigation';

export function SwipeScreen() {
  const route = useRoute<SwipeScreenRouteProp>();
  const navigation = useNavigation();
  const folderName = route.params?.folderName ?? 'Pasta Selecionada';

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹ Voltar</Text>
        </Pressable>
        <Text style={styles.topTitle}>{folderName}</Text>
      </View>

      <View style={styles.photoContainer}>
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoIcon}>🖼️</Text>
          <Text style={styles.photoLabel}>Foto em destaque</Text>
          <Text style={styles.swipeTip}>Deslize para navegar</Text>
        </View>
      </View>

      <View style={styles.tagsSection}>
        <Text style={styles.sectionTitle}>Tags Aplicadas:</Text>
        <View style={styles.tagsRow}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>Campos do Jordão</Text>
          </View>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>Dany</Text>
          </View>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>Viagem</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Pressable
          style={({ pressed }) => [styles.voiceButton, pressed && styles.voiceButtonPressed]}
          onPress={() => alert('Gravação de tag por voz iniciada')}
        >
          <Text style={styles.voiceButtonText}>🎙️ Falar Tag</Text>
        </Pressable>

        <Pressable
          style={styles.manualInputTrigger}
          onPress={() => alert('Abrir modal de tag manual')}
        >
          <Text style={styles.manualInputText}>Ou digite a tag manualmente...</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F2942',
    padding: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 8,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    marginRight: 12,
  },
  backText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  topTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1E3A5F',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D5584',
  },
  photoIcon: {
    fontSize: 54,
    marginBottom: 8,
  },
  photoLabel: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '600',
  },
  swipeTip: {
    color: '#A0AEC0',
    fontSize: 12,
    marginTop: 8,
  },
  tagsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#CBD5E0',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBadge: {
    backgroundColor: '#2B6CB0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  actionsContainer: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  voiceButton: {
    backgroundColor: '#3182CE',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  voiceButtonPressed: {
    backgroundColor: '#2B6CB0',
    opacity: 0.9,
  },
  voiceButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  manualInputTrigger: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  manualInputText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
});

