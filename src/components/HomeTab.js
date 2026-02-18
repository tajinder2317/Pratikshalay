import { useCallback, useContext, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";
import ButtonCustom from "./ButtonCustom";
import { api } from "../api/client";
import AuthContext from "../context/AuthContext";

export default function HomeTab({ navigation }) {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ doctorCount: 0, bookingCount: 0, avgRating: 0 });

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      api.getStats().then((data) => {
        if (mounted) setStats(data);
      }).catch(() => {});
      return () => { mounted = false; };
    }, [])
  );

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroGreeting}>Hello, {firstName} 👋</Text>
              <Text style={styles.heroSubtitle}>Book trusted doctors near you.</Text>
            </View>
            <View style={styles.heroAvatar}>
              <Text style={styles.heroAvatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || "?"}
              </Text>
            </View>
          </View>
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
              <View style={styles.actionIconCircle}>
                <Ionicons name="medkit" size={20} color={colors.brand} />
              </View>
              <Text style={styles.actionText}>Doctors</Text>
            </Pressable>
            <Pressable
              style={styles.actionCard}
              onPress={() => navigation.navigate("History")}
            >
              <View style={styles.actionIconCircle}>
                <Ionicons name="calendar" size={20} color={colors.brand} />
              </View>
              <Text style={styles.actionText}>History</Text>
            </Pressable>
            <Pressable
              style={styles.actionCard}
              onPress={() => navigation.navigate("Settings")}
            >
              <View style={styles.actionIconCircle}>
                <Ionicons name="settings" size={20} color={colors.brand} />
              </View>
              <Text style={styles.actionText}>Settings</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Health Snapshot</Text>
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Ionicons name="people" size={18} color={colors.brand} />
              <Text style={styles.statValue}>{stats.doctorCount}</Text>
              <Text style={styles.statLabel}>Doctors</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={18} color={colors.success} />
              <Text style={styles.statValue}>{stats.bookingCount}</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="star" size={18} color={colors.warning} />
              <Text style={styles.statValue}>{stats.avgRating}</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          <View style={styles.tipCard}>
            <View style={styles.tipIconCircle}>
              <Ionicons name="water" size={18} color="#3B82F6" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Stay hydrated</Text>
              <Text style={styles.tipText}>
                Drink at least 2 liters of water to keep your energy stable.
              </Text>
            </View>
          </View>
          <View style={styles.tipCard}>
            <View style={[styles.tipIconCircle, { backgroundColor: "#ECFDF5" }]}>
              <Ionicons name="walk" size={18} color={colors.success} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Take a quick walk</Text>
              <Text style={styles.tipText}>
                A 10-minute walk can improve circulation and reduce stress.
              </Text>
            </View>
          </View>
          <View style={styles.tipCard}>
            <View style={[styles.tipIconCircle, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="moon" size={18} color={colors.warning} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Get enough sleep</Text>
              <Text style={styles.tipText}>
                Aim for 7-8 hours of quality sleep every night.
              </Text>
            </View>
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
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    gap: 14,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroGreeting: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#FFE8D4",
    marginTop: 4,
  },
  heroAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroAvatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brandLight,
    alignItems: "center",
    justifyContent: "center",
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
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  tipCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  tipIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  tipText: {
    marginTop: 3,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },
});
