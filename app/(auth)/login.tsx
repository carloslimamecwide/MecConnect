import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BrandBackground from "../../src/components/branding/BrandBackground";
import { useAuth } from "../../src/contexts/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [cv, setCv] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!cv || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(cv, password);
      router.replace("/(app)/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: "#0a1a2b" }}
    >
      {/* Marca d'água com o símbolo cut */}
      <BrandBackground color="#FFFFFF" opacity={0.06} />

      <View className="flex-1 justify-center items-center px-6">
        {/* Logo Mecwide no canto superior direito */}
        <View className="absolute left-4 top-20 items-start">
          <Image
            source={require("../../assets/images/LOGOTIPO_MECWIDE_BRANCO.png")}
            style={{ width: 130, height: 60 }}
          />
        </View>

        <View className="mb-8 items-center">
          <Text className="text-4xl font-extrabold mb-1" style={{ color: "#FFFFFF" }}>
            MecConnect
          </Text>
          <Text className="text-base" style={{ color: "rgba(255,255,255,0.75)" }}>
            Painel de Administração
          </Text>
        </View>

        <View className="w-full max-w-md bg-white/95 rounded-2xl shadow-lg p-8">
          <Text className="text-2xl font-bold text-slate-800 mb-6">Entrar</Text>

          <View className="mb-4">
            <Text className="text-slate-700 font-semibold mb-2">CV</Text>
            <TextInput
              value={cv}
              onChangeText={setCv}
              placeholder="Digite seu CV"
              autoCapitalize="characters"
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
            className={`rounded-lg py-3 items-center ${isLoading ? "opacity-50" : ""}`}
            style={{ backgroundColor: "#0066CC" }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-8">
          <Text className="text-slate-300 text-sm text-center">© 2025 Mecwide. Todos os direitos reservados.</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
