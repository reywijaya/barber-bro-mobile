import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import axiosInstance from "../service/axios";
import { useTogglePasswordVisibility } from "../hooks/useTogglePasswordVisibility";
import { login } from "../store/users";

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const { isPasswordVisible, togglePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email or Password cannot be empty");
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    try {
      const response = await axiosInstance.post(`/login`, { email, password });
      if (response.status === 200) {
        const token = response.data.data.token;
        await AsyncStorage.setItem("token", token);

        if (rememberMe) {
          await AsyncStorage.setItem(
            "rememberedUser",
            JSON.stringify(response.data.data)
          );
        } else {
          await AsyncStorage.removeItem("rememberedUser");
        }

        dispatch(login(response.data.data));
        alert("Login successful");
        navigation.navigate("Tab", { screen: "Home" });
      } else {
        alert("Login failed, please check your email and password");
      }
    } catch (error) {
      console.log("error:", error.response?.data || error.message);
      alert("Login failed, please check your email and password");
    }
  };

  return (
    <SafeAreaView>
      <ScrollView className="flex flex-col bg-black p-4">
        <View className="items-center h-screen">
          <Image
            source={require("../../assets/Gold.png")}
            className="w-36 h-36"
            resizeMode="contain"
          />
          <View className="w-full">
            <View className="items-center mb-4 px-2">
              <Text className="font-bold text-xl text-white">
                Log in to your account!
              </Text>
            </View>
            <View className="mb-4 px-2">
              <TextInput
                value={email}
                onChangeText={setEmail}
                className="bg-gray-800 p-3 rounded text-white text-lg"
                placeholder="Email"
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
              />
            </View>
            <View className="mb-4 px-2">
              <View className="flex-row items-center bg-gray-800 p-3 rounded">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  className="text-white text-lg flex-1"
                  placeholder="Password"
                  placeholderTextColor="#6b7280"
                />
                <Pressable onPress={togglePasswordVisibility}>
                  <MaterialCommunityIcons
                    name={rightIcon}
                    size={24}
                    color="white"
                  />
                </Pressable>
              </View>
            </View>
            <View className="flex-row items-center mb-4">
              <CheckBox
                checked={rememberMe}
                onPress={() => setRememberMe(!rememberMe)}
                containerStyle={{
                  backgroundColor: "transparent",
                  borderColor: "transparent",
                  margin: 0,
                  padding: 0,
                }}
                checkedColor="#e4e4e7"
              />
              <Text className="text-zinc-400">Remember me</Text>
            </View>
            <View className="h-[1px] bg-gray-700 m-2" />
            <View className="my-4 px-2">
              <TouchableOpacity
                className="bg-zinc-200 rounded py-2"
                onPress={handleLogin}
              >
                <Text className="font-bold text-lg text-center text-zinc-800">
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text className="text-white mt-4">
            Don't have an account?{" "}
            <Text
              onPress={() => navigation.navigate("Register")}
              className="font-bold text-blue-400"
            >
              Sign up here.
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
