import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HelpScreen = ({ navigation }) => {
  return (
    <SafeAreaView>
      <View className="flex bg-black h-screen">
        <View className="flex-row bg-zinc-800 p-2 items-center">
          <View className="flex-row items-center gap-2">
            <Ionicons
              name="arrow-back"
              size={20}
              color="#e4e4e7"
              onPress={() => navigation.goBack()}
            />
            <Text className="text-zinc-200 font-bold text-lg">Help Screen</Text>
          </View>
        </View>
        <View className="flex-col gap-4 mt-1">
          <View className="flex-row justify-between items-center">
            <Text className="text-zinc-200 text-lg">Report a Problem</Text>
            <Ionicons name="chevron-forward" size={20} color="#e4e4e7" />
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-zinc-200 text-lg">Account Status</Text>
            <Ionicons name="chevron-forward" size={20} color="#e4e4e7" />
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-zinc-200 text-lg">Support Request</Text>
            <Ionicons name="chevron-forward" size={20} color="#e4e4e7" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HelpScreen;
