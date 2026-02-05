import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeTab from "./components/HomeTab";
import DoctorsTab from "./components/DoctorsTab";
import HistoryTab from "./components/HistoryTab";
import SettingTab from "./components/SettingTab";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeTab} />
          <Tab.Screen name="Doctors" component={DoctorsTab} />
          <Tab.Screen name="History" component={HistoryTab} />
          <Tab.Screen name="Settings" component={SettingTab} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
