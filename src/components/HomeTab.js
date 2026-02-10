import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../theme/colors";
import ButtonCustom from "./ButtonCustom";

export default function HomeTab({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Good day</Text>
          <Text style={styles.heroSubtitle}>Book trusted doctors near you.</Text>
          <ButtonCustom onPress={() => navigation.navigate("Doctors")}>
            Find Doctors
          </ButtonCustom>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <Pressable
              style={styles.actionCard}
              onPress={() => navigation.navigate("Doctors")}
            >
              <Ionicons name="medkit" size={20} color={colors.brand} />
              <Text style={styles.actionText}>Doctors</Text>
            </Pressable>
            <Pressable
              style={styles.actionCard}
              onPress={() => navigation.navigate("History")}
            >
              <Ionicons name="time" size={20} color={colors.brand} />
              <Text style={styles.actionText}>History</Text>
            </Pressable>
            <Pressable
              style={styles.actionCard}
              onPress={() => navigation.navigate("Settings")}
            >
              <Ionicons name="settings" size={20} color={colors.brand} />
              <Text style={styles.actionText}>Settings</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Health Snapshot</Text>
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Doctors Nearby</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Appointments</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips for Today</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Stay hydrated</Text>
            <Text style={styles.tipText}>
              Drink at least 2 liters of water to keep your energy stable.
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Take a quick walk</Text>
            <Text style={styles.tipText}>
              A 10-minute walk can improve circulation and reduce stress.
            </Text>
          </View>
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
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  hero: {
    backgroundColor: colors.brand,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    gap: 8,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#FFE8D4",
    marginBottom: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "600",
  },
  statRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 11,
    color: colors.textMuted,
  },
  tipCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  tipText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
  },
});
