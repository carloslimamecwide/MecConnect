import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "../global.css";
import { AuthProvider } from "../src/contexts/AuthContext";
import { ToastProvider } from "../src/contexts/ToastContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      // Aqui você pode carregar fontes, dados, etc.
      // Exemplo: await loadFonts();
      await SplashScreen.hideAsync();
      setAppIsReady(true);
    }
    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }
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
