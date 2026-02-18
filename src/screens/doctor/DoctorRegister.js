import { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
    email: "",
    password: "",
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
      let doctorReady = false;
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
        doctorReady = true;
      } catch (err) {
        const existing = await api.getDoctor(form.id.trim());
        if (existing?.id) {
          doctorReady = true;
        } else {
          throw err;
        }
      }

      if (doctorReady && form.email.trim() && form.password.trim()) {
        await api.doctorSignUp({
          doctorId: form.id.trim(),
          email: form.email.trim(),
          password: form.password,
        });
        setStatus("Doctor profile and login account created.");
      } else if (doctorReady) {
        setStatus("Doctor profile saved. Add email/password to enable doctor login.");
      }
      setForm({
        id: "",
        name: "",
        degree: "",
        specialty: "",
        address: "",
        experience: "",
        fee: "",
        available: "",
        email: "",
        password: "",
      });
    } catch (err) {
      setStatus(err?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </Pressable>
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

          <Text style={styles.label}>Doctor Login Email (optional)</Text>
          <TextInput
            value={form.email}
            onChangeText={(v) => update("email", v)}
            placeholder="doctor@example.com"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Doctor Login Password (optional)</Text>
          <TextInput
            value={form.password}
            onChangeText={(v) => update("password", v)}
            placeholder="Enter password for doctor login"
            style={styles.input}
            secureTextEntry
          />

          <ButtonCustom onPress={handleSubmit}>Submit Registration</ButtonCustom>
          {status ? <Text style={styles.status}>{status}</Text> : null}
          <Text style={styles.hint}>For demo: data is stored locally in SQLite.</Text>
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
