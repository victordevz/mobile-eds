import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../theme';
import { tabConfig } from '../navigation/tabConfig';

const ICON_SIZE = 36;
const ICON_SIZE_PLAIN = 34;
const ACTIVE_CIRCLE = 78;
const INACTIVE_CIRCLE = 60;
const SPRING_CONFIG = { damping: 30, stiffness: 200, overshootClamping: true };

export default function CustomTabBar({
  state,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, 8) },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const config = tabConfig.find((t) => t.routeName === route.name);

        if (!config) return null;

        const { label, showLabel, icon: Icon } = config;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TabBarItem
            key={route.key}
            isFocused={isFocused}
            label={label}
            showLabel={showLabel ?? false}
            Icon={Icon}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
}

interface TabBarItemProps {
  isFocused: boolean;
  label: string;
  showLabel: boolean;
  Icon: React.FC<import('react-native-svg').SvgProps>;
  onPress: () => void;
}

function TabBarItem({ isFocused, label, showLabel, Icon, onPress }: TabBarItemProps) {
  const animatedCircle = useAnimatedStyle(() => ({
    width: withSpring(isFocused ? ACTIVE_CIRCLE : INACTIVE_CIRCLE, SPRING_CONFIG),
    height: withSpring(isFocused ? ACTIVE_CIRCLE : INACTIVE_CIRCLE, SPRING_CONFIG),
    borderRadius: withSpring(
      isFocused ? ACTIVE_CIRCLE / 2 : INACTIVE_CIRCLE / 2,
      SPRING_CONFIG
    ),
    transform: [
      { translateY: withSpring(isFocused ? -18 : 0, SPRING_CONFIG) },
    ],
  }));

  const animatedLabel = useAnimatedStyle(() => ({
    opacity: withSpring(isFocused ? 0 : 1, SPRING_CONFIG),
    transform: [
      { translateY: withSpring(isFocused ? 10 : 0, SPRING_CONFIG) },
    ],
  }));

  if (showLabel) {
    // Suporte & Histórico: plain white SVG, no circle background
    return (
      <Pressable style={styles.tab} onPress={onPress}>
        <View style={styles.plainIconWrapper}>
          <Icon
            width={ICON_SIZE_PLAIN}
            height={ICON_SIZE_PLAIN}
            color={colors.white}
            fill={colors.white}
          />
        </View>
        <Animated.Text
          style={[styles.label, animatedLabel]}
          numberOfLines={2}
        >
          {label}
        </Animated.Text>
      </Pressable>
    );
  }

  // Roleta, Futebol, Slot: animated circle with colored icon
  return (
    <Pressable style={styles.tab} onPress={onPress}>
      <Animated.View style={[styles.circle, animatedCircle]}>
        <Icon
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={colors.primary}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    height: 88,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'visible',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 78,
    paddingBottom: 8,
    overflow: 'visible',
  },
  circle: {
    position: 'absolute',
    top: 4,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  iconWrapper: {
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plainIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  label: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
