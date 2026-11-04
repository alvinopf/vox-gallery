import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface CardFolderProps {
  title: string;
  photoCount: number;
  onPress: () => void;
  icon?: string;
}

export function CardFolder({ title, photoCount, onPress, icon = '📁' }: CardFolderProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Text style={styles.count}>{photoCount} fotos</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  cardPressed: {
    backgroundColor: '#EDF2F7',
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  count: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
});