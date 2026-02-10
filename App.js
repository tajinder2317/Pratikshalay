import { StyleSheet } from "react-native";
import AppNavigations from "./src/navigation/Navigations";
export default function App() {
  return <AppNavigations />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
