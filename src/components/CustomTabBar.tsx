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

const ICON_SIZE = 28;
const ACTIVE_CIRCLE = 64;
const SPRING_CONFIG = { damping: 15, stiffness: 150 };

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

        const { label, icon: Icon } = config;

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
  Icon: React.FC<import('react-native-svg').SvgProps>;
  onPress: () => void;
}

function TabBarItem({ isFocused, label, Icon, onPress }: TabBarItemProps) {
  const animatedCircle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(isFocused ? 1 : 0, SPRING_CONFIG) },
      { translateY: withSpring(isFocused ? -18 : 0, SPRING_CONFIG) },
    ],
    opacity: withSpring(isFocused ? 1 : 0, SPRING_CONFIG),
  }));

  const animatedIcon = useAnimatedStyle(() => ({
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

  return (
    <Pressable style={styles.tab} onPress={onPress}>
      {/* White circle background — only visible when focused */}
      <Animated.View style={[styles.circle, animatedCircle]} />

      {/* Icon — always visible, animates up when focused */}
      <Animated.View style={[styles.iconWrapper, animatedIcon]}>
        <Icon
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={isFocused ? colors.primary : colors.white}
        />
      </Animated.View>

      {/* Label — fades out when focused */}
      <Animated.Text
        style={[styles.label, animatedLabel]}
        numberOfLines={2}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    paddingBottom: 4,
    minHeight: 60,
  },
  circle: {
    position: 'absolute',
    top: -4,
    width: ACTIVE_CIRCLE,
    height: ACTIVE_CIRCLE,
    borderRadius: ACTIVE_CIRCLE / 2,
    backgroundColor: colors.white,
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
  label: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
