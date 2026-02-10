import { View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Doctors from "../screens/doctor/Doctors";
import DoctorDetails from "../screens/doctor/DoctorDetails";
import DoctorRegister from "../screens/doctor/DoctorRegister";

const Stack = createNativeStackNavigator();

export default function DoctorsTab() {
  return (
    <View style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen
          name="DoctorsList"
          component={Doctors}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="DoctorDetails"
          component={DoctorDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DoctorRegister"
          component={DoctorRegister}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    width:'100%',
    height:'100%',
    backgroundColor:'#fff',
  }
})
