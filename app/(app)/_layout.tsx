import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LoadingScreen } from "../../src/components/branding/LoadingScreen";
import { useAuth } from "../../src/contexts/AuthContext";
import { useIsDesktop } from "../../src/hooks/useIsDesktop";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const isDesktop = useIsDesktop();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Em mobile usa Tabs, em desktop usa navegação normal (com sidebar no AppLayout)
  if (!isDesktop) {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#0a1a2b",
            borderTopColor: "rgba(255,255,255,0.1)",
            height: Platform.OS === "android" ? 56 + insets.bottom : 70,
            paddingTop: 0,
            paddingBottom: Platform.OS === "android" ? insets.bottom : 4,
          },
          tabBarActiveTintColor: "#FFFFFF",
          tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Início",
            tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name="forms"
          options={{
            title: "Forms",
            tabBarIcon: ({ color }) => <FontAwesome5 name="file-alt" size={20} color={color} />,
          }}
        />

        <Tabs.Screen
          name="rewards"
          options={{
            title: "Rewards",
            tabBarIcon: ({ color }) => <FontAwesome5 name="gift" size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: "Eventos",
            tabBarIcon: ({ color }) => <FontAwesome5 name="calendar" size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: "Notifs",
            tabBarIcon: ({ color }) => <FontAwesome5 name="bell" size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Config",
            tabBarIcon: ({ color }) => <FontAwesome5 name="cog" size={20} color={color} />,
          }}
        />
      </Tabs>
    );
  }

  // Desktop usa Tabs sem tab bar visível (sidebar aparece no AppLayout)
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: "none",
        },
      }}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="forms" />
      <Tabs.Screen name="notifications" />
      <Tabs.Screen name="rewards" />
      <Tabs.Screen name="events" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
