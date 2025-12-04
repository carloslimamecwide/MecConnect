import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState } from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import { AppText } from "./AppText";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function Select({ options, value, onChange, placeholder = "Selecionar...", isLoading = false }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        disabled={isLoading}
        className="border border-slate-400 rounded-lg px-3 py-3 flex-row items-center justify-between"
        style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      >
        <AppText style={{ color: value ? "#FFFFFF" : "rgba(255,255,255,0.5)" }} className="text-base">
          {selectedLabel}
        </AppText>
        <FontAwesome5 name="chevron-down" size={14} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
          className="flex-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <View className="flex-1 justify-center items-center px-4">
            <View
              className="w-full rounded-lg overflow-hidden"
              style={{ backgroundColor: "#1a2a3b", maxHeight: "80%" }}
            >
              <View className="px-4 py-3 border-b border-white/10">
                <AppText className="text-lg font-bold text-white">Selecionar segmento</AppText>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className="px-4 py-3 border-b border-white/10 flex-row items-center justify-between"
                    activeOpacity={0.7}
                  >
                    <AppText
                      className={`text-base ${value === option.value ? "font-bold text-blue-400" : "text-gray-300"}`}
                    >
                      {option.label}
                    </AppText>
                    {value === option.value && <FontAwesome5 name="check" size={16} color="#3b82f6" />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
