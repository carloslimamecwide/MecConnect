import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { ActivityIndicator, DimensionValue, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { AppText } from "./AppText";

type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "info";

interface ButtonProps extends TouchableOpacityProps {
  /** Texto do botão */
  title: string;
  /** Variante de cor do botão */
  variant?: ButtonVariant;
  /** Ícone FontAwesome5 opcional */
  icon?: string;
  /** Tamanho do ícone */
  iconSize?: number;
  /** Mostra loading */
  isLoading?: boolean;
  /** Texto enquanto carrega */
  loadingText?: string;
  /** Largura do botãos */
  width?: string;
  /** Desabilita o botão */
  disabled?: boolean;
}

const variantStyles: Record<ButtonVariant, { backgroundColor: string; textColor: string; borderColor: string }> = {
  primary: { backgroundColor: "#0066CC", textColor: "#ffffff", borderColor: "rgba(255,255,255,0.16)" },
  secondary: { backgroundColor: "#6b7280", textColor: "#ffffff", borderColor: "rgba(255,255,255,0.12)" },
  success: { backgroundColor: "#10b981", textColor: "#ffffff", borderColor: "rgba(255,255,255,0.16)" },
  danger: { backgroundColor: "#ef4444", textColor: "#ffffff", borderColor: "rgba(255,255,255,0.16)" },
  warning: { backgroundColor: "#f59e0b", textColor: "#ffffff", borderColor: "rgba(255,255,255,0.16)" },
  info: { backgroundColor: "#3b82f6", textColor: "#ffffff", borderColor: "rgba(255,255,255,0.16)" },
};

export function Button({
  title,
  variant = "primary",
  icon,
  iconSize = 14,
  isLoading = false,
  loadingText,
  width = "100%",
  disabled,
  style,
  className,
  ...props
}: ButtonProps) {
  const { backgroundColor, textColor, borderColor } = variantStyles[variant];
  const isDisabled = !!disabled || !!isLoading;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      activeOpacity={0.85}
      className={`rounded-xl py-2 px-4 items-center flex-row justify-center gap-3 ${className || ""}`}
      style={[
        {
          backgroundColor,
          width: (width as DimensionValue) || null,
          minHeight: 20,
          borderWidth: 1,
          borderColor,
          shadowColor: "#000",
          shadowOpacity: isDisabled ? 0 : 0.25,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
          elevation: isDisabled ? 0 : 3,
          opacity: isDisabled ? 0.55 : isLoading ? 0.85 : 1,
        },
        style,
      ]}
      {...props}
    >
      {isLoading ? (
        <>
          <ActivityIndicator color={textColor} size="small" />
          <AppText className="font-bold text-base" style={{ color: textColor }}>
            {loadingText || title}
          </AppText>
        </>
      ) : (
        <>
          {icon && <FontAwesome5 name={icon as any} size={iconSize} color={textColor} />}
          <AppText className="font-bold text-base" style={{ color: textColor }}>
            {title}
          </AppText>
        </>
      )}
    </TouchableOpacity>
  );
}
