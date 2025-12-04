import React from "react";
import { View } from "react-native";

interface BrandBackgroundProps {
  color?: string;
  opacity?: number;
}

// Renderiza um "M" estilizado com linhas (cut) como marca d'água de fundo
export function BrandBackground({ color = "#FFFFFF", opacity = 0.05 }: BrandBackgroundProps) {
  const lineColor = color;

  const Line = ({
    width,
    height,
    rotate,
    top,
    left,
  }: {
    width: number;
    height: number;
    rotate: string;
    top: number;
    left: number;
  }) => (
    <View
      style={{
        position: "absolute",
        width,
        height,
        backgroundColor: lineColor,
        opacity,
        transform: [{ rotate }],
        top,
        left,
        borderRadius: 999,
      }}
    />
  );

  return (
    <View pointerEvents="none" style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}>
      {/* "M" geométrico grande ao fundo */}
      {/* Pernas externas */}
      <Line width={8} height={420} rotate="15deg" top={80} left={40} />
      <Line width={8} height={420} rotate="-15deg" top={80} left={260} />

      {/* Pernas internas */}
      <Line width={8} height={300} rotate="-25deg" top={120} left={120} />
      <Line width={8} height={300} rotate="25deg" top={120} left={185} />

      {/* Barra cruzada */}
      <Line width={8} height={260} rotate="-35deg" top={130} left={210} />

      {/* Segundo grupo (direita) para preencher telas largas */}
      <Line width={8} height={420} rotate="15deg" top={160} left={340} />
      <Line width={8} height={420} rotate="-15deg" top={160} left={560} />
      <Line width={8} height={300} rotate="-25deg" top={200} left={420} />
      <Line width={8} height={300} rotate="25deg" top={200} left={485} />
      <Line width={8} height={260} rotate="-35deg" top={210} left={510} />
    </View>
  );
}

export default BrandBackground;
