import Loading from "@/src/components/Common/Loading";
import { Redirect } from "expo-router";
import { useAuth } from "../src/contexts/AuthContext";
export default function Index() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <Loading message="Verificando autenticação..." size="large" />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/dashboard" />;
  }

  return <Redirect href="/(auth)/login" />;
}
