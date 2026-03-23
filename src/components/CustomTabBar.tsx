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
import Svg, { Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../theme';
import { tabConfig } from '../navigation/tabConfig';


const ICON_SIZE = 35;
const ICON_SIZE_PLAIN = 30;
const ACTIVE_CIRCLE = 75;
const INACTIVE_CIRCLE = 60;
const SPRING_CONFIG = { damping: 30, stiffness: 200, overshootClamping: true };

export default function CustomTabBar({
  state,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const tabWidth = width / 5;

  const xPos = (state.index + 0.5) * tabWidth;
  const waveWidth = 140;  
  const waveHeight = 40;  

  // Suavizando os "ombros" da onda: p2x e p6x mais próximos ao centro criam transição mais redonda nas pontas
  const p1x = xPos - 70;
  const p2x = xPos - 35; 
  const p3x = xPos - 35; 
  const p4x = xPos;
  const p5x = xPos + 35;
  const p6x = xPos + 35;
  const p7x = xPos + 70;

  const d = `
    M -1000 0
    L ${p1x} 0
    C ${p2x} 0, ${p3x} ${waveHeight}, ${p4x} ${waveHeight}
    C ${p5x} ${waveHeight}, ${p6x} 0, ${p7x} 0
    L 3000 0
    L 3000 100
    L -1000 100
    Z
  `;

  // Um ID exclusivo força o SVG a reconstruir o brilho no canto exato, sem bugar o cache!
  const gradientId = `waveGradient-${state.index}`;

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom || 10 },
      ]}
    >
      {/* Background SVG wave */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width={width} height={100} key={`svg-${state.index}`}>
          <Defs>
            <RadialGradient
              id={gradientId}
              gradientUnits="userSpaceOnUse"
              cx={xPos}
              cy={15}
              r={800}
            >
              <Stop offset="0%" stopColor="#0B4EC2" stopOpacity="1" />
              <Stop offset="10%" stopColor={colors.primary} stopOpacity="1" />
              <Stop offset="100%" stopColor={colors.primary} stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Path
            d={d}
            fill={`url(#${gradientId})`}
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
      { translateY: withSpring(isFocused ? -54 : 0, SPRING_CONFIG) },
      { scale: withSpring(isFocused ? 1 : 1, SPRING_CONFIG) }
    ]
  }), [isFocused]);

  const animatedLabel = useAnimatedStyle(() => ({
    opacity: 1,
    transform: [
      { translateY: 0 },
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
    height: 88,
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
