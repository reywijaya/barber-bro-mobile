import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NotificationScreen = ({ navigation }) => {
  return (
    <SafeAreaView>
      <View className="bg-black h-screen">
        <View className="flex-row bg-zinc-800 p-2 items-center">
          <View className="flex-row items-center gap-2">
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color="white"
              onPress={() => navigation.goBack()}
            />
            <Text className="text-zinc-200 font-bold text-lg">
              Notifications
            </Text>
          </View>
          <FontAwesome5
            name="bell"
            size={24}
            color="#e4e4e7"
            style={{ marginLeft: "auto" }}
          />
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-zinc-200 text-lg">All Notifications</Text>
          <Text className="text-zinc-200 text-md">16 Activity</Text>
        </View>
        <View className="flex-col gap-4 mt-1">
          <View className="flex-row justify-between items-center">
            <Image
              source={{
                uri: "https://th.bing.com/th/id/OIP._3uoI_sVXo-qIxyVQR4X2gAAAA?rs=1&pid=ImgDetMain",
              }}
              className="w-10 h-10 rounded-full"
            />
            <View className="flex-col items-center">
              <Text className="text-zinc-200 text-lg">Barbershop Name</Text>
              <Text className="text-zinc-200 text-xs">
                Your booking is confirmed
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={20} color="#e4e4e7" />
              <Text className="text-zinc-200 text-xs">2 min ago</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;
