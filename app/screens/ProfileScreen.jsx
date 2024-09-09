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
import { logout } from "../store/users";

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.loggedInUser);
  // console.log("user", user);
  // const profile = useSelector((state) => state.profileData.profileData);
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
        <View className="flex flex-col p-8">
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
          </View>

          <View className="flex-row items-center justify-between p-4">
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

          <View className="flex-row items-center justify-between p-2 my-2 rounded-3xl border-2 border-zinc-200">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={26}
                color="#27272a"
              />
              <Text className="text-lg font-semibold">Account</Text>
            </View>
            <View>
              <Feather
                name="arrow-right"
                size={24}
                color="#27272a"
                onPress={() => navigation.navigate("EditProfile")}
              />
            </View>
          </View>
          <View className="flex-row items-center justify-between p-2 my-2 rounded-3xl border-2 border-zinc-200">
            <View className="flex-row items-center gap-2">
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#27272a"
              />
              <Text className="text-lg font-semibold">Notification</Text>
            </View>
            <View>
              <Feather
                name="arrow-right"
                size={24}
                color="#27272a"
                onPress={() => navigation.navigate("Notification")}
              />
            </View>
          </View>
          <View className="flex-row items-center justify-between p-2 my-2 rounded-3xl border-2 border-zinc-200">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="security" size={24} color="#27272a" />
              <Text className="text-lg font-semibold">Security & Privacy</Text>
            </View>
            <View>
              <Feather
                name="arrow-right"
                size={24}
                color="#27272a"
                onPress={() => navigation.navigate("PrivacyPolicy")}
              />
            </View>
          </View>
          <View className="flex-row items-center justify-between p-2 my-2 rounded-3xl border-2 border-zinc-200">
            <View className="flex-row items-center gap-2">
              <Ionicons name="heart-outline" size={24} color="#27272a" />
              <Text className="text-lg font-semibold">Liked Barbershop</Text>
            </View>
            <View>
              <Feather name="arrow-right" size={24} color="#27272a" />
            </View>
          </View>
          <View className="flex-row items-center justify-between p-2 my-2 rounded-3xl border-2 border-zinc-200">
            <View className="flex-row items-center gap-2">
              <Ionicons name="calendar-outline" size={24} color="#27272a" />
              <Text className="text-lg font-semibold">Booking History</Text>
            </View>
            <View>
              <Feather name="arrow-right" size={24} color="#27272a" onPress={handleHistory} />
            </View>
          </View>
          <Text className="py-2">More info and support</Text>
          <View className="flex-row items-center justify-between p-2 my-2 rounded-3xl border-2 border-zinc-200">
            <View className="flex-row items-center gap-2">
              <Ionicons name="information-circle-outline" size={26} color="#27272a" />
              <Text className="text-lg font-semibold">About</Text>
            </View>
            <View>
              <Feather name="arrow-right" size={24} color="#27272a" onPress={() => navigation.navigate("About")} />
            </View>
          </View>
          <View className="flex-row items-center justify-between p-2 my-2 rounded-3xl border-2 border-zinc-200">
            <View className="flex-row items-center gap-2">
              <Ionicons name="help-circle-outline" size={26} color="#27272a" />
              <Text className="text-lg font-semibold">Help Center</Text>
            </View>
            <View>
              <Feather name="arrow-right" size={24} color="#27272a" onPress={() => navigation.navigate("HelpCenter")} />
            </View>
          </View>
          <View className="flex-row items-center justify-between p-2 my-2 rounded-3xl border-2 border-zinc-200">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="security" size={24} color="#27272a" />
              <Text className="text-lg font-semibold">Privacy Policy</Text>
            </View>
            <View>
              <Feather name="arrow-right" size={24} color="#27272a" />
            </View>
          </View>
          <View className="flex-row items-center justify-center p-2 my-2 rounded-3xl border-2 border-red-200">
            <TouchableOpacity className="flex-row items-center gap-2" onPress={handleLogout}>
              <Ionicons name="exit-outline" size={26} color="#ef4444" />
              <Text className="text-red-500 text-lg font-semibold">Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}