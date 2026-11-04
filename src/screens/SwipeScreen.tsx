import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SwipeScreenRouteProp } from '../types/navigation';
import { getFolderById, Photo } from '../services/folderService';
import { TagBadge } from '../components/TagBadge';
import { VoiceButton } from '../components/VoiceButton';
import { transcribeVoice } from '../services/voiceService';

export function SwipeScreen() {
  const route = useRoute<SwipeScreenRouteProp>();
  const navigation = useNavigation();
  const folderId = route.params?.folderId ?? 'campos-2025';
  const folderName = route.params?.folderName ?? 'Pasta Selecionada';

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [manualTagText, setManualTagText] = useState<string>('');

  useEffect(() => {
    async function fetchPhotos() {
      const folder = await getFolderById(folderId);
      if (folder && folder.photos.length > 0) {
        setPhotos(folder.photos);
      }
    }
    fetchPhotos();
  }, [folderId]);

  const currentPhoto = photos[currentIndex];

  function handleNext() {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  async function handleVoiceTag() {
    try {
      setIsListening(true);
      const result = await transcribeVoice();
      setIsListening(false);
      if (currentPhoto && !currentPhoto.tags.includes(result.tag)) {
        currentPhoto.tags.push(result.tag);
        setPhotos([...photos]);
      }
      Alert.alert('Tag Adicionada!', `Etiqueta "${result.tag}" aplicada à foto.`);
    } catch (error) {
      setIsListening(false);
      Alert.alert('Erro de Voz', 'Não foi possível transcrever o áudio.');
    }
  }

  function handleAddManualTag() {
    const trimmed = manualTagText.trim();
    if (trimmed && currentPhoto && !currentPhoto.tags.includes(trimmed)) {
      currentPhoto.tags.push(trimmed);
      setPhotos([...photos]);
      setManualTagText('');
      setModalVisible(false);
    }
  }

  function handleRemoveTag(tagToRemove: string) {
    if (currentPhoto) {
      currentPhoto.tags = currentPhoto.tags.filter((t) => t !== tagToRemove);
      setPhotos([...photos]);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹ Voltar</Text>
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>{folderName}</Text>
        <Text style={styles.counterText}>
          {photos.length > 0 ? `${currentIndex + 1}/${photos.length}` : '0/0'}
        </Text>
      </View>

      {currentPhoto ? (
        <View style={styles.content}>
          <View style={styles.imageCard}>
            <Image source={{ uri: currentPhoto.uri }} style={styles.photo} />
            <View style={styles.photoInfoOverlay}>
              <Text style={styles.photoTitle}>{currentPhoto.title}</Text>
              <Text style={styles.photoMeta}>
                📅 {currentPhoto.date} {currentPhoto.location ? `• 📍 ${currentPhoto.location}` : ''}
              </Text>
            </View>
          </View>

          <View style={styles.navRow}>
            <Pressable
              style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
              onPress={handlePrev}
              disabled={currentIndex === 0}
            >
              <Text style={styles.navBtnText}>‹ Anterior</Text>
            </Pressable>
            <Text style={styles.swipeHint}>Navegue pelas setas</Text>
            <Pressable
              style={[styles.navBtn, currentIndex === photos.length - 1 && styles.navBtnDisabled]}
              onPress={handleNext}
              disabled={currentIndex === photos.length - 1}
            >
              <Text style={styles.navBtnText}>Próxima ›</Text>
            </Pressable>
          </View>

          <View style={styles.tagsContainer}>
            <Text style={styles.tagsHeader}>Tags desta foto:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsScroll}>
              {currentPhoto.tags.map((tag) => (
                <TagBadge
                  key={tag}
                  name={tag}
                  onRemove={() => handleRemoveTag(tag)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.actionsBox}>
            <VoiceButton
              title="Falar Tag p/ Foto"
              isListening={isListening}
              onPress={handleVoiceTag}
            />
            <Pressable style={styles.manualBtn} onPress={() => setModalVisible(true)}>
              <Text style={styles.manualBtnText}>✏️ Ou digite a tag manualmente...</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma foto nesta pasta.</Text>
        </View>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Adicionar Tag à Foto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Pôr do sol, Família..."
              value={manualTagText}
              onChangeText={setManualTagText}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalActionBtn, styles.cancelBtn]}
                onPress={() => {
                  setManualTagText('');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalActionBtn, styles.saveBtn]}
                onPress={handleAddManualTag}
              >
                <Text style={styles.saveText}>Salvar</Text>
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
    backgroundColor: '#0F2942',
    padding: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginBottom: 12,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
  },
  backText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  topTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  counterText: {
    color: '#A0AEC0',
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imageCard: {
    flex: 1,
    backgroundColor: '#1E3A5F',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    maxHeight: 340,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 41, 66, 0.85)',
    padding: 10,
  },
  photoTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  photoMeta: {
    color: '#CBD5E0',
    fontSize: 12,
    marginTop: 2,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  navBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  navBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  swipeHint: {
    color: '#A0AEC0',
    fontSize: 11,
  },
  tagsContainer: {
    marginBottom: 10,
  },
  tagsHeader: {
    color: '#CBD5E0',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  tagsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  actionsBox: {
    gap: 10,
    marginBottom: 6,
  },
  manualBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  manualBtnText: {
    color: '#CBD5E0',
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#A0AEC0',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
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
    marginBottom: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalActionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  cancelBtn: {
    backgroundColor: '#EDF2F7',
  },
  saveBtn: {
    backgroundColor: '#1E6091',
  },
  cancelText: {
    color: '#4A5568',
    fontWeight: '600',
    fontSize: 13,
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});