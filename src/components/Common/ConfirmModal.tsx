import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { ActivityIndicator, Modal, TouchableOpacity, View } from "react-native";
import { AppText } from "./AppText";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isDangerous?: boolean;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  isLoading = false,
  isDangerous = false,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        activeOpacity={1}
        onPress={onCancel}
        disabled={isLoading}
        className="flex-1"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      >
        <View className="flex-1 justify-center items-center px-4">
          <TouchableOpacity
            activeOpacity={1}
            className="w-full rounded-lg overflow-hidden"
            style={{ backgroundColor: "#1a2a3b", maxWidth: 360 }}
          >
            {/* Header */}
            <View className="px-6 py-4 border-b border-white/10">
              <AppText className="text-lg font-bold text-white">{title}</AppText>
            </View>

            {/* Content */}
            <View className="px-6 py-6">
              <AppText className="text-gray-300 text-base leading-6">{message}</AppText>
            </View>

            {/* Buttons */}
            <View className="flex-row px-6 pb-4 gap-3">
              <TouchableOpacity
                onPress={onCancel}
                disabled={isLoading}
                className={`flex-1 rounded-lg py-3 items-center border border-gray-600 ${
                  isLoading ? "opacity-50" : ""
                }`}
              >
                <AppText className="text-gray-300 font-semibold text-base">{cancelText}</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onConfirm}
                disabled={isLoading}
                className={`flex-1 rounded-lg py-3 items-center flex-row justify-center gap-2 ${
                  isLoading ? "opacity-50" : ""
                }`}
                style={{
                  backgroundColor: isDangerous ? "#ef4444" : "#10b981",
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <FontAwesome5 name={isDangerous ? "" : "check"} size={16} color="white" />
                )}
                <AppText className="text-white font-semibold text-base">
                  {isLoading ? "Processando..." : confirmText}
                </AppText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
