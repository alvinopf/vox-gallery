import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../types/navigation';
import { Folder, getFolders, addTagToFolder } from '../services/folderService';
import { CardFolder } from '../components/CardFolder';
import { VoiceButton } from '../components/VoiceButton';
import { startRecording, stopRecordingAndTranscribe } from '../services/voiceService';

export function FoldersScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [selectedFolderForVoice, setSelectedFolderForVoice] = useState<Folder | null>(null);
  const [voiceModalVisible, setVoiceModalVisible] = useState<boolean>(false);

  useEffect(() => {
    loadFolders();
  }, []);

  async function loadFolders(simulateError = false) {
    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await getFolders(simulateError);
      setFolders(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }

  function handleOpenFolder(folder: Folder) {
    navigation.navigate('Swipe', {
      folderId: folder.id,
      folderName: folder.name,
      initialPhotoIndex: 0,
    });
  }

  async function handleToggleBatchVoiceTag() {
    if (!selectedFolderForVoice) return;

    if (!isListening) {
      try {
        await startRecording();
        setIsListening(true);
      } catch (error: any) {
        Alert.alert('Microfone', error.message || 'Não foi possível iniciar a gravação.');
      }
    } else {
      try {
        setIsListening(false);
        const recognizedTag = await stopRecordingAndTranscribe();
        await addTagToFolder(selectedFolderForVoice.id, recognizedTag);
        setVoiceModalVisible(false);
        await loadFolders(false);
        Alert.alert(
          'Tag de Voz Reconhecida!',
          `Etiqueta "${recognizedTag}" aplicada a todas as fotos da pasta "${selectedFolderForVoice.name}" e salva no disco!`
        );
      } catch (error: any) {
        setIsListening(false);
        Alert.alert('Reconhecimento de Voz', error.message || 'Erro ao processar áudio.');
      }
    }
  }

  function openVoiceModalForFolder(folder: Folder) {
    setSelectedFolderForVoice(folder);
    setVoiceModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <View style={styles.topControlBar}>
        <View>
          <Text style={styles.mainTitle}>Vox Gallery</Text>
          <Text style={styles.subTitle}>Álbuns e Pastas Inteligentes</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.simErrorBtn, pressed && styles.simErrorBtnPressed]}
          onPress={() => loadFolders(true)}
        >
          <Text style={styles.simErrorBtnText}>Simular Erro</Text>
        </Pressable>
      </View>

      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1E6091" />
          <Text style={styles.loadingText}>Carregando pastas e fotos do dispositivo...</Text>
        </View>
      )}

      {errorMessage && !loading && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Ops! Algo deu errado.</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <Pressable
            style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
            onPress={() => loadFolders(false)}
          >
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </Pressable>
        </View>
      )}

      {!loading && !errorMessage && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.noticeCard}>
            <Text style={styles.noticeText}>
              💡 Álbuns nativos e pastas inteligentes integradas com gravação de voz real e persistência local.
            </Text>
          </View>

          <View style={styles.gridContainer}>
            {folders.map((folder) => (
              <View key={folder.id} style={styles.folderWrapper}>
                <CardFolder
                  title={folder.name}
                  photoCount={folder.photoCount}
                  icon={folder.icon}
                  onPress={() => handleOpenFolder(folder)}
                />
                <Pressable
                  style={styles.micQuickAction}
                  onPress={() => openVoiceModalForFolder(folder)}
                >
                  <Text style={styles.micQuickText}>🎙️</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <Modal
        visible={voiceModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          if (!isListening) setVoiceModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Taguear Pasta em Lote</Text>
            <Text style={styles.modalDesc}>
              Pasta selecionada: <Text style={styles.boldText}>{selectedFolderForVoice?.name}</Text>
            </Text>
            <Text style={styles.modalInstruction}>
              {isListening
                ? 'Gravando... Fale o nome da tag e toque no botão para parar e transcrever.'
                : 'Toque abaixo para iniciar a gravação por voz com a Wit.ai.'}
            </Text>

            <View style={styles.voiceBtnContainer}>
              <VoiceButton
                title="Gravar Tag p/ a Pasta"
                isListening={isListening}
                onPress={handleToggleBatchVoiceTag}
              />
            </View>

            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => setVoiceModalVisible(false)}
              disabled={isListening}
            >
              <Text style={styles.modalCloseText}>Fechar</Text>
            </Pressable>
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
  },
  topControlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F2942',
  },
  subTitle: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  simErrorBtn: {
    backgroundColor: '#FED7D7',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEB2B2',
  },
  simErrorBtnPressed: {
    backgroundColor: '#FEB2B2',
  },
  simErrorBtnText: {
    color: '#C53030',
    fontSize: 11,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E53E3E',
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1E6091',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonPressed: {
    backgroundColor: '#184E77',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollContent: {
    padding: 16,
  },
  noticeCard: {
    backgroundColor: '#EBF8FF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3182CE',
  },
  noticeText: {
    fontSize: 12,
    color: '#2B6CB0',
    lineHeight: 18,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  folderWrapper: {
    width: '48%',
    position: 'relative',
  },
  micQuickAction: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EBF8FF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BEE3F8',
    elevation: 2,
  },
  micQuickText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F2942',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 13,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 6,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#1E6091',
  },
  modalInstruction: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 16,
  },
  voiceBtnContainer: {
    width: '100%',
    marginBottom: 12,
  },
  modalCloseBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  modalCloseText: {
    color: '#718096',
    fontSize: 13,
    fontWeight: '600',
  },
});
