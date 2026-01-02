import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";

const BIOMETRIC_KEY = "@mecconnect:biometric_enabled";

export async function isBiometricAvailable() {
  return (await LocalAuthentication.hasHardwareAsync()) && (await LocalAuthentication.isEnrolledAsync());
}

export async function enableBiometric() {
  await AsyncStorage.setItem(BIOMETRIC_KEY, "true");
}

export async function disableBiometric() {
  await AsyncStorage.removeItem(BIOMETRIC_KEY);
}

export async function isBiometricEnabled() {
  const enabled = await AsyncStorage.getItem(BIOMETRIC_KEY);
  return enabled === "true";
}

export async function authenticateBiometric() {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Autentique-se para acessar o MecConnect",
    fallbackLabel: "Usar senha",
    cancelLabel: "Cancelar",
    disableDeviceFallback: false,
  });
  return result.success;
}
