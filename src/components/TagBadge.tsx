import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

interface TagBadgeProps {
  name: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
}

export function TagBadge({ name, selected = false, onPress, onRemove }: TagBadgeProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.badge,
        selected ? styles.badgeSelected : styles.badgeDefault,
        pressed && styles.badgePressed,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, selected ? styles.textSelected : styles.textDefault]}>
        {name}
      </Text>
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={8} style={styles.removeBtn}>
          <Text style={styles.removeText}>×</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  badgeDefault: {
    backgroundColor: '#2B6CB0',
  },
  badgeSelected: {
    backgroundColor: '#3182CE',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  badgePressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
  },
  textDefault: {
    color: '#FFFFFF',
  },
  textSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  removeBtn: {
    marginLeft: 6,
  },
  removeText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 16,
    fontWeight: 'bold',
  },
});