import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavigations from "./src/navigation/Navigations";
import SplashScreen from "./src/screens/auth/SplashScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";
import SignupScreen from "./src/screens/auth/SignupScreen";
import AuthContext from "./src/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./src/api/client";

const Stack = createNativeStackNavigator();

function AuthStack({ onAuth }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} onAuth={onAuth} />}
      </Stack.Screen>
      <Stack.Screen name="Signup">
        {(props) => <SignupScreen {...props} onAuth={onAuth} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user");
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (e) {
        console.error("Failed to load user from storage", e);
      }
      setShowSplash(false);
    };

    checkUser();

    // Wake backend once so first auth request is less likely to fail on cold start.
    api.healthCheck().catch(() => {});
  }, []);

  const handleAuth = async (user) => {
    setUser(user);
    if (user) {
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem("user");
    }
  };

  const logout = () => {
    handleAuth(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleAuth, logout }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {showSplash ? (
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : user ? (
            <Stack.Screen name="Main" component={AppNavigations} />
          ) : (
            <Stack.Screen name="Auth">
              {(props) => <AuthStack {...props} onAuth={handleAuth} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
