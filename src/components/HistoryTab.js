import { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../api/client";
import ButtonCustom from "./ButtonCustom";
import colors from "../theme/colors";

export default function HistoryTab({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getBookings();
      setBookings(data);
    } catch (err) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [loadBookings])
  );

  const handleCancel = async (bookingId) => {
    try {
      await api.cancelBooking(bookingId);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (err) {
      // silent
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.emptyCard}>
            <Ionicons name="hourglass-outline" size={32} color={colors.textMuted} />
            <Text style={styles.muted}>Loading appointments...</Text>
          </View>
        ) : bookings.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No appointments yet</Text>
            <Text style={styles.emptyText}>
              Book your first appointment and it will appear here.
            </Text>
            <ButtonCustom onPress={() => navigation.navigate("Doctors")}>
              Find Doctors
            </ButtonCustom>
          </View>
        ) : (
          bookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <View style={styles.bookingAvatar}>
                  <Ionicons name="person" size={18} color={colors.brand} />
                </View>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingTitle}>
                    {booking.doctor_name || `Doctor ${booking.doctor_id}`}
                  </Text>
                  {booking.doctor_specialty ? (
                    <Text style={styles.bookingSpecialty}>{booking.doctor_specialty}</Text>
                  ) : null}
                </View>
                <View style={[
                  styles.statusBadge,
                  booking.status === "confirmed" ? styles.statusConfirmed : styles.statusOther,
                ]}>
                  <Text style={[
                    styles.statusText,
                    booking.status === "confirmed" ? styles.statusTextConfirmed : styles.statusTextOther,
                  ]}>
                    {booking.status}
                  </Text>
                </View>
              </View>
              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.bookingText}>{booking.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.bookingText}>{booking.time}</Text>
                </View>
              </View>
              {booking.status === "confirmed" ? (
                <View style={styles.cancelRow}>
                  <ButtonCustom variant="outline" onPress={() => handleCancel(booking.id)}>
                    Cancel Appointment
                  </ButtonCustom>
                </View>
              ) : null}
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
  muted: {
    fontSize: 13,
    color: colors.textMuted,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 32,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 18,
  },
  bookingCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  bookingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  bookingAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.brandLight,
    alignItems: "center",
    justifyContent: "center",
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  bookingSpecialty: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusConfirmed: {
    backgroundColor: colors.successLight,
  },
  statusOther: {
    backgroundColor: colors.chip,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statusTextConfirmed: {
    color: colors.success,
  },
  statusTextOther: {
    color: colors.textMuted,
  },
  bookingDetails: {
    flexDirection: "row",
    gap: 16,
    paddingLeft: 48,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bookingText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  cancelRow: {
    marginTop: 12,
    paddingLeft: 48,
  },
});
