import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps } from "react-native";
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
  /** Ocupa largura total */
  fullWidth?: boolean;
  /** Desabilita o botão */
  disabled?: boolean;
}

const variantStyles: Record<ButtonVariant, { backgroundColor: string; textColor: string }> = {
  primary: { backgroundColor: "#0066CC", textColor: "#ffffff" },
  secondary: { backgroundColor: "#6b7280", textColor: "#ffffff" },
  success: { backgroundColor: "#10b981", textColor: "#ffffff" },
  danger: { backgroundColor: "#ef4444", textColor: "#ffffff" },
  warning: { backgroundColor: "#f59e0b", textColor: "#ffffff" },
  info: { backgroundColor: "#3b82f6", textColor: "#ffffff" },
};

export function Button({
  title,
  variant = "primary",
  icon,
  iconSize = 16,
  isLoading = false,
  loadingText,
  fullWidth = true,
  disabled,
  style,
  className,
  ...props
}: ButtonProps) {
  const { backgroundColor, textColor } = variantStyles[variant];
  const isDisabled = !!disabled || !!isLoading;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      className={`rounded-lg py-3 px-6 items-center flex-row justify-center gap-3 ${className || ""}`}
      style={[
        {
          backgroundColor,
          width: fullWidth ? "100%" : "auto",
          minHeight: 40,
          opacity: isDisabled ? 0.5 : isLoading ? 0.8 : 1,
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
