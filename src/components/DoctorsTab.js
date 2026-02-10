import { Text, View, FlatList, StyleSheet} from "react-native";
import Doctors from "../screens/Doctors";
export default function DoctorsTab() {
  return(
  <View style={styles.container}>
  {/* <FlatList />; */}
  <Doctors />
  </View> 
);
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:10,
    width:'100%',
    height:'100%',
    backgroundColor:'#fff',
  }
})