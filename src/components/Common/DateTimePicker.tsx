import { AppText } from "@/src/components/Common/AppText";
import { Button } from "@/src/components/Common/Button";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Modal, Platform, TouchableOpacity, View } from "react-native";

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

export const DateTimePicker = forwardRef<BottomSheet, DateTimePickerProps>(
  ({ value, onChange, minimumDate, maximumDate }, ref) => {
    const [showAndroidPicker, setShowAndroidPicker] = useState(false);
    const [showWebModal, setShowWebModal] = useState(false);
    const [androidStep, setAndroidStep] = useState<"date" | "time">("date");
    const [androidDraft, setAndroidDraft] = useState<Date>(value);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["55%"], []);

    useImperativeHandle(ref, () => ({
      expand: () => {
        if (Platform.OS === "android") {
          setAndroidDraft(value);
          setAndroidStep("date");
          setShowAndroidPicker(true);
        } else if (Platform.OS === "web") {
          setShowWebModal(true);
        } else {
          bottomSheetRef.current?.expand();
        }
      },
      close: () => {
        if (Platform.OS === "android") {
          setShowAndroidPicker(false);
          setAndroidStep("date");
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

    const clampDateTime = (date: Date) => {
      let next = new Date(date);
      if (minimumDate && next < minimumDate) {
        next = new Date(minimumDate);
      }
      if (maximumDate && next > maximumDate) {
        next = new Date(maximumDate);
      }
      return next;
    };

    const handleAndroidChange = (event: any, selectedDate?: Date) => {
      if (event?.type === "dismissed") {
        setShowAndroidPicker(false);
        setAndroidStep("date");
        return;
      }

      if (!selectedDate) {
        return;
      }

      if (androidStep === "date") {
        const next = clampDateTime(new Date(selectedDate));
        setAndroidDraft(next);
        setAndroidStep("time");
        return;
      }

      const next = new Date(androidDraft);
      next.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
      onChange(clampDateTime(next));
      setShowAndroidPicker(false);
      setAndroidStep("date");
    };

    if (Platform.OS === "android") {
      return (
        <>
          {showAndroidPicker && (
            <RNDateTimePicker
              value={androidDraft}
              mode={androidStep}
              display="default"
              onChange={handleAndroidChange}
              minimumDate={androidStep === "date" ? minimumDate : undefined}
              maximumDate={androidStep === "date" ? maximumDate : undefined}
            />
          )}
        </>
      );
    }

    if (Platform.OS === "web") {
      const formatDateInput = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const formatTimeInput = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
      };

      const formatLabel = (date: Date) =>
        date.toLocaleString("pt-PT", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

      const handleWebDateChange = (dateString: string) => {
        const [year, month, day] = dateString.split("-");
        const next = new Date(value);
        next.setFullYear(Number(year), Number(month) - 1, Number(day));
        onChange(clampDateTime(next));
      };

      const handleWebTimeChange = (timeString: string) => {
        const [hours, minutes] = timeString.split(":");
        const next = new Date(value);
        next.setHours(Number(hours), Number(minutes), 0, 0);
        onChange(clampDateTime(next));
      };

      const handleClose = () => setShowWebModal(false);

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
              onPress={(event) => event.stopPropagation()}
              style={{
                backgroundColor: "#0a1a2b",
                borderRadius: 16,
                padding: 24,
                width: "90%",
                maxWidth: 420,
              }}
            >
              <View style={{ marginBottom: 16 }}>
                <AppText className="text-xl font-bold text-gray-100 mb-1">Selecionar data e hora</AppText>
                <AppText className="text-sm text-gray-400">Agende a divulgação para web, iOS e Android</AppText>
              </View>

              <View className="rounded-xl border border-white/10 bg-white/5 p-4 mb-4">
                <AppText className="text-xs text-gray-400 mb-1">Selecionado</AppText>
                <AppText className="text-lg font-semibold text-gray-100">{formatLabel(value)}</AppText>
              </View>

              <View className="gap-4 mb-4">
                <View>
                  <AppText className="text-xs text-gray-400 mb-2">Data</AppText>
                  <input
                    type="date"
                    value={formatDateInput(value)}
                    onChange={(event: any) => handleWebDateChange(event.target.value)}
                    min={minimumDate ? formatDateInput(minimumDate) : undefined}
                    max={maximumDate ? formatDateInput(maximumDate) : undefined}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      padding: "12px",
                      color: "#ffffff",
                      fontSize: "16px",
                      width: "100%",
                      colorScheme: "dark",
                    }}
                  />
                </View>

                <View>
                  <AppText className="text-xs text-gray-400 mb-2">Hora</AppText>
                  <input
                    type="time"
                    value={formatTimeInput(value)}
                    onChange={(event: any) => handleWebTimeChange(event.target.value)}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      padding: "12px",
                      color: "#ffffff",
                      fontSize: "16px",
                      width: "100%",
                      colorScheme: "dark",
                    }}
                  />
                </View>
              </View>

              <Button title="Confirmar" variant="info" onPress={handleClose} />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      );
    }

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: "#0a1a2b" }}
        handleIndicatorStyle={{ backgroundColor: "rgba(255,255,255,0.3)", width: 40 }}
      >
        <BottomSheetView style={{ flex: 1, padding: 20 }}>
          <View className="mb-4">
            <AppText className="text-xl font-bold text-gray-100 mb-1">Selecionar data e hora</AppText>
            <AppText className="text-sm text-gray-400">Agende a divulgação</AppText>
          </View>

          <View className="flex-1 items-center justify-center">
            <RNDateTimePicker
              value={value}
              mode="datetime"
              display="spinner"
              onChange={(_, selectedDate) => {
                if (selectedDate) {
                  onChange(clampDateTime(selectedDate));
                }
              }}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              themeVariant="dark"
              accentColor="#3b82f6"
              textColor="#ffffff"
              style={{ width: "100%", height: 200 }}
            />
          </View>

          <Button title="Confirmar" variant="info" onPress={() => bottomSheetRef.current?.close()} className="mt-4" />
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

DateTimePicker.displayName = "DateTimePicker";
