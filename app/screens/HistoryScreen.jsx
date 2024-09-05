import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HistoryScreen = () => {
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex bg-zinc-900 h-screen">
          <View className="flex-col bg-zinc-800 p-2 mb-4">
            <Text className="text-zinc-200 font-bold text-lg">History</Text>
            <View className="border-b border-zinc-100 p-2"></View>
          </View>

          <View className="flex-col bg-zinc-800 p-2 mt-4">
            <Text className="text-zinc-200 font-bold text-lg">Reservation History</Text>
            <View className="flex-col bg-zinc-600 p-2 rounded-lg">
              <Text className="text-zinc-950  text-md font-bold">Barber Name</Text>
              <Text className="text-zinc-200  text-xs">Id Booking</Text>
              <Text className="text-zinc-200  text-xs">Booking Date</Text>
              <Text className="text-zinc-200  text-xs">Service Name</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;
