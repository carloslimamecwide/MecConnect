import { Redirect, Tabs } from "expo-router";
import { LoadingScreen } from "../../src/components/branding/LoadingScreen";
import { TabIcon } from "../../src/components/layout/TabIcon";
import { useAuth } from "../../src/contexts/AuthContext";
import { useIsDesktop } from "../../src/hooks/useIsDesktop";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const isDesktop = useIsDesktop();

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
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: "#FFFFFF",
          tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Início",
            tabBarIcon: ({ color }) => <TabIcon icon="📊" color={color} />,
          }}
        />
        <Tabs.Screen
          name="forms"
          options={{
            title: "Forms",
            tabBarIcon: ({ color }) => <TabIcon icon="📝" color={color} />,
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: "Users",
            tabBarIcon: ({ color }) => <TabIcon icon="👥" color={color} />,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: "Notifs",
            tabBarIcon: ({ color }) => <TabIcon icon="🔔" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Config",
            tabBarIcon: ({ color }) => <TabIcon icon="⚙️" color={color} />,
          }}
        />
      </Tabs>
    );
  }

  // Desktop usa Stack (sidebar aparece no AppLayout)
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="forms" />
      <Tabs.Screen name="users" />
      <Tabs.Screen name="notifications" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
