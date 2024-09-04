import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";
import { Switch } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

const PrivateScreen = ({ navigation }) => {
  const [privateAccount, setPrivateAccount] = useState(false);
  return (
    <SafeAreaView>
      <View className="bg-black h-screen">
        <View className="flex-row bg-zinc-800 p-2 items-center">
          <View className="flex-row items-center gap-2">
            <Ionicons name="arrow-back-outline" size={24} color="white" onPress={() => navigation.goBack()}/>
            <Text className="text-zinc-200 font-bold text-lg">
              Privacy and Policy
            </Text>
          </View>
        </View>
        <View className="flex-col gap-4 mt-1">
          <View className="flex-row justify-between items-center">
            <Text className="text-zinc-200 text-lg">Privacy Account</Text>
            <Switch
              value={privateAccount}
              onValueChange={(value) => setPrivateAccount(value)}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor="#f4f4f4"
              style={{ transform: [{ scaleX: 1 }, { scaleY: 1.2 }] }}
            />
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-zinc-200 text-sm">
                When your account is private, only people you select will be able to see it.
            </Text>
            
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PrivateScreen;
