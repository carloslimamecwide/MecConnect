import { Redirect, Stack } from "expo-router";
import { LoadingScreen } from "../../src/components/branding/LoadingScreen";
import { useAuth } from "../../src/contexts/AuthContext";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  return (
    <Stack>
      {/* As tabs vivem aqui dentro */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Ecrãs “extra” fora das tabs */}
      <Stack.Screen name="(screens)/support" options={{ headerShown: false }} />
    </Stack>
  );
}
