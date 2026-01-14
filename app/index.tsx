import Loading from "@/src/components/Common/Loading";
import { Redirect } from "expo-router";
import { useAuth } from "../src/contexts/AuthContext";
export default function Index() {
  const { isLoading, isAuthenticated, isSuperAdmin } = useAuth();

  if (isLoading) {
    return <Loading message="Verificando autenticação..." size="large" />;
  }

  if (isAuthenticated) {
    return <Redirect href={isSuperAdmin ? "/(app)/mode-selection" : "/(app)/(communication)/dashboard"} />;
  }

  return <Redirect href="/(auth)/login" />;
}
