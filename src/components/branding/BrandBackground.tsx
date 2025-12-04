import React from "react";
import { Image, useWindowDimensions, View } from "react-native";

interface BrandBackgroundProps {
  opacity?: number;
}

// Renderiza a imagem do M Only como marca d'água de fundo
export function BrandBackground({ opacity = 0.05 }: BrandBackgroundProps) {
  const d = useWindowDimensions();
  const isMobile = d.width < 768;

  return (
    <View className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Image
        source={require("../../../assets/images/M_ONLY.png")}
        style={{
          position: "absolute",
          top: isMobile ? 0 : 60,
          right: isMobile ? -100 : -100,
          width: isMobile ? d.width : d.width * 0.8,
          height: isMobile ? d.height : d.height * 0.8,
          opacity: isMobile ? 0.08 : opacity,
          resizeMode: "contain",
          transform: [{ scale: isMobile ? 1 : 1 }],
        }}
      />
    </View>
  );
}

export default BrandBackground;
