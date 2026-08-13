import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { AlertTriangle, X } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../theme';

export default function AlertBanner({
  title = 'System Warning',
  message,
  onDismiss,
  type = 'warning',
  style,
}) {
  const isWarning = type === 'warning';
  const bgColor = isWarning ? theme.colors.warningBg : '#FEE2E2';
  const textColor = isWarning ? theme.colors.warningText : '#DC2626';
  const iconColor = isWarning ? theme.colors.accentOrange : '#EF4444';

  return (
    <Animated.View
      entering={FadeInDown.duration(350)}
      style={[
        styles.container,
        { backgroundColor: bgColor, borderColor: textColor + '40' },
        style,
      ]}
    >
      <View style={styles.iconWrapper}>
        <AlertTriangle size={22} color={iconColor} />
      </View>
      <View style={styles.contentWrapper}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        {message ? <Text style={[styles.message, { color: textColor }]}>{message}</Text> : null}
      </View>
      {onDismiss ? (
        <TouchableOpacity style={styles.dismissButton} onPress={onDismiss} activeOpacity={0.7}>
          <X size={18} color={textColor} />
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    marginVertical: 8,
  },
  iconWrapper: {
    marginRight: 12,
    marginTop: 2,
  },
  contentWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  message: {
    fontSize: 12.5,
    lineHeight: 18,
    opacity: 0.9,
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
});
