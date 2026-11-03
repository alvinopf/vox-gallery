import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

interface VoiceButtonProps {
  title?: string;
  isListening?: boolean;
  onPress: () => void;
}

export function VoiceButton({
  title = 'Falar Tag',
  isListening = false,
  onPress,
}: VoiceButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isListening ? styles.buttonListening : styles.buttonDefault,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>
        {isListening ? '🛑 Gravando... Toque p/ parar' : `🎙️ ${title}`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDefault: {
    backgroundColor: '#3182CE',
  },
  buttonListening: {
    backgroundColor: '#E53E3E',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});