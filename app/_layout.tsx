// app/_layout.tsx
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { AuthProvider } from "../src/contexts/AuthContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
