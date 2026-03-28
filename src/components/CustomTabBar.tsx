import React, { useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';
import Svg, { Path, Defs, RadialGradient, LinearGradient, Stop } from 'react-native-svg';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../theme';
import { tabConfig } from '../navigation/tabConfig';


const AnimatedPath = Animated.createAnimatedComponent(Path);

const ICON_SIZE = 35;
const ICON_SIZE_PLAIN = 30;
const ACTIVE_CIRCLE = 75;
const INACTIVE_CIRCLE = 60;
const SPRING_CONFIG = { damping: 30, stiffness: 200, overshootClamping: true };
const BOUNCE_SPRING = { damping: 18, stiffness: 160, mass: 1 };
const WAVE_SPRING = { damping: 22, stiffness: 180, mass: 1 };

export default function CustomTabBar({
  state,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const tabWidth = width / state.routes.length;

  const waveHeight = 32;
  const xShared = useSharedValue((state.index + 0.5) * tabWidth);

  useEffect(() => {
    xShared.value = withSpring((state.index + 0.5) * tabWidth, WAVE_SPRING);
  }, [state.index, tabWidth]);

  const animatedPathProps = useAnimatedProps(() => {
    const x = xShared.value;
    return {
      d: `M -1000 0 L ${x - 70} 0 C ${x - 35} 0, ${x - 35} ${waveHeight}, ${x} ${waveHeight} C ${x + 35} ${waveHeight}, ${x + 35} 0, ${x + 70} 0 L 3000 0 L 3000 200 L -1000 200 Z`,
    };
  });

  const animatedStrokeProps = useAnimatedProps(() => {
    const x = xShared.value;
    // Only draw the curve portion (no flat horizontal lines on both sides)
    return {
      d: `M ${x - 70} 0 C ${x - 35} 0, ${x - 35} ${waveHeight}, ${x} ${waveHeight} C ${x + 35} ${waveHeight}, ${x + 35} 0, ${x + 70} 0`,
    };
  });

  const currentTab = state.routes[state.index];
  const nestedState = currentTab.state;
  const activeNestedRoute =
    nestedState?.routes?.[nestedState.index ?? 0]?.name;
  if (activeNestedRoute === 'Game' || activeNestedRoute === 'MatchDetails') return null;

  const xPos = (state.index + 0.5) * tabWidth;

  return (
    <>
      <View
        style={[
          styles.container,
          { paddingBottom: (insets.bottom || 0) + 32 },
        ]}
      >
      {/* Background SVG wave */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width={width} height={200}>
          <Defs>
            <RadialGradient
              id="waveGradient"
              gradientUnits="userSpaceOnUse"
              cx={xPos}
              cy={15}
              r={800}
            >
              <Stop offset="0%" stopColor="#0B4EC2" stopOpacity="1" />
              <Stop offset="10%" stopColor={colors.primary} stopOpacity="1" />
              <Stop offset="100%" stopColor={colors.primary} stopOpacity="1" />
            </RadialGradient>
            {/* Stroke gradient: transparent up top, green at the wave bottom */}
            <LinearGradient id="strokeGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={colors.secondary} stopOpacity="0" />
              <Stop offset="50%" stopColor={colors.secondary} stopOpacity="0.5" />
              <Stop offset="100%" stopColor={colors.secondary} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <AnimatedPath
            animatedProps={animatedPathProps}
            fill="url(#waveGradient)"
          />
          <AnimatedPath
            animatedProps={animatedStrokeProps}
            fill="none"
            stroke="url(#strokeGrad)"
            strokeWidth={2.5}
          />
        </Svg>
      </View>

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
    </>
  );
}

interface TabBarItemProps {
  isFocused: boolean;
  label: string;
  showLabel: boolean;
  Icon: React.FC<import('react-native-svg').SvgProps>;
  onPress: () => void;
}

function TabBarItem({ isFocused, label, Icon, onPress }: TabBarItemProps) {
  const animatedWrapper = useAnimatedStyle(() => ({
    width: withSpring(isFocused ? 70 : INACTIVE_CIRCLE, SPRING_CONFIG),
    height: withSpring(isFocused ? 70 : INACTIVE_CIRCLE, SPRING_CONFIG),
    borderRadius: withSpring(
      isFocused ? 35 : INACTIVE_CIRCLE / 2,
      SPRING_CONFIG
    ),
    transform: [
      { translateY: withSpring(isFocused ? -42 : 0, BOUNCE_SPRING) },
    ],
  }), [isFocused]);

  const animatedLabel = useAnimatedStyle(() => ({
    opacity: 1,
    transform: [
      { translateY: withSpring(isFocused ? -2 : 0, SPRING_CONFIG) },
    ],
  }), [isFocused]);

  return (
    <Pressable style={[styles.tab, { zIndex: isFocused ? 10 : 1 }]} onPress={onPress}>
      <Animated.View style={[
        styles.circle, 
        animatedWrapper, 
        { 
          backgroundColor: isFocused ? '#02143D' : 'transparent',
          borderWidth: isFocused ? 2 : 0,
          borderColor: colors.secondary
        }
      ]}>
        <Icon
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={colors.white}
          color={colors.white}
        />
      </Animated.View>
      
      <Animated.Text
        style={[
          styles.label, 
          { position: 'absolute', bottom: 6 },
          animatedLabel,
          isFocused ? {
            backgroundColor: colors.secondary,
            color: colors.primaryDark,
            borderWidth: 1,
            borderColor: colors.secondary,
            paddingHorizontal: 12,
            paddingVertical: 3,
            borderRadius: 12,
            overflow: 'hidden',
          } : {
            color: 'rgba(255,255,255,0.6)'
          }
        ]}
        numberOfLines={1}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    paddingTop: 15,
    alignItems: 'center',
    height: 116,
    overflow: 'visible',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 78,
    paddingBottom: 0,
    overflow: 'visible',
  },
  circle: {
    position: 'absolute',
    top: 4,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
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
