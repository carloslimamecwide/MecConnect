import { Redirect, Stack } from "expo-router";
import { LoadingScreen } from "../../src/components/branding/LoadingScreen";
import { useAuth } from "../../src/contexts/AuthContext";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  return (
    <Stack>
      {/* Seleção de modo para developers */}
      <Stack.Screen name="mode-selection" options={{ headerShown: false }} />
      {/* Tabs de comunicação */}
      <Stack.Screen name="(communication)" options={{ headerShown: false }} />
      {/* Tabs de gestão (apenas para developers) */}
      <Stack.Screen name="(management)" options={{ headerShown: false }} />
      {/* Ecrãs “extra” fora das tabs */}
      <Stack.Screen name="(screens)/support" options={{ headerShown: false }} />
    </Stack>
  );
}
