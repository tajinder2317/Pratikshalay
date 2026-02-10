import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ButtonCustom from "../../components/ButtonCustom";
import { api } from "../../api/client";
import colors from "../../theme/colors";

export default function DoctorDetails({ navigation, route }) {
  const initialDoctor = route?.params?.doctor;
  const doctorId = route?.params?.doctorId || initialDoctor?.id;
  const [doctor, setDoctor] = useState(initialDoctor || null);
  const [bookingNote, setBookingNote] = useState("");

  useEffect(() => {
    let mounted = true;
    const loadDoctor = async () => {
      if (!doctorId || initialDoctor) return;
      try {
        const result = await api.getDoctor(doctorId);
        if (mounted) setDoctor(result);
      } catch (err) {
        if (mounted) setDoctor(null);
      }
    };
    loadDoctor();
    return () => {
      mounted = false;
    };
  }, [doctorId, initialDoctor]);

  const handleBooking = async () => {
    if (!doctor) return;
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 5);
    try {
      await api.createBooking({ doctorId: doctor.id, date, time });
      setBookingNote(`Booked for ${date} at ${time}`);
    } catch (err) {
      setBookingNote("Booking failed. Try again.");
    }
  };

  if (!doctor) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Doctor details not available.</Text>
        <ButtonCustom onPress={() => navigation.goBack()}>Go Back</ButtonCustom>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.topTitle}>Doctor Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>DR</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{doctor.name}</Text>
            <Text style={styles.degree}>{doctor.degree}</Text>
            <Text style={styles.specialty}>{doctor.specialty}</Text>
            <Text style={styles.address}>{doctor.address}</Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{doctor.experience}+ yrs</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>Rs {doctor.fee}</Text>
            <Text style={styles.statLabel}>Consultation</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{doctor.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Available</Text>
          <Text style={styles.sectionText}>{doctor.available}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clinic Address</Text>
          <Text style={styles.sectionText}>{doctor.address}</Text>
          <View style={styles.actionRow}>
            <ButtonCustom variant="outline" onPress={() => console.log("Directions")}
            >
              Directions
            </ButtonCustom>
            <ButtonCustom variant="outline" onPress={() => console.log("Call")}
            >
              Call
            </ButtonCustom>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionText}>
            Experienced in patient care and preventive health. Provides friendly
            consultations and follow-up support.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ButtonCustom onPress={handleBooking}>Book Appointment</ButtonCustom>
        {bookingNote ? <Text style={styles.bookingNote}>{bookingNote}</Text> : null}
      </View>
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
    paddingBottom: 120,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.brandLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.brand,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  degree: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  specialty: {
    marginTop: 6,
    fontSize: 12,
    color: colors.text,
    fontWeight: "600",
  },
  address: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textMuted,
  },
  statRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 11,
    color: colors.textMuted,
  },
  section: {
    marginTop: 16,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  sectionText: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textMuted,
  },
  actionRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 8,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 6,
  },
  bookingNote: {
    fontSize: 12,
    color: colors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
});
