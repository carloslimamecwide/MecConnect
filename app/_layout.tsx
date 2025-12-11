// app/_layout.tsx
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "../global.css";
import { AuthProvider } from "../src/contexts/AuthContext";
import { ToastProvider } from "../src/contexts/ToastContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ToastProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0a1a2b" },
            animation: "fade",
          }}
        />
      </AuthProvider>
    </ToastProvider>
  );
}
