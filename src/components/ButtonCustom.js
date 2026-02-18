import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import colors from "../theme/colors";

export default function CustomButton({ onPress, children, variant = "primary", disabled = false, loading = false }) {
  const isOutline = variant === "outline";
  return (
    <Pressable
      onPress={disabled || loading ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        isOutline && styles.buttonOutline,
        pressed && !disabled && !loading && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={isOutline ? colors.brand : "#FFFFFF"} />
      ) : (
        <Text style={[styles.text, isOutline && styles.textOutline]}>{children}</Text>
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.brand,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.brand,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  textOutline: {
    color: colors.brand,
  },
});
