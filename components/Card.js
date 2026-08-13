import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { theme } from '../theme';

export default function Card({
  children,
  style,
  elevation = 3,
  animated = false,
  delay = 0,
  onPress,
}) {
  const scale = useSharedValue(1);

  const animatedPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }
  };

  const cardStyle = [styles.card, { elevation }, style];

  if (onPress) {
    if (animated) {
      return (
        <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={animatedPressStyle}>
          <Pressable
            style={cardStyle}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            {children}
          </Pressable>
        </Animated.View>
      );
    }
    return (
      <Animated.View style={animatedPressStyle}>
        <Pressable
          style={cardStyle}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  if (animated) {
    return (
      <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={cardStyle}>
        {children}
      </Animated.View>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.large,
    padding: 16,
    marginVertical: 6,
    shadowColor: theme.colors.navyDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
});
