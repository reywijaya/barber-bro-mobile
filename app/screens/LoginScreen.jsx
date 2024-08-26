import {
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
      const response = await axiosInstance.get(`/users`, {
        params: { email },
      });
      const users = response.data;
      const user = users.find((user) => user.email === email && user.password === password);
      if (!user) {
        setError("User not found or invalid password");
        return;
      }
      setError("");
      alert("Login successful");
      await AsyncStorage.setItem("loggedInUser", JSON.stringify(user));
      dispatch({
        type: "LOGIN",
        payload: user,
      });

      navigation.navigate("Tab", {
        screen: "Home",
        // params: user,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 items-center justify-center">
        <View className="w-4/5">
          <Text className="font-bold text-3xl text-white py-4">Log in</Text>
          <View className="mb-4">
            <TextInput
              value={email}
              onChangeText={setEmail}
              className="bg-gray-700 p-3 rounded text-white text-lg"
              placeholder="Email"
              placeholderTextColor="#6b7280"
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
          <TouchableOpacity className="bg-blue-500 p-3 rounded" onPress={handleLogin}>
            <Text className="font-bold text-white text-center">LOGIN</Text>
          </TouchableOpacity>
          <Text className="text-white mt-4">
            Don't have an account?{" "}
            <Text
              onPress={() => navigation.navigate("Register")}
              className="font-bold"
            >
              Register
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

