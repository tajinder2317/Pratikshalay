import { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import ButtonCustom from "../../components/ButtonCustom";
import colors from "../../theme/colors";
import { api } from "../../api/client";

export default function SignupScreen({ onAuth, navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleSignup = async () => {
    setStatus("");
    try {
      const user = await api.signUp({ name, email, password, allowReplace: true });
      onAuth(user);
    } catch (err) {
      setStatus(err?.message || "Sign up failed. Email may already exist.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start booking doctors easily</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your Name"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <ButtonCustom onPress={handleSignup}>Create Account</ButtonCustom>
        {status ? <Text style={styles.status}>{status}</Text> : null}

        <Text style={styles.switchText}>
          Already have an account?{" "}
          <Text style={styles.linkText} onPress={() => navigation.navigate("Login")}>Login</Text>
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
