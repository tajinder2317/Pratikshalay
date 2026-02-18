import { useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
} from "react-native";
import DoctorCard from "../../components/DoctorCard";
import ButtonCustom from "../../components/ButtonCustom";
import { api } from "../../api/client";
import colors from "../../theme/colors";
import AuthContext from "../../context/AuthContext";

export default function Doctors({ navigation }) {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [sortBy, setSortBy] = useState("distance");
  const [favorites, setFavorites] = useState([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "left",
      headerStyle: {
        backgroundColor: colors.brand,
        height: 110,
      },
      headerTitle: () => (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Doctors</Text>
          <TextInput
            placeholder="Search doctors, specialty, or area"
            placeholderTextColor="#FCD9C2"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>
      ),
    });
  }, [navigation, query]);

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const specialties = useMemo(() => {
    const unique = new Set(doctors.map((doctor) => doctor.specialty));
    return ["All", ...Array.from(unique)];
  }, [doctors]);

  useEffect(() => {
    let mounted = true;
    const fetchDoctors = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await api.getDoctors({
          q: query.trim(),
          specialty: selectedSpecialty,
          sortBy,
        });
        if (mounted) setDoctors(result);
      } catch (err) {
        if (mounted) setError("Failed to load doctors. Check backend.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDoctors();
    return () => {
      mounted = false;
    };
  }, [query, selectedSpecialty, sortBy]);

  useEffect(() => {
    let mounted = true;
    const loadFavorites = async () => {
      try {
        const favs = await api.getFavorites(user?.id || "guest");
        if (mounted) setFavorites(favs);
      } catch (err) {
        // silent for demo
      }
    };
    loadFavorites();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const filteredDoctors = useMemo(() => {
    if (!favoritesOnly) return doctors;
    return doctors.filter((doctor) => favorites.includes(doctor.id));
  }, [doctors, favorites, favoritesOnly]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    if (favorites.includes(id)) {
      api.removeFavorite(id, user?.id || "guest").catch(() => {});
    } else {
      api.addFavorite(id, user?.id || "guest").catch(() => {});
    }
  };

  const renderHeader = () => (
    <View>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Nearby Doctors</Text>
        <Pressable
          style={styles.sortChip}
          onPress={() => setSortBy((prev) => (prev === "distance" ? "rating" : "distance"))}
        >
          <Text style={styles.sortChipText}>
            Sort: {sortBy === "distance" ? "Distance" : "Rating"}
          </Text>
        </Pressable>
      </View>
      <View style={styles.registerRow}>
        <Text style={styles.registerHint}>
          Are you a doctor? Register your hospital or clinic.
        </Text>
        <ButtonCustom
          variant="outline"
          onPress={() => navigation.navigate("DoctorRegister")}
        >
          Register
        </ButtonCustom>
      </View>
      <View style={styles.chipRow}>
        {specialties.map((specialty) => {
          const isActive = selectedSpecialty === specialty;
          return (
            <Pressable
              key={specialty}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setSelectedSpecialty(specialty)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {specialty}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.actionRow}>
        <Pressable
          style={[styles.toggleChip, favoritesOnly && styles.toggleChipActive]}
          onPress={() => setFavoritesOnly((prev) => !prev)}
        >
          <Text
            style={[styles.toggleChipText, favoritesOnly && styles.toggleChipTextActive]}
          >
            Favorites Only
          </Text>
        </Pressable>
        <ButtonCustom variant="outline" onPress={() => setQuery("")}
        >
          Clear Search
        </ButtonCustom>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={() => {
          setQuery("");
          setSelectedSpecialty("All");
          setSortBy("distance");
        }}
        renderItem={({ item }) => (
          <DoctorCard
            doctor={item}
            isFavorite={favorites.includes(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            onPress={() => navigation.navigate("DoctorDetails", { doctor: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {error ? "Unable to load" : "No doctors found"}
            </Text>
            <Text style={styles.emptyText}>
              {error || "Try a different search or filter."}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    width: "100%",
    gap: 8,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  searchInput: {
    height: 38,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    paddingHorizontal: 12,
    fontSize: 13,
    color: "#FFFFFF",
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 4,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  sortChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: colors.chip,
  },
  sortChipText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: colors.chip,
  },
  chipActive: {
    backgroundColor: colors.chipActive,
  },
  chipText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.brand,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 12,
  },
  registerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 12,
  },
  registerHint: {
    flex: 1,
    fontSize: 12,
    color: colors.textMuted,
  },
  toggleChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.chip,
  },
  toggleChipActive: {
    backgroundColor: colors.brandLight,
  },
  toggleChipText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
  },
  toggleChipTextActive: {
    color: colors.brand,
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textMuted,
  },
});
