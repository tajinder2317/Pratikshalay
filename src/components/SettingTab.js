import { useContext, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";
import ButtonCustom from "./ButtonCustom";
import AuthContext from "../context/AuthContext";

export default function SettingsTab({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(false);
  const [privacy, setPrivacy] = useState(true);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.accountName}>{user?.name || "Guest User"}</Text>
            <Text style={styles.accountEmail}>{user?.email || "Not signed in"}</Text>
          </View>
          <ButtonCustom variant="outline" onPress={() => setUser(null)}>
            Log Out
          </ButtonCustom>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preferences</Text>
          <SettingRow
            icon="notifications-outline"
            label="Push Notifications"
            value={notifications}
            onToggle={() => setNotifications((prev) => !prev)}
          />
          <SettingRow
            icon="alarm-outline"
            label="Appointment Reminders"
            value={reminders}
            onToggle={() => setReminders((prev) => !prev)}
          />
          <SettingRow
            icon="shield-checkmark-outline"
            label="Share Data for Better Care"
            value={privacy}
            onToggle={() => setPrivacy((prev) => !prev)}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>More</Text>
          <LinkRow
            icon="person-outline"
            label="Edit Profile"
            onPress={() => navigation.navigate("EditProfile")}
          />
          <LinkRow
            icon="lock-closed-outline"
            label="Change Password"
            onPress={() => {}}
          />
          <LinkRow
            icon="help-circle-outline"
            label="Support"
            onPress={() => {}}
          />
        </View>

        <Text style={styles.version}>Pratikshalay v1.0</Text>
      </ScrollView>
    </View>
  );
}

function SettingRow({ icon, label, value, onToggle }) {
  return (
    <Pressable style={styles.settingRow} onPress={onToggle}>
      <View style={styles.settingRowLeft}>
        <Ionicons name={icon} size={18} color={colors.textMuted} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <View style={[styles.toggle, value && styles.toggleActive]}>
        <View style={[styles.toggleDot, value && styles.toggleDotActive]} />
      </View>
    </Pressable>
  );
}

function LinkRow({ icon, label, onPress }) {
  return (
    <Pressable style={styles.linkRow} onPress={onPress}>
      <View style={styles.linkRowLeft}>
        <Ionicons name={icon} size={18} color={colors.textMuted} />
        <Text style={styles.linkText}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
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
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    alignItems: "center",
    gap: 10,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brandLight,
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.brand,
  },
  profileInfo: {
    alignItems: "center",
  },
  accountName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  accountEmail: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: 4,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  settingLabel: {
    fontSize: 14,
    color: colors.text,
  },
  toggle: {
    width: 42,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.chip,
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 2,
  },
  toggleActive: {
    backgroundColor: colors.brandLight,
    alignItems: "flex-end",
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.textMuted,
  },
  toggleDotActive: {
    backgroundColor: colors.brand,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  linkRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  linkText: {
    fontSize: 14,
    color: colors.text,
  },
  version: {
    marginTop: 8,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
  },
});
