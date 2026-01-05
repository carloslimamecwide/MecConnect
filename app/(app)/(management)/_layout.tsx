import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsDesktop } from "../../../src/hooks/useIsDesktop";

export default function ManagementLayout() {
  const isDesktop = useIsDesktop();
  const insets = useSafeAreaInsets();

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
          name="users"
          options={{
            title: "Usuários",
            tabBarIcon: ({ color }) => <FontAwesome5 name="users" size={20} color={color} />,
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
      <Tabs.Screen name="users" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
