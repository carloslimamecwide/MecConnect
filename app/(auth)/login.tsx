import { useIsDesktop } from "@/src/hooks/useIsDesktop";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../../src/components/Common/AppText";
import { Button } from "../../src/components/Common/Button";
import { DismissKeyboard } from "../../src/components/Common/DismissKeyboard";
import BrandBackground from "../../src/components/branding/BrandBackground";
import { useAuth } from "../../src/contexts/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const isDesktop = useIsDesktop();
  const insets = useSafeAreaInsets();
  const [cv, setCv] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      router.replace("/(app)/(tabs)/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
      style={{ backgroundColor: "#0a1a2b" }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      {/* Marca d'água com o M da Mecwide */}
      <BrandBackground opacity={0.1} />

      <DismissKeyboard>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: Platform.OS === "android" ? 100 : 0,
          }}
          style={{ flex: 1 }}
        >
          <View className="flex-1 justify-center items-center px-6" style={{ zIndex: 1 }}>
            <View className={`absolute left-4 ${isDesktop ? "top-0" : "top-12"} items-start`}>
              <Image
                source={require("../../assets/images/LOGOTIPO_MECWIDE_BRANCO.png")}
                style={{ width: isDesktop ? 230 : 130, height: isDesktop ? 110 : 60 }}
                resizeMode="contain"
              />
            </View>

            <View className="items-center" style={{ marginTop: isDesktop ? 64 : 40, marginBottom: 10 }}>
              <Image
                source={require("../../assets/images/icon.png")}
                style={{ width: isDesktop ? 220 : 170, height: isDesktop ? 115 : 80 }}
                resizeMode="contain"
              />
            </View>

            <View className={`w-full max-w-md ${Platform.OS === "android" ? "pb-20" : ""}`}>
              <View className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <View className="mb-6">
                  <AppText className="text-xs text-blue-200 uppercase tracking-widest mb-2">MecConnect Admin</AppText>
                </View>

                <View className="mb-5">
                  <AppText className="text-slate-300 font-semibold mb-2">CV</AppText>
                  <View
                    className="flex-row items-center gap-3 rounded-2xl border border-white/10 bg-white/5"
                    style={{ paddingHorizontal: 16, paddingVertical: Platform.OS === "android" ? 6 : 12 }}
                  >
                    <TextInput
                      value={cv}
                      onChangeText={setCv}
                      placeholder="Digite o seu CV"
                      placeholderTextColor="rgba(255,255,255,0.45)"
                      autoCapitalize="characters"
                      autoCorrect={false}
                      returnKeyType="next"
                      allowFontScaling={Platform.OS !== "android"}
                      className="flex-1 text-white"
                      style={[{ outline: "none" } as any, { fontSize: Platform.OS === "android" ? 14 : 16 }]}
                    />
                  </View>
                  <AppText className="text-xs text-gray-400 mt-2">Use o CV em maiúsculas.</AppText>
                </View>

                <View className="mb-6">
                  <View className="flex-row items-center justify-between mb-2">
                    <AppText className="text-slate-300 font-semibold">Senha</AppText>
                    <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                      <AppText className="text-xs text-blue-300">{showPassword ? "Ocultar" : "Mostrar"}</AppText>
                    </TouchableOpacity>
                  </View>
                  <View
                    className="flex-row items-center gap-3 rounded-2xl border border-white/10 bg-white/5"
                    style={{ paddingHorizontal: 16, paddingVertical: Platform.OS === "android" ? 6 : 12 }}
                  >
                    <FontAwesome5 name="lock" size={14} color="rgba(255,255,255,0.5)" />
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Digite a sua senha"
                      placeholderTextColor="rgba(255,255,255,0.45)"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="go"
                      onSubmitEditing={handleLogin}
                      allowFontScaling={Platform.OS !== "android"}
                      className="flex-1 text-white"
                      style={[{ outline: "none" } as any, { fontSize: Platform.OS === "android" ? 14 : 16 }]}
                    />
                  </View>
                </View>

                {error ? (
                  <View className="mb-5 bg-red-500/20 border border-red-400 rounded-xl p-4">
                    <AppText className="text-red-200 text-sm">{error}</AppText>
                  </View>
                ) : null}

                <Button
                  title="Entrar"
                  variant="primary"
                  isLoading={isLoading}
                  disabled={isLoading}
                  onPress={handleLogin}
                />
              </View>
            </View>

            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: Platform.OS === "android" ? 0 : 20,
              }}
            >
              <AppText className="text-slate-300 text-sm text-center">
                © 2025 Mecwide. Todos os direitos reservados.
              </AppText>
            </View>
          </View>
        </ScrollView>
      </DismissKeyboard>
    </KeyboardAvoidingView>
  );
}
