import { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import ButtonCustom from "../../components/ButtonCustom";
import colors from "../../theme/colors";
import { api } from "../../api/client";

const normalizeEmail = (value) => value.trim().toLowerCase();

export default function LoginScreen({ onAuth, navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleLogin = async () => {
    setStatus("");
    try {
      const user = await api.login({
        email: normalizeEmail(email),
        password,
      });
      onAuth(user);
    } catch (err) {
      setStatus(err?.message || "Login failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <ButtonCustom onPress={handleLogin}>Login</ButtonCustom>
        {status ? <Text style={styles.status}>{status}</Text> : null}

        <Text style={styles.switchText}>
          New here?{" "}
          <Text style={styles.linkText} onPress={() => navigation.navigate("Signup")}>Sign Up</Text>
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 50,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
  },
  input: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    fontSize: 13,
    color: colors.text,
    backgroundColor: "#FFFFFF",
  },
  status: {
    fontSize: 12,
    color: colors.brand,
  },
  switchText: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textMuted,
  },
  linkText: {
    color: colors.brand,
    fontWeight: "600",
  },
});
