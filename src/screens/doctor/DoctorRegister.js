import { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import ButtonCustom from "../../components/ButtonCustom";
import colors from "../../theme/colors";
import { api } from "../../api/client";

export default function DoctorRegister({ navigation }) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    degree: "",
    specialty: "",
    address: "",
    experience: "",
    fee: "",
    available: "",
  });
  const [status, setStatus] = useState("");

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setStatus("");
    if (!form.id.trim() || !form.name.trim()) {
      setStatus("Please enter Doctor ID and Name.");
      return;
    }
    try {
      await api.createDoctor({
        id: form.id.trim(),
        name: form.name.trim(),
        degree: form.degree.trim(),
        specialty: form.specialty.trim(),
        address: form.address.trim(),
        experience: Number(form.experience) || 0,
        fee: Number(form.fee) || 0,
        available: form.available.trim() || "On Request",
        rating: 0,
        distance: 0,
      });
      setStatus("Registration submitted successfully.");
      setForm({
        id: "",
        name: "",
        degree: "",
        specialty: "",
        address: "",
        experience: "",
        fee: "",
        available: "",
      });
    } catch (err) {
      setStatus("Registration failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>Register Hospital / Clinic</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.label}>Doctor ID</Text>
          <TextInput
            value={form.id}
            onChangeText={(v) => update("id", v)}
            placeholder="doc-5"
            style={styles.input}
          />

          <Text style={styles.label}>Doctor Name</Text>
          <TextInput
            value={form.name}
            onChangeText={(v) => update("name", v)}
            placeholder="Dr. Your Name"
            style={styles.input}
          />

          <Text style={styles.label}>Degree</Text>
          <TextInput
            value={form.degree}
            onChangeText={(v) => update("degree", v)}
            placeholder="MBBS, MD"
            style={styles.input}
          />

          <Text style={styles.label}>Specialty</Text>
          <TextInput
            value={form.specialty}
            onChangeText={(v) => update("specialty", v)}
            placeholder="Cardiology"
            style={styles.input}
          />

          <Text style={styles.label}>Hospital / Address</Text>
          <TextInput
            value={form.address}
            onChangeText={(v) => update("address", v)}
            placeholder="Hospital name, city"
            style={styles.input}
          />

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Experience (yrs)</Text>
              <TextInput
                value={form.experience}
                onChangeText={(v) => update("experience", v)}
                placeholder="5"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Fee (Rs)</Text>
              <TextInput
                value={form.fee}
                onChangeText={(v) => update("fee", v)}
                placeholder="400"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>

          <Text style={styles.label}>Available Slot</Text>
          <TextInput
            value={form.available}
            onChangeText={(v) => update("available", v)}
            placeholder="Today 4:30 PM"
            style={styles.input}
          />

          <ButtonCustom onPress={handleSubmit}>Submit Registration</ButtonCustom>
          {status ? <Text style={styles.status}>{status}</Text> : null}
          <Text style={styles.hint}>For demo: data is stored locally in SQLite.</Text>
        </View>

        <ButtonCustom variant="outline" onPress={() => navigation.goBack()}>
          Back
        </ButtonCustom>
      </ScrollView>
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  topTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
  },
  input: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    fontSize: 13,
    color: colors.text,
    backgroundColor: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  col: {
    flex: 1,
  },
  status: {
    fontSize: 12,
    color: colors.brand,
  },
  hint: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
