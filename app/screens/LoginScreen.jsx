import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../service/axios";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (email === "" || password === "") {
      setError("Email or Password cannot be empty");
      return;
    }
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setError("Email is not valid");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      const response = await axiosInstance.post(`/login`, {
        email,
        password,
      });
      console.log("response : ", response.data);
      if (!response.data ){
        setError("User not found or invalid password");
        return;
      }
      setError("");
      alert("Login successful");
      await AsyncStorage.setItem(
        "loggedInUser",
        JSON.stringify(response.data)
      );
      dispatch({
        type: "LOGIN",
        payload: response.data,
      });
      navigation.navigate("Tab", {
        screen: "Home",
      });
    } catch (error) {
      console.log("error : ", error.response.data.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        <View className="items-center justify-center">
          <Image
            source={require("../../assets/Gold.png")}
            className="w-40 h-40"
            resizeMode="contain"
          />
          <View className="w-full">
            <Text className="font-bold text-3xl text-white py-4">Log in</Text>
            <View className="mb-4">
              <TextInput
                value={email}
                onChangeText={setEmail}
                className="bg-gray-700 p-3 rounded text-white text-lg"
                placeholder="Email"
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
              />
              {error && <Text className="text-red-500">{error}</Text>}
            </View>
            <View className="mb-4">
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="bg-gray-700 p-3 rounded text-white text-lg"
                placeholder="Password"
                placeholderTextColor="#6b7280"
              />
            </View>
            <TouchableOpacity
              className="bg-white p-3 rounded"
              onPress={handleLogin}
            >
              <Text className="font-bold text-lg text-center">Log in</Text>
            </TouchableOpacity>
            <Text className="text-white mt-4">
              Don't have an account?{" "}
              <Text
                onPress={() => navigation.navigate("Register")}
                className="font-bold text-blue-500"
              >
                Register
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
