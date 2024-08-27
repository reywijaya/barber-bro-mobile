import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.loggedInUser.loggedInUser.data);
  console.log("user : ", user);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("loggedInUser");
    dispatch({ type: "LOGOUT" });
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Profile Screen</Text>
        <Text>Welcome, {user.email}</Text>
        <TouchableOpacity onPress={handleLogout} className="bg-red-500">
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
