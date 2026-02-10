import { View, Text, StyleSheet, Button } from "react-native";
import ButtonCustom from "../../components/ButtonCustom";
export default function Doctors() {
  return (
    <View style={styles.container}>
      <View style={styles.Title}>
        <Text>My Home Clinic</Text>
      </View>
      <View style={styles.DetailsContainer}>
        <View style={styles.Details}>
          <View style={styles.DetailsCol}>
            <View>
              <Text>Image Here</Text>
            </View>
            <View style={{ justifyContent: "center",alignItems:'center' }}>
              <Text>Title</Text>
              <Text>Details of the doctor </Text>
            </View>
          </View>
        </View>
        <View>
          <Text>Address</Text>
        </View>
      </View>
      <View style={styles.bottomDetails}>
        <View>
          <Text>Distance</Text>
        </View>
        <ButtonCustom onPress={() => console.log("Pressed")} title="Call">
          Book Now
        </ButtonCustom>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 10,
    width: "100%",
    // height: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
  },
  Title: {
    // flex:1,
    width: "100%",
    borderWidth: 2,
    borderColor: "black",
  },
  DetailsContainer: {
    width: "100%",
    borderWidth: 2,
    borderColor: "black",
  },
  Details: {
    width: "100%",
    borderWidth: 2,
    borderColor: "black",
  },
  DetailsCol: {
    borderWidth: 1,
    justifyContent: "center",
    borderColor: "black",
    flexDirection: "row",
  },
  bottomDetails: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
