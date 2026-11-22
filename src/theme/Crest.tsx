// Stand-in for a real school logo/crest image. A real deployment would drop a
// PNG/SVG crest into assets/ and reference it per-school (see schools.ts
// comment) instead of generating one — this generated badge exists so the
// demo doesn't require sourcing real school artwork, while still proving the
// "swap one asset, get a new identity" promise: everything here reads off
// the active School, nothing is fixed.
import React from "react";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import type { School } from "./schools";

export function Crest({ school, size = 64 }: { school: School; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx={50} cy={50} r={48} fill={school.primary} stroke={school.accent} strokeWidth={5} />
      <Circle cx={50} cy={50} r={36} fill="none" stroke={school.accent} strokeWidth={1.5} opacity={0.6} />
      <SvgText
        x={50}
        y={62}
        fontSize={34}
        fontWeight="700"
        fill="#FFFFFF"
        textAnchor="middle"
      >
        {school.crestInitials}
      </SvgText>
    </Svg>
  );
}
