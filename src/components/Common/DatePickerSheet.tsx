import { AppText } from "@/src/components/Common/AppText";
import { Button } from "@/src/components/Common/Button";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Modal, Platform, TouchableOpacity, View } from "react-native";

interface DatePickerSheetProps {
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

export const DatePickerSheet = forwardRef<BottomSheet, DatePickerSheetProps>(
  ({ value, onChange, minimumDate, maximumDate }, ref) => {
    const [showAndroidPicker, setShowAndroidPicker] = useState(false);
    const [showWebModal, setShowWebModal] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["45%"], []);

    // Expõe métodos para abrir/fechar o picker
    useImperativeHandle(ref, () => ({
      expand: () => {
        if (Platform.OS === "android") {
          setShowAndroidPicker(true);
        } else if (Platform.OS === "web") {
          setShowWebModal(true);
        } else {
          // iOS - usa o BottomSheet normal
          bottomSheetRef.current?.expand();
        }
      },
      close: () => {
        if (Platform.OS === "android") {
          setShowAndroidPicker(false);
        } else if (Platform.OS === "web") {
          setShowWebModal(false);
        } else {
          bottomSheetRef.current?.close();
        }
      },
      // @ts-ignore - mantém compatibilidade com BottomSheet
      snapToIndex: (index: number) => {
        bottomSheetRef.current?.snapToIndex(index);
      },
      // @ts-ignore
      snapToPosition: (position: number) => {
        bottomSheetRef.current?.snapToPosition(position);
      },
      // @ts-ignore
      forceClose: () => {
        bottomSheetRef.current?.forceClose();
      },
    }));

    const renderBackdrop = useCallback(
      (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />,
      []
    );

    const handleDateChange = (_event: any, selectedDate?: Date) => {
      if (Platform.OS === "android") {
        setShowAndroidPicker(false);
        if (selectedDate) {
          onChange(selectedDate);
        }
      } else if (selectedDate) {
        onChange(selectedDate);
      }
    };

    const handleClose = () => {
      if (Platform.OS === "web") {
        setShowWebModal(false);
      } else {
        bottomSheetRef.current?.close();
      }
    };

    // Android: Renderiza apenas o DateTimePicker nativo (abre dialog automaticamente)
    if (Platform.OS === "android") {
      return (
        <>
          {showAndroidPicker && (
            <DateTimePicker
              value={value}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
            />
          )}
        </>
      );
    }

    // Web: Usa Modal com input type="date"
    if (Platform.OS === "web") {
      const formatDateForInput = (date: Date) => {
        return date.toISOString().split("T")[0];
      };

      const handleWebDateChange = (dateString: string) => {
        const newDate = new Date(dateString + "T00:00:00");
        if (!isNaN(newDate.getTime())) {
          onChange(newDate);
        }
      };

      return (
        <Modal visible={showWebModal} transparent animationType="fade" onRequestClose={handleClose}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleClose}
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "#1e293b",
                borderRadius: 16,
                padding: 24,
                width: "90%",
                maxWidth: 400,
              }}
            >
              <View style={{ marginBottom: 16 }}>
                <AppText className="text-xl font-bold text-gray-100 mb-1">Selecionar Data</AppText>
                <AppText className="text-sm text-gray-400">Escolha a data de expiração</AppText>
              </View>

              <input
                type="date"
                value={formatDateForInput(value)}
                onChange={(e: any) => handleWebDateChange(e.target.value)}
                min={minimumDate ? formatDateForInput(minimumDate) : undefined}
                max={maximumDate ? formatDateForInput(maximumDate) : undefined}
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "12px",
                  color: "#ffffff",
                  fontSize: "16px",
                  marginBottom: "16px",
                  width: "100%",
                  colorScheme: "dark",
                }}
              />

              <Button title="Confirmar" variant="info" onPress={handleClose} />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      );
    }

    // iOS: Usa BottomSheet como antes
    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: "#1e293b" }}
        handleIndicatorStyle={{ backgroundColor: "rgba(255,255,255,0.3)", width: 40 }}
      >
        <BottomSheetView style={{ flex: 1, padding: 20 }}>
          <View className="mb-4">
            <AppText className="text-xl font-bold text-gray-100 mb-1">Selecionar Data</AppText>
            <AppText className="text-sm text-gray-400">Escolha a data de expiração</AppText>
          </View>

          <View className="flex-1 items-center justify-center">
            <DateTimePicker
              value={value}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              themeVariant="dark"
              accentColor="#3b82f6"
              textColor="#ffffff"
              style={{ width: "100%", height: 200 }}
            />
          </View>

          <Button title="Confirmar" variant="info" onPress={handleClose} className="mt-4" />
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

DatePickerSheet.displayName = "DatePickerSheet";
