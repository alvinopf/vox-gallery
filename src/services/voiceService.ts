export interface VoiceTranscriptionResult {
  tag: string;
  confidence: number;
}

const sampleVoiceTags = [
  'Campos do Jordão',
  'Aniversário Dany',
  'Família',
  'Praia',
  'Natureza',
  'Frio',
  'Viagem',
  'Alvino',
];

export async function transcribeVoice(): Promise<VoiceTranscriptionResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const randomIndex = Math.floor(Math.random() * sampleVoiceTags.length);
  return {
    tag: sampleVoiceTags[randomIndex],
    confidence: 0.96,
  };
}
