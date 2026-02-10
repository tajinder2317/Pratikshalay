import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeTab from "../components/HomeTab";
import DoctorsTab from "../components/DoctorsTab";
import HistoryTab from "../components/HistoryTab";
import SettingTab from "../components/SettingTab";
const Tab = createBottomTabNavigator();

export default function AppNavigations() {
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
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeTab} />
      <Tab.Screen
        name="Doctors"
        component={DoctorsTab}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="History" component={HistoryTab} />
      <Tab.Screen name="Settings" component={SettingTab} />
    </Tab.Navigator>
  );
}
