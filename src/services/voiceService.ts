import {
  AudioModule,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';
import type { AudioRecorder } from 'expo-audio';

const WIT_AI_CLIENT_TOKEN = 'DLGWXTQUJ47LW2JVJILBXU6QDMBWSSWT';

let currentRecorder: AudioRecorder | null = null;

export async function requestMicrophonePermission(): Promise<boolean> {
  const { status } = await requestRecordingPermissionsAsync();
  return status === 'granted';
}

export async function startRecording(): Promise<void> {
  const hasPermission = await requestMicrophonePermission();
  if (!hasPermission) {
    throw new Error('Permissão de acesso ao microfone foi negada.');
  }

  await setAudioModeAsync({
    allowsRecording: true,
    playsInSilentMode: true,
  });

  if (currentRecorder) {
    try {
      await currentRecorder.stop();
    } catch {}
    currentRecorder = null;
  }

  const recorder = new AudioModule.AudioRecorder(RecordingPresets.HIGH_QUALITY);
  await recorder.prepareToRecordAsync();
  recorder.record();
  currentRecorder = recorder;
}

export async function stopRecordingAndTranscribe(): Promise<string> {
  if (!currentRecorder) {
    throw new Error('Nenhuma gravação em andamento.');
  }

  await currentRecorder.stop();
  const uri = currentRecorder.uri;
  currentRecorder = null;

  if (!uri) {
    throw new Error('Não foi possível obter o áudio gravado.');
  }

  const audioFileResponse = await fetch(uri);
  const audioBlob = await audioFileResponse.blob();

  const response = await fetch('https://api.wit.ai/speech?v=20230215', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WIT_AI_CLIENT_TOKEN}`,
      'Content-Type': 'audio/m4a',
    },
    body: audioBlob,
  });

  if (!response.ok) {
    throw new Error('Falha na comunicação com a API Wit.ai.');
  }

  const data = await response.json();
  const rawText: string = data.text || '';
  const cleanedText = rawText.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').trim();

  if (!cleanedText) {
    throw new Error('Nenhuma palavra foi identificada no áudio. Fale mais perto do microfone.');
  }

  return cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1);
}
