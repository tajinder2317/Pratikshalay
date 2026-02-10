import { Pressable, Text, View ,StyleSheet} from "react-native";
export default function CustomButton({ onPress, children }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonContainer,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.button}>
        <Text style={styles.Text}>{children}</Text>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
    buttonContainer:{
        backgroundColor:'#ff9962'    
    },
  buttonPressed: {
    opacity: 0.7, // Visual feedback for press
  },
  Text:{
    color:'white'
  }
});
