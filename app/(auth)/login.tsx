import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!username || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(username, password);
      router.replace("/(app)/dashboard" as any);
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-slate-100">
      <View className="flex-1 justify-center items-center px-6">
        <View className="mb-8 items-center">
          <Text className="text-4xl font-bold text-slate-800 mb-2">MecConnect</Text>
          <Text className="text-slate-600 text-base">Painel de Administração</Text>
        </View>

        <View className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <Text className="text-2xl font-bold text-slate-800 mb-6">Entrar</Text>

          <View className="mb-4">
            <Text className="text-slate-700 font-semibold mb-2">Utilizador</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Digite seu utilizador"
              autoCapitalize="none"
              autoCorrect={false}
              className="bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-base"
            />
          </View>

          <View className="mb-6">
            <Text className="text-slate-700 font-semibold mb-2">Senha</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              className="bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-base"
            />
          </View>

          {error ? (
            <View className="mb-4 bg-red-50 border border-red-300 rounded-lg p-3">
              <Text className="text-red-700 text-sm">{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={`bg-blue-600 rounded-lg py-3 items-center ${isLoading ? "opacity-50" : ""}`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-8">
          <Text className="text-slate-500 text-sm text-center">© 2025 MecConnect. Todos os direitos reservados.</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
