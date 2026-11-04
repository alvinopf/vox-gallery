import { Audio } from 'expo-av';

const WIT_AI_CLIENT_TOKEN = 'DLGWXTQUJ47LW2JVJILBXU6QDMBWSSWT';

let currentRecording: Audio.Recording | null = null;

export async function requestMicrophonePermission(): Promise<boolean> {
  const { status } = await Audio.requestPermissionsAsync();
  return status === 'granted';
}

export async function startRecording(): Promise<void> {
  const hasPermission = await requestMicrophonePermission();
  if (!hasPermission) {
    throw new Error('Permissão de acesso ao microfone foi negada.');
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  if (currentRecording) {
    try {
      await currentRecording.stopAndUnloadAsync();
    } catch {}
    currentRecording = null;
  }

  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
  await recording.startAsync();
  currentRecording = recording;
}

export async function stopRecordingAndTranscribe(): Promise<string> {
  if (!currentRecording) {
    throw new Error('Nenhuma gravação em andamento.');
  }

  await currentRecording.stopAndUnloadAsync();
  const uri = currentRecording.getURI();
  currentRecording = null;

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
