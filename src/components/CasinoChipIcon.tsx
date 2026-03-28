import React from 'react';
import Svg, { Circle, Path, G, Rect, SvgProps } from 'react-native-svg';

export default function CasinoChipIcon(props: SvgProps) {
  const { color = "white", ...rest } = props;
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...rest}>
      {/* Outer ring */}
      <Circle cx="12" cy="12" r="10.5" stroke={color} strokeWidth="1.5" />
      
      {/* Checkered pattern tabs */}
      <G>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <Rect
            key={i}
            x="11"
            y="0.5"
            width="2"
            height="2.5"
            fill={color}
            transform={`rotate(${angle}, 12, 12)`}
            rx="0.5"
          />
        ))}
      </G>

      {/* Inner circular area */}
      <Circle cx="12" cy="12" r="5.5" stroke={color} strokeWidth="1.2" />
      
      {/* Decorative center dots/lines - resembling the chip design */}
      <Circle cx="12" cy="12" r="1.5" fill={color} />
      
      <Path
        d="M9 9L11 11M13 13L15 15M15 9L13 11M11 13L9 15"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
