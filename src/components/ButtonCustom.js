import { Pressable, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";

export default function CustomButton({ onPress, children, variant = "primary" }) {
  const isOutline = variant === "outline";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isOutline && styles.buttonOutline,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, isOutline && styles.textOutline]}>{children}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.brand,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.brand,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  textOutline: {
    color: colors.brand,
  },
});
