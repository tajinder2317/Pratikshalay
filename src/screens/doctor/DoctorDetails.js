import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ButtonCustom from "../../components/ButtonCustom";
import { api } from "../../api/client";
import colors from "../../theme/colors";
import AuthContext from "../../context/AuthContext";

export default function DoctorDetails({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const initialDoctor = route?.params?.doctor;
  const doctorId = route?.params?.doctorId || initialDoctor?.id;
  const [doctor, setDoctor] = useState(initialDoctor || null);
  const [bookingNote, setBookingNote] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const getDefaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  };
  const [bookingDate, setBookingDate] = useState(getDefaultDate);
  const [bookingTime, setBookingTime] = useState("10:00");

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
    if (!bookingDate.trim() || !bookingTime.trim()) {
      setBookingNote("Please enter both date and time.");
      setBookingSuccess(false);
      return;
    }
    setBookingLoading(true);
    try {
      await api.createBooking({
        doctorId: doctor.id,
        date: bookingDate.trim(),
        time: bookingTime.trim(),
        userId: user?.id || "guest",
      });
      setBookingNote(`Booked for ${bookingDate} at ${bookingTime}`);
      setBookingSuccess(true);
    } catch (err) {
      setBookingNote("Booking failed. Try again.");
      setBookingSuccess(false);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDirections = () => {
    if (!doctor) return;
    const query = encodeURIComponent(doctor.address);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "Could not open maps."),
    );
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .filter((w) => w[0] && w[0] === w[0].toUpperCase())
      .slice(0, 2)
      .map((w) => w[0])
      .join("");
  };

  if (!doctor) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="medkit-outline" size={48} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>Doctor details not available.</Text>
        <ButtonCustom onPress={() => navigation.goBack()}>Go Back</ButtonCustom>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.topTitle}>Doctor Details</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(doctor.name)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{doctor.name}</Text>
            <Text style={styles.degree}>{doctor.degree}</Text>
            <View style={styles.specialtyBadge}>
              <Text style={styles.specialtyBadgeText}>{doctor.specialty}</Text>
            </View>
            {doctor.is_24_7_available && (
              <View style={styles.badge247}>
                <Ionicons name="time" size={12} color="#10B981" />
                <Text style={styles.badge247Text}>Available 24/7</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Ionicons name="briefcase-outline" size={16} color={colors.brand} />
            <Text style={styles.statValue}>{doctor.experience}+ yrs</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cash-outline" size={16} color={colors.success} />
            <Text style={styles.statValue}>₹{doctor.fee}</Text>
            <Text style={styles.statLabel}>Consultation</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star" size={16} color={colors.warning} />
            <Text style={styles.statValue}>{doctor.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={16} color={colors.brand} />
            <Text style={styles.sectionTitle}>Next Available</Text>
          </View>
          <Text style={styles.sectionText}>{doctor.available}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={16} color={colors.brand} />
            <Text style={styles.sectionTitle}>Clinic Address</Text>
          </View>
          <Text style={styles.sectionText}>{doctor.address}</Text>
          <View style={styles.actionRow}>
            <ButtonCustom variant="outline" onPress={handleDirections}>
              Directions
            </ButtonCustom>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={colors.brand}
            />
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          <Text style={styles.sectionText}>
            Experienced in patient care and preventive health. Provides friendly
            consultations and follow-up support.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={16} color={colors.brand} />
            <Text style={styles.sectionTitle}>Schedule Appointment</Text>
          </View>
          <View style={styles.bookingForm}>
            <View style={styles.bookingField}>
              <Text style={styles.bookingLabel}>Date</Text>
              <TextInput
                style={styles.bookingInput}
                value={bookingDate}
                onChangeText={setBookingDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={styles.bookingField}>
              <Text style={styles.bookingLabel}>Time</Text>
              <TextInput
                style={styles.bookingInput}
                value={bookingTime}
                onChangeText={setBookingTime}
                placeholder="HH:MM"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ButtonCustom
          onPress={handleBooking}
          loading={bookingLoading}
          disabled={bookingLoading}
        >
          Book Appointment
        </ButtonCustom>
        {bookingNote ? (
          <View
            style={[
              styles.noteRow,
              bookingSuccess ? styles.noteSuccess : styles.noteError,
            ]}
          >
            <Ionicons
              name={bookingSuccess ? "checkmark-circle" : "alert-circle"}
              size={14}
              color={bookingSuccess ? colors.success : colors.error}
            />
            <Text
              style={[
                styles.bookingNote,
                bookingSuccess ? styles.noteTextSuccess : styles.noteTextError,
              ]}
            >
              {bookingNote}
            </Text>
          </View>
        ) : null}
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
    paddingBottom: 140,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    gap: 14,
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
    fontSize: 16,
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
  specialtyBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: colors.brandLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyBadgeText: {
    fontSize: 12,
    color: colors.brand,
    fontWeight: "600",
  },
  badge247: {
    marginTop: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badge247Text: {
    fontSize: 11,
    color: "#10B981",
    fontWeight: "600",
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
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  section: {
    marginTop: 14,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  sectionText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
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
    gap: 8,
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  noteSuccess: {
    backgroundColor: colors.successLight,
  },
  noteError: {
    backgroundColor: colors.errorLight,
  },
  bookingNote: {
    fontSize: 12,
    flex: 1,
  },
  noteTextSuccess: {
    color: colors.success,
  },
  noteTextError: {
    color: colors.error,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  bookingForm: {
    marginTop: 8,
    flexDirection: "row",
    gap: 10,
  },
  bookingField: {
    flex: 1,
  },
  bookingLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  bookingInput: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    fontSize: 13,
    color: colors.text,
    backgroundColor: "#FFFFFF",
  },
});
