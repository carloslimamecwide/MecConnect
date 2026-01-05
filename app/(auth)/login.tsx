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
import { authService } from "../../src/services/authService";

export default function LoginScreen() {
  const { login } = useAuth();
  const isDesktop = useIsDesktop();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const showSplitLayout = isWeb && isDesktop;
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
      const loggedUser = await authService.getUser();
      const isDeveloper = loggedUser?.roleIt === "developer";
      router.replace(isDeveloper ? "/(app)/mode-selection" : "/(app)/(communication)/dashboard");
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
            paddingBottom: isWeb ? 32 + insets.bottom : Platform.OS === "android" ? 100 : 0,
            paddingTop: isWeb ? 40 : 0,
          }}
          style={{ flex: 1 }}
        >
          <View className="flex-1 justify-center items-center px-6" style={{ zIndex: 1 }}>
            {showSplitLayout ? (
              <View className="w-full" style={{ maxWidth: 1200 }}>
                <View className="rounded-[32px] border border-white/10 bg-white/5 overflow-hidden">
                  <View className="flex-row items-stretch">
                    <View className="flex-1 p-9 relative overflow-hidden">
                      <View className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-sky-500/15" />
                      <View className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-emerald-500/15" />

                      <View className="flex-row items-center justify-between mb-10">
                        <Image
                          source={require("../../assets/images/LOGOTIPO_MECWIDE_BRANCO.png")}
                          style={{ width: 190, height: 70 }}
                          resizeMode="contain"
                        />
                        <View className="rounded-full px-3 py-1 border border-white/10 bg-white/5">
                          <AppText className="text-[10px] text-blue-200 uppercase tracking-[2px]">
                            MecConnect Admin
                          </AppText>
                        </View>
                      </View>

                      <AppText className="text-4xl font-bold text-gray-100 mb-3">
                        Onde a comunicação interna ganha ritmo.
                      </AppText>
                      <AppText className="text-sm text-gray-300">
                        Gerencie conteúdos críticos, eventos e campanhas com clareza e rapidez.
                      </AppText>

                      <View className="flex-row flex-wrap gap-2 mt-6">
                        {["Formulários", "Eventos", "Rewards", "Notificações"].map((item) => (
                          <View key={item} className="rounded-full px-3 py-1 bg-white/5 border border-white/10">
                            <AppText className="text-[11px] text-gray-300">{item}</AppText>
                          </View>
                        ))}
                      </View>

                      <View className="gap-3 mt-8">
                        {[
                          { icon: "bullhorn", label: "Campanhas e anúncios organizados" },
                          { icon: "calendar-alt", label: "Calendário de eventos centralizado" },
                          { icon: "gift", label: "Rewards e incentivos monitorizados" },
                          { icon: "bell", label: "Alertas e comunicados imediatos" },
                        ].map((item) => (
                          <View key={item.label} className="flex-row items-center gap-3">
                            <View className="h-9 w-9 rounded-xl items-center justify-center bg-white/10 border border-white/10">
                              <FontAwesome5 name={item.icon as any} size={14} color="#93c5fd" />
                            </View>
                            <AppText className="text-sm text-gray-200">{item.label}</AppText>
                          </View>
                        ))}
                      </View>

                      <View className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <AppText className="text-xs text-gray-400">
                          Acesso protegido com autenticação e permissões por perfil.
                        </AppText>
                      </View>
                    </View>

                    <View
                      className="w-full border-l border-white/10 bg-white/5 p-6"
                      style={{ maxWidth: 420 }}
                    >
                      <View className="mb-6 flex-row items-center gap-3">
                        <View className="h-12 w-12 rounded-2xl items-center justify-center bg-blue-500/20 border border-blue-400/30">
                          <FontAwesome5 name="shield-alt" size={16} color="#60a5fa" />
                        </View>
                        <View>
                          <AppText className="text-xs text-blue-200 uppercase tracking-widest">Área reservada</AppText>
                          <AppText className="text-2xl font-bold text-gray-100">Entrar</AppText>
                        </View>
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

                      <AppText className="text-[11px] text-gray-400 mt-4 text-center">
                        O seu acesso é registado para auditoria interna.
                      </AppText>
                    </View>
                  </View>
                </View>

                <View className="mt-6">
                  <AppText className="text-slate-300 text-sm text-center">
                    © 2025 Mecwide. Todos os direitos reservados.
                  </AppText>
                </View>
              </View>
            ) : (
              <>
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
                      <AppText className="text-xs text-blue-200 uppercase tracking-widest mb-2">
                        MecConnect Admin
                      </AppText>
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
                    bottom: Platform.OS === "android" ? 0 : 20 + insets.bottom,
                  }}
                >
                  <AppText className="text-slate-300 text-sm text-center">
                    © 2025 Mecwide. Todos os direitos reservados.
                  </AppText>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </DismissKeyboard>
    </KeyboardAvoidingView>
  );
}
