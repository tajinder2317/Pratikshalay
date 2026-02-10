import { useContext, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../theme/colors";
import ButtonCustom from "./ButtonCustom";
import AuthContext from "../context/AuthContext";

export default function SettingsTab() {
  const { user, setUser } = useContext(AuthContext);
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(false);
  const [privacy, setPrivacy] = useState(true);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>
          <Text style={styles.accountName}>{user?.name || "Guest User"}</Text>
          <Text style={styles.accountEmail}>{user?.email || "Not signed in"}</Text>
          <ButtonCustom variant="outline" onPress={() => setUser(null)}>
            Log Out
          </ButtonCustom>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preferences</Text>
          <SettingRow
            label="Push Notifications"
            value={notifications}
            onToggle={() => setNotifications((prev) => !prev)}
          />
          <SettingRow
            label="Appointment Reminders"
            value={reminders}
            onToggle={() => setReminders((prev) => !prev)}
          />
          <SettingRow
            label="Share Data for Better Care"
            value={privacy}
            onToggle={() => setPrivacy((prev) => !prev)}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>
          <Pressable style={styles.linkRow}>
            <Text style={styles.linkText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </Pressable>
          <Pressable style={styles.linkRow}>
            <Text style={styles.linkText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </Pressable>
          <Pressable style={styles.linkRow}>
            <Text style={styles.linkText}>Support</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </Pressable>
        </View>

        <Text style={styles.version}>Pratikshalay v1.0</Text>
      </ScrollView>
    </View>
  );
}

function SettingRow({ label, value, onToggle }) {
  return (
    <Pressable style={styles.settingRow} onPress={onToggle}>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={[styles.toggle, value && styles.toggleActive]}>
        <View style={[styles.toggleDot, value && styles.toggleDotActive]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: 8,
  },
  accountName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  accountEmail: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  settingLabel: {
    fontSize: 13,
    color: colors.text,
  },
  toggle: {
    width: 38,
    height: 20,
    borderRadius: 20,
    backgroundColor: colors.chip,
    alignItems: "flex-start",
    padding: 2,
  },
  toggleActive: {
    backgroundColor: colors.brandLight,
    alignItems: "flex-end",
  },
  toggleDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.textMuted,
  },
  toggleDotActive: {
    backgroundColor: colors.brand,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 13,
    color: colors.text,
  },
  version: {
    marginTop: 8,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
  },
});
