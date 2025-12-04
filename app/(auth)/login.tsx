import { useIsDesktop } from "@/src/hooks/useIsDesktop";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppText } from "../../src/components/Common/AppText";
import { DismissKeyboard } from "../../src/components/Common/DismissKeyboard";
import BrandBackground from "../../src/components/branding/BrandBackground";
import { useAuth } from "../../src/contexts/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const isDesktop = useIsDesktop();
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
      {/* Marca d'água com o M da Mecwide */}
      <BrandBackground opacity={0.1} />

      <DismissKeyboard>
        <View className="flex-1 justify-center items-center px-6" style={{ zIndex: 1 }}>
          {/* Logo Mecwide no canto superior direito */}
          <View className="absolute left-4 top-10 items-start">
            <Image
              source={require("../../assets/images/LOGOTIPO_MECWIDE_BRANCO.png")}
              style={{ width: isDesktop ? 230 : 130, height: isDesktop ? 110 : 60 }}
            />
          </View>

          <View className="items-center">
            <Image
              source={require("../../assets/images/icon.png")}
              style={{ width: isDesktop ? 230 : 180, height: isDesktop ? 125 : 80 }}
              resizeMode="contain"
            />
            {/* <AppText className="text-base" style={{ color: "rgba(255,255,255,0.75)" }}>
              Painel de Administração
            </AppText> */}
          </View>

          <View className={`w-full max-w-md ${Platform.OS === "android" ? "pb-20" : ""}`}>
            <View className="mb-8">
              <AppText className="text-2xl font-bold mb-6" style={{ color: "#FFFFFF" }}>
                Entrar
              </AppText>

              <View className="mb-6">
                <AppText className="text-slate-300 font-semibold mb-3">CV</AppText>
                <TextInput
                  value={cv}
                  onChangeText={setCv}
                  placeholder="Digite seu CV"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  className="border-b border-slate-400 px-0 py-3 text-base"
                  style={{ color: "#FFFFFF" }}
                />
              </View>

              <View className="mb-8">
                <AppText className="text-slate-300 font-semibold mb-3">Senha</AppText>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Digite sua senha"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="border-b border-slate-400 px-0 py-3 text-base"
                  style={{ color: "#FFFFFF" }}
                />
              </View>

              {error ? (
                <View className="mb-6 bg-red-500/20 border border-red-400 rounded-lg p-4">
                  <AppText className="text-red-300 text-sm">{error}</AppText>
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
                  <AppText className="text-white font-bold text-base">Entrar</AppText>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View className={`${Platform.OS === "android" ? "pb-20" : "mt-8"}`}>
            <AppText className="text-slate-300 text-sm text-center">
              © 2025 Mecwide. Todos os direitos reservados.
            </AppText>
          </View>
        </View>
      </DismissKeyboard>
    </KeyboardAvoidingView>
  );
}
