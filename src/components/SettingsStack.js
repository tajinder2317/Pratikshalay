import { View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingTab from "./SettingTab";
import EditProfile from "../screens/profile/EditProfile";

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  return (
    <View style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen
          name="SettingsMain"
          component={SettingTab}
          options={{ headerShown: true, title: "Settings", headerStyle: { backgroundColor: "#fa6515" }, headerTintColor: "#fff", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
});
