import {
  AudioModule,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';
import type { AudioStream } from 'expo-audio';
import { File } from 'expo-file-system';

const WIT_AI_CLIENT_TOKEN = 'DLGWXTQUJ47LW2JVJILBXU6QDMBWSSWT';

let currentStream: AudioStream | null = null;

export async function requestMicrophonePermission(): Promise<boolean> {
  const { status, granted } = await requestRecordingPermissionsAsync();
  return granted || status === 'granted';
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

  if (currentStream) {
    try {
      await currentStream.stopFileRecordingAsync();
    } catch {}
    try {
      currentStream.stop();
    } catch {}
    currentStream = null;
  }

  const stream = new AudioModule.AudioStream({
    sampleRate: 16000,
    channels: 1,
    encoding: 'int16',
  });

  await stream.start();
  await stream.startFileRecordingAsync({ format: 'wav' });
  currentStream = stream;
}

export async function stopRecordingAndTranscribe(): Promise<string> {
  if (!currentStream) {
    throw new Error('Nenhuma gravação em andamento.');
  }

  const stream = currentStream;
  currentStream = null;

  const recordingResult = await stream.stopFileRecordingAsync();
  stream.stop();

  const uri = recordingResult.uri;
  if (!uri) {
    throw new Error('Não foi possível obter o arquivo de áudio gravado.');
  }

  const file = new File(uri);
  const uploadResult = await file.upload('https://api.wit.ai/speech?v=20230215', {
    httpMethod: 'POST',
    headers: {
      Authorization: `Bearer ${WIT_AI_CLIENT_TOKEN}`,
      'Content-Type': 'audio/wav',
    },
  });

  if (uploadResult.status < 200 || uploadResult.status >= 300) {
    let errorDetail = '';
    try {
      const parsed = JSON.parse(uploadResult.body);
      errorDetail = parsed.error || parsed.message || '';
    } catch {}
    throw new Error(errorDetail ? `Wit.ai: ${errorDetail}` : 'Falha na comunicação com a API Wit.ai.');
  }

  let rawText = '';
  if (uploadResult.body) {
    const lines = uploadResult.body.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const parsed = JSON.parse(lines[i]);
        if (parsed.text && parsed.text.trim()) {
          rawText = parsed.text;
          break;
        }
      } catch {}
    }

    if (!rawText) {
      const jsonObjects = uploadResult.body.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g) || [];
      for (let i = jsonObjects.length - 1; i >= 0; i--) {
        try {
          const parsed = JSON.parse(jsonObjects[i]);
          if (parsed.text && parsed.text.trim()) {
            rawText = parsed.text;
            break;
          }
        } catch {}
      }
    }

    if (!rawText) {
      const textMatches = Array.from(uploadResult.body.matchAll(/"text"\s*:\s*"([^"]+)"/g));
      for (let i = textMatches.length - 1; i >= 0; i--) {
        const found = textMatches[i][1];
        if (found && found.trim()) {
          rawText = found;
          break;
        }
      }
    }
  }

  const cleanedText = rawText.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').trim();

  if (!cleanedText) {
    throw new Error('Nenhuma palavra foi identificada no áudio. Fale mais perto do microfone.');
  }

  return cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1);
}
