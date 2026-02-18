import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeTab from "../components/HomeTab";
import DoctorsTab from "../components/DoctorsTab";
import HistoryTab from "../components/HistoryTab";
import SettingsStack from "../components/SettingsStack";
const Tab = createBottomTabNavigator();

export default function AppNavigations() {
  const insets = useSafeAreaInsets();
  const tabBarBottomPadding = Math.max(insets.bottom - 4, 4);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerTitleStyle: {
          color: "white",
        },
        headerStyle: {
          backgroundColor: "#fa6515",
        },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Doctors") {
            iconName = focused ? "medkit" : "medkit-outline";
          } else if (route.name === "History") {
            iconName = focused ? "time" : "time-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FA6515",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          height: 56 + tabBarBottomPadding,
          paddingBottom: tabBarBottomPadding,
          paddingTop: 4,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeTab} />
      <Tab.Screen
        name="Doctors"
        component={DoctorsTab}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="History" component={HistoryTab} />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
