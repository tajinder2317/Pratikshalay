import { View, Text, StyleSheet, Pressable } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../theme/colors";

export default function DoctorCard({ doctor, onPress, onToggleFavorite, isFavorite }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>DR</Text>
        </View>
        <View style={styles.infoCol}>
          <View style={styles.titleRow}>
            <Text style={styles.nameText} numberOfLines={1}>
              {doctor.name}
            </Text>
            <Pressable onPress={onToggleFavorite} hitSlop={8}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={18}
                color={isFavorite ? colors.brand : colors.textMuted}
              />
            </Pressable>
          </View>
          <Text style={styles.subText} numberOfLines={1}>
            {doctor.degree}
          </Text>
          <Text style={styles.specialtyText}>{doctor.specialty}</Text>
          <Text style={styles.addressText} numberOfLines={2}>
            {doctor.address}
          </Text>
        </View>
      </View>
      <View style={styles.metaRow}>
        <View style={styles.badge}>
          <Ionicons name="star" size={12} color={colors.brand} />
          <Text style={styles.badgeText}>{doctor.rating}</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="time" size={12} color={colors.textMuted} />
          <Text style={styles.badgeText}>{doctor.available}</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="navigate" size={12} color={colors.textMuted} />
          <Text style={styles.badgeText}>{doctor.distance.toFixed(1)} km</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.surface,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPressed: {
    opacity: 0.9,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brandLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.brand,
  },
  infoCol: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  nameText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  subText: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  specialtyText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.text,
    fontWeight: "600",
  },
  addressText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
  },
  metaRow: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: colors.chip,
  },
  badgeText: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
