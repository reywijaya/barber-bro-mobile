import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const PaymentScreen = ({ navigation }) => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex-row bg-zinc-900 p-2  items-center gap-3">
          <Ionicons
            name="arrow-back"
            size={20}
            color="#e4e4e7"
            onPress={() => navigation.goBack()}
          />
          <Text className="font-bold text-zinc-200 ">Payment</Text>
        </View>
        <View className="bg-black h-screen">
          <View className="flex-col bg-zinc-800 m-2 p-4 rounded-md ">
            <View className="flex-row gap-4">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
                }}
                className="w-10 h-10 rounded-md"
                resizeMode="cover"
              />
              <View className="flex-col">
                <Text className="font-bold text-zinc-400 text-sm">
                  Dilan Drew
                </Text>
                <Text className="text-zinc-400 text-xs">Service : Cutting</Text>
              </View>
            </View>
            <View className="border-b border-zinc-600 p-2">
              <View className="flex-row justify-between my-3">
                <Text className=" text-zinc-400">Duration</Text>
                <Text className="text-zinc-400 text-xs">1 hr 10m</Text>
              </View>
              <View className="flex-row justify-between my-3">
                <Text className=" text-zinc-400">Date</Text>
                <Text className="text-zinc-400 text-xs">
                  August, 28 th 2022 at 8:00 AM
                </Text>
              </View>
              <View className="flex-row justify-between my-3">
                <Text className=" text-zinc-400">Service Payment</Text>
                <Text className="text-zinc-400 text-xs">Rp. 200.000</Text>
              </View>
            </View>
            <View className="p-2 flex-row justify-between my-3">
              <Text className=" text-zinc-400">Total Payment</Text>
              <Text className="text-zinc-400 text-xs">Rp. 200.000</Text>
            </View>
          </View>
          <View className="flex-col bg-zinc-800 m-2 p-4 rounded-md ">
            <View className="flex-row gap-4">
              <Image
                source={{
                  uri: "https://th.bing.com/th/id/OIP.YkzDlSkOwyCXbHPr4fobEwHaFS?rs=1&pid=ImgDetMain",
                }}
                className="w-10 h-10 rounded-md"
                resizeMode="cover"
              />
              <View className="flex-col">
                <Text className="font-bold text-zinc-400 text-sm">
                  Baylee The Barber
                </Text>
                <Text className="text-zinc-400 text-xs">09.00 - 20.00</Text>
              </View>
            </View>
            <View className="flex-row bg-zinc-700 p-2 my-3 rounded-md justify-between items-center">
              <View className="flex-row gap-2">
                <MaterialCommunityIcons
                  color={"#d1d5db"}
                  name="map-marker"
                  size={20}
                />
                <Text className="text-zinc-400 text-sm ml-2">
                  Get direction
                </Text>
              </View>
              <Ionicons color={"#d1d5db"} name="chevron-forward" size={20} />
            </View>
          </View>
          <View className="flex-col bg-zinc-800 m-2 p-4 rounded-md ">
            <Text className="font-bold text-zinc-400 text-sm">
              Payment Method
            </Text>
            <View className="p-2 flex-row  bg-zinc-700 justify-between my-3 rounded-md">
              <AntDesign color={"#d1d5db"} name="qrcode" size={20} />
              <Text className="text-zinc-400 text-sm">Qris</Text>
              <Ionicons color={"#d1d5db"} name="chevron-forward" size={20} />
            </View>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        className="bg-zinc-200 w-full p-3 items-center justify-center absolute bottom-0 right-0 left-0 rounded-md"
        onPress={() => console.log("Pay Now")}
      >
        <Text className="text-zinc-900 font-bold">Pay Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
