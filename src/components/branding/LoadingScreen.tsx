import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, Image, View } from "react-native";

export function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0a1a2b",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StatusBar style="light" backgroundColor="#0a1a2b" />
      <Image
        source={require("../../../assets/images/LOGOTIPO_MECWIDE_BRANCO.png")}
        style={{ width: 120, height: 48, marginBottom: 32 }}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}
