import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User } from "../types/auth";

export interface UseSettingsReturn {
  user: User | null;
  appVersion: string;
  appName: string;
  router: any;
  showLogoutConfirm: boolean;
  setShowLogoutConfirm: (value: boolean) => void;
  isLoggingOut: boolean;
  handleLogoutConfirm: () => Promise<void>;
}

function useSettings(): UseSettingsReturn {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const appVersion = Constants.expoConfig?.version || "1.0.0";
  const appName = Constants.expoConfig?.name || "MecConnect";

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutConfirm(false);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return {
    user,
    appVersion,
    appName,
    router,
    showLogoutConfirm,
    setShowLogoutConfirm,
    isLoggingOut,
    handleLogoutConfirm,
  };
}

export default useSettings;
