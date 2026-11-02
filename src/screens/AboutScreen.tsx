import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.appTitle}>Vox Gallery</Text>
        <Text style={styles.versionBadge}>Versão 1.0.0 (Beta)</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionHeader}>Equipe de Desenvolvimento</Text>
        <Text style={styles.authorName}>• Alvino Pedrosa Ferreira</Text>
        <Text style={styles.authorName}>• Daniela Carvalho Melo</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionHeader}>Contexto Acadêmico</Text>
        <Text style={styles.bodyText}>UNIESP - Centro Universitário</Text>
        <Text style={styles.bodyText}>Sistemas para Internet - 5º Período</Text>
        <Text style={styles.bodyText}>Programação Para Dispositivos Móveis</Text>
        <Text style={styles.bodyText}>Projeto Extensionista IV</Text>
        <Text style={styles.bodyText}>Professor: Álekiss Manço de Mélo</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionHeader}>Proposta Extensionista</Text>
        <Text style={styles.bodyText}>
          Promover o bem-estar digital e preservar a privacidade através de indexação rápida por voz
          e armazenamento 100% offline no dispositivo.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  headerCard: {
    backgroundColor: '#0F2942',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  versionBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#E2E8F0',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E6091',
    marginBottom: 8,
  },
  authorName: {
    fontSize: 14,
    color: '#2D3748',
    fontWeight: '600',
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 20,
    marginBottom: 4,
  },
});

