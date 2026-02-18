import { useContext, useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ButtonCustom from "../../components/ButtonCustom";
import colors from "../../theme/colors";
import { api } from "../../api/client";
import AuthContext from "../../context/AuthContext";

export default function EditProfile({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = async () => {
    setStatus("");
    if (!name.trim() || !email.trim()) {
      setStatus("Name and email are required.");
      return;
    }
    setSaving(true);
    try {
      const updated = await api.updateProfile({
        userId: user.id,
        name: name.trim(),
        email: email.trim(),
      });
      setUser(updated);
      setStatus("Profile updated successfully.");
      setIsSuccess(true);
    } catch (err) {
      setStatus(err?.message || "Failed to update profile.");
      setIsSuccess(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.topTitle}>Edit Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name ? name.charAt(0).toUpperCase() : "?"}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
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
            keyboardType="email-address"
          />

          <ButtonCustom onPress={handleSave} loading={saving} disabled={saving}>
            Save Changes
          </ButtonCustom>
          {status ? (
            <View style={[styles.statusRow, isSuccess ? styles.statusSuccess : styles.statusError]}>
              <Ionicons
                name={isSuccess ? "checkmark-circle" : "alert-circle"}
                size={14}
                color={isSuccess ? colors.success : colors.error}
              />
              <Text style={[styles.statusText, isSuccess ? { color: colors.success } : { color: colors.error }]}>{status}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    height: 56,
    backgroundColor: colors.brand,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
  },
  backButton: {
    padding: 6,
  },
  topTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    padding: 16,
    paddingBottom: 24,
    gap: 16,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.brandLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.brand,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
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
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusSuccess: {
    backgroundColor: colors.successLight,
  },
  statusError: {
    backgroundColor: colors.errorLight,
  },
  statusText: {
    fontSize: 12,
  },
});
