import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export const PROVIDER_GOOGLE = undefined;

export const Marker = ({ children }) => {
  return <View>{children}</View>;
};

const CustomMap = ({ style, initialRegion, children }) => {
  const latitude = initialRegion?.latitude || 33.6263;
  const longitude = initialRegion?.longitude || 73.0115;

  return (
    <View style={[style, styles.container]}>
      <View style={styles.card}>
        <Text style={styles.mapIcon}>🗺️</Text>
        <Text style={styles.title}>Station Location</Text>
        <Text style={styles.coords}>
          {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
        </Text>
        <Text style={styles.description}>
          National University of Technology (NUTECH), Islamabad
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>📍 Open on mobile for interactive map</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 28,
    borderRadius: 20,
    alignItems: 'center',
    maxWidth: 400,
    shadowColor: '#0F1E4D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  mapIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1E4D',
    marginBottom: 8,
  },
  coords: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
});

export default CustomMap;
