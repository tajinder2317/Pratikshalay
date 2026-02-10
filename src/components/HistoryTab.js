import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { api } from "../api/client";
import ButtonCustom from "./ButtonCustom";
import colors from "../theme/colors";

export default function HistoryTab({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadBookings = async () => {
      setLoading(true);
      try {
        const data = await api.getBookings();
        if (mounted) setBookings(data);
      } catch (err) {
        if (mounted) setBookings([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadBookings();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Appointment History</Text>
        {loading ? (
          <Text style={styles.muted}>Loading...</Text>
        ) : bookings.length === 0 ? (
          <View style={styles.emptyCard}>
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
              <Text style={styles.bookingTitle}>Doctor ID: {booking.doctor_id}</Text>
              <Text style={styles.bookingText}>Date: {booking.date}</Text>
              <Text style={styles.bookingText}>Time: {booking.time}</Text>
              <Text style={styles.bookingStatus}>{booking.status}</Text>
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
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  muted: {
    fontSize: 12,
    color: colors.textMuted,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  emptyText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  bookingCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  bookingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  bookingText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  bookingStatus: {
    marginTop: 6,
    fontSize: 11,
    color: colors.brand,
    fontWeight: "600",
  },
});
