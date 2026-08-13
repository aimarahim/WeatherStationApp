import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Card from './Card';
import { theme } from '../theme';

export default function StatTile({
  icon: IconComponent,
  label,
  value,
  unit,
  subtitle,
  badgeText,
  badgeColor,
  iconColor = theme.colors.navyMid,
  iconBg = theme.colors.iconBackground,
  style,
  animated = false,
  delay = 0,
  onPress,
  isSelected = false,
}) {
  return (
    <Card
      style={[
        styles.tileCard,
        isSelected && styles.selectedTile,
        style,
      ]}
      animated={animated}
      delay={delay}
      onPress={onPress}
    >
      <View style={styles.headerRow}>
        {IconComponent && (
          <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
            <IconComponent size={20} color={iconColor} />
          </View>
        )}
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.valueText}>{value}</Text>
        {unit ? <Text style={styles.unitText}> {unit}</Text> : null}
      </View>

      <View style={styles.footerRow}>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {badgeText ? (
          <View style={[styles.badge, { backgroundColor: badgeColor || theme.colors.warningBg }]}>
            <Text style={[styles.badgeText, { color: badgeColor ? '#FFFFFF' : theme.colors.warningText }]}>
              {badgeText}
            </Text>
          </View>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  tileCard: {
    padding: 14,
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  selectedTile: {
    borderColor: theme.colors.accentBlue,
    backgroundColor: '#F8FAFC',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    flexShrink: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  valueText: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.navyDark,
  },
  unitText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
