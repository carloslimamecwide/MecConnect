import { AppText } from "@/src/components/Common/AppText";
import { Button } from "@/src/components/Common/Button";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { forwardRef, useCallback, useMemo } from "react";
import { Platform, View } from "react-native";

interface DatePickerSheetProps {
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

export const DatePickerSheet = forwardRef<BottomSheet, DatePickerSheetProps>(
  ({ value, onChange, minimumDate, maximumDate }, ref) => {
    const snapPoints = useMemo(() => [Platform.OS === "ios" ? "45%" : "50%"], []);

    const renderBackdrop = useCallback(
      (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />,
      []
    );

    const handleDateChange = (_event: any, selectedDate?: Date) => {
      if (selectedDate) {
        onChange(selectedDate);
      }
    };

    const handleClose = () => {
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.close();
      }
    };

    return (
      <BottomSheet
        ref={ref}
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
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              themeVariant="dark"
              accentColor="#3b82f6"
              textColor="#ffffff"
              style={{ width: "100%", height: Platform.OS === "ios" ? 200 : "auto" }}
            />
          </View>

          <Button title="Confirmar" variant="info" onPress={handleClose} className="mt-4" />
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

DatePickerSheet.displayName = "DatePickerSheet";
