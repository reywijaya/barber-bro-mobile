import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.loggedInUser);
  const profile = useSelector((state) => state.profileData.profileData);
  // console.log(profile);
  const handleLogout = async () => {
    await AsyncStorage.removeItem("rememberedUser");
    dispatch(logout());
    navigation.navigate("Login");
  };
  const handleHistory = () => {
    navigation.navigate("History");
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex flex-col">
          <View className="px-8 pt-8 pb-4">
            <Text className="text-lg text-center font-bold">Profile</Text>
            <View className="flex-col items-center gap-4 my-4">
              <Image
                source={require("../../assets/avatar.png")}
                style={{ width: 120, height: 120, borderRadius: 60 }}
              />
              <View className="flex-row items-center gap-x-2">
                <Text className="font-black text-3xl">{user.email.split("@")[0]}</Text>
                <Feather name="edit-3" size={22} color="#9ca3af" onPress={() => navigation.navigate("EditProfile")}/>
              </View>
              <View className="flex-row items-center gap-x-2 bg-violet-200 rounded-full p-2 w-full justify-between">
                <Text className="text-violet-700 font-extrabold">BarberBro Loyalty</Text>
                <Text className="py-1 text-center text-xs font-semibold rounded-full bg-yellow-600 text-yellow-100 w-1/3">Gold Member</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between py-2 px-4">
              <View className="flex-col items-center">
                <Text className="text-xl font-extrabold">1238</Text>
                <Text className="text-zinc-500">Points</Text>
              </View>
              <View className="flex-col items-center">
                <Text className="text-xl font-extrabold">34</Text>
                <Text className="text-zinc-500">Appointment</Text>
              </View>
              <View className="flex-col items-center">
                <Text className="text-xl font-extrabold">18</Text>
                <Text className="text-zinc-500">Barbershop</Text>
              </View>
            </View>
          </View>

          <View className="flex-col bg-zinc-200 rounded-t-[60px] mt-2 px-8 py-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name="account-circle-outline"
                  size={26}
                  color="#9ca3af"
                />
                <Text className="text-lg py-2">Account</Text>
              </View>
              <View>
                <Feather
                  name="arrow-right"
                  size={24}
                  color="#9ca3af"
                  onPress={() => navigation.navigate("EditProfile")}
                />
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="#9ca3af"
                />
                <Text className="text-lg py-2">Notification</Text>
              </View>
              <View>
                <Feather
                  name="arrow-right"
                  size={24}
                  color="#9ca3af"
                  onPress={() => navigation.navigate("Notification")}
                />
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="security" size={24} color="#9ca3af" />
                <Text className="text-lg py-2">
                  Security & Privacy
                </Text>
              </View>
              <View>
                <Feather
                  name="arrow-right"
                  size={24}
                  color="#9ca3af"
                  onPress={() => navigation.navigate("PrivacyPolicy")}
                />
              </View>
            </View>
            <View className="h-[1px] bg-gray-400 my-2" />
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Ionicons name="heart-outline" size={24} color="#9ca3af" />
                <Text className="text-lg py-2">
                  Liked Barbershop
                </Text>
              </View>
              <View>
                <Feather name="arrow-right" size={24} color="#9ca3af" />
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Ionicons name="calendar-outline" size={24} color="#9ca3af" />
                <Text className="text-lg py-2">
                  Booking History
                </Text>
              </View>
              <View>
                <Feather name="arrow-right" size={24} color="#9ca3af" onPress={handleHistory} />
              </View>
            </View>
            <View className="h-[1px] bg-gray-400 my-2" />
            <Text className="py-2">More info and support</Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Ionicons
                  name="information-circle-outline"
                  size={26}
                  color="#9ca3af"
                />
                <Text className="text-lg py-2">About</Text>
              </View>
              <View>
                <Feather
                  name="arrow-right"
                  size={24}
                  color="#9ca3af"
                  onPress={() => navigation.navigate("About")}
                />
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Ionicons name="help-circle-outline" size={26} color="#9ca3af" />
                <Text className="text-lg py-2">Help Center</Text>
              </View>
              <View>
                <Feather
                  name="arrow-right"
                  size={24}
                  color="#9ca3af"
                  onPress={() => navigation.navigate("HelpCenter")}
                />
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="security" size={24} color="#9ca3af" />
                <Text className="text-lg py-2">Privacy Policy</Text>
              </View>
              <View>
                <Feather name="arrow-right" size={24} color="#9ca3af" />
              </View>
            </View>
            <View className="h-[1px] bg-gray-400 my-2" />
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name="account"
                  size={26}
                  color="#60a5fa"
                />
                <Text className="text-lg py-2">Add account</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                className="flex-row items-center gap-2"
                onPress={handleLogout}
              >
                <Ionicons name="exit-outline" size={26} color="#ef4444" />
                <Text className="text-red-500 text-lg py-2">Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}