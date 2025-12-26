import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "./AppText";

type ToastType = "error" | "success" | "info";
type ToastPosition = "top" | "bottom";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  position?: ToastPosition;
  autoHide?: boolean;
  duration?: number; // ms
  onHide?: () => void;
}

export function Toast({
  visible,
  message,
  type = "info",
  position = "top",
  autoHide = false,
  duration = 2500,
  onHide,
}: ToastProps) {
  const insets = useSafeAreaInsets();
  const slide = useRef(new Animated.Value(80)).current; // hidden offset
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide, {
        toValue: visible ? 0 : 80,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (visible && autoHide) {
      timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(slide, {
            toValue: 80,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide?.();
        });
      }, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, autoHide, duration, onHide, slide, opacity]);

  const topOffset = Platform.OS === "android" ? 12 : insets.top + 12;
  const bottomOffset = Platform.OS === "android" ? 12 : insets.bottom + 12;

  const bgColor = type === "error" ? "#ef4444" : type === "success" ? "#10b981" : "#0ea5e9";
  const iconName = type === "error" ? "exclamation-circle" : type === "success" ? "check-circle" : "info-circle";

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        ...(position === "top" ? { top: topOffset } : { bottom: bottomOffset }),
        transform: [{ translateY: slide }],
        opacity,
        alignItems: "center",
      }}
    >
      <View className="flex-row items-center gap-2 px-4 py-3 rounded-full" style={{ backgroundColor: bgColor }}>
        <FontAwesome5 name={iconName as any} size={16} color="#fff" />
        <AppText className="text-white font-semibold">{message}</AppText>
      </View>
    </Animated.View>
  );
}
