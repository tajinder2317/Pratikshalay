import { useCallback, useContext, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../api/client";
import colors from "../theme/colors";
import AuthContext from "../context/AuthContext";

function StatCard({ icon, value, label, color }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function DoctorAppointmentsTab() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    completedAppointments: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user?.doctorId) return;
    setLoading(true);
    try {
      const [statsData, listData] = await Promise.all([
        api.getDoctorStats(user.doctorId),
        api.getDoctorBookings(user.doctorId),
      ]);
      setStats(statsData);
      setAppointments(listData);
    } catch (err) {
      setStats({ totalAppointments: 0, todayAppointments: 0, completedAppointments: 0 });
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [user?.doctorId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const updateStatus = async (bookingId, status) => {
    try {
      await api.updateDoctorBookingStatus({
        bookingId,
        doctorId: user.doctorId,
        status,
      });
      setAppointments((prev) =>
        prev.map((item) => (item.id === bookingId ? { ...item, status } : item))
      );
      setStats((prev) => ({
        ...prev,
        completedAppointments:
          status === "completed"
            ? prev.completedAppointments + 1
            : Math.max(0, prev.completedAppointments - 1),
      }));
    } catch (err) {
      // silent
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Doctor Dashboard</Text>
        <Text style={styles.subtitle}>
          {user?.name || "Doctor"} - {user?.specialty || "General Practice"}
        </Text>

        <View style={styles.statsRow}>
          <StatCard icon="calendar" value={stats.totalAppointments} label="Total" color={colors.brand} />
          <StatCard icon="today" value={stats.todayAppointments} label="Today" color={colors.warning} />
          <StatCard icon="checkmark-circle" value={stats.completedAppointments} label="Completed" color={colors.success} />
        </View>

        {loading ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Loading appointments...</Text>
          </View>
        ) : appointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No appointments assigned yet.</Text>
          </View>
        ) : (
          appointments.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.patientName}>{item.patient_name || "Guest Patient"}</Text>
                  <Text style={styles.patientSub}>{item.patient_email || "No email"}</Text>
                </View>
                <View style={[styles.badge, item.status === "completed" ? styles.badgeSuccess : styles.badgeNeutral]}>
                  <Text style={[styles.badgeText, item.status === "completed" ? styles.badgeTextSuccess : styles.badgeTextNeutral]}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                <Text style={styles.metaText}>{item.date}</Text>
                <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                <Text style={styles.metaText}>{item.time}</Text>
              </View>

              <View style={styles.actions}>
                <Pressable style={styles.actionBtn} onPress={() => updateStatus(item.id, "confirmed")}>
                  <Text style={styles.actionBtnText}>Confirm</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={() => updateStatus(item.id, "completed")}>
                  <Text style={styles.actionBtnText}>Complete</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={() => updateStatus(item.id, "cancelled")}>
                  <Text style={styles.actionBtnText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
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
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    gap: 10,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  patientName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  patientSub: {
    fontSize: 12,
    color: colors.textMuted,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeSuccess: {
    backgroundColor: colors.successLight,
  },
  badgeNeutral: {
    backgroundColor: colors.chip,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  badgeTextSuccess: {
    color: colors.success,
  },
  badgeTextNeutral: {
    color: colors.textMuted,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
    marginRight: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.brandLight,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  actionBtnText: {
    color: colors.brand,
    fontSize: 12,
    fontWeight: "600",
  },
});
