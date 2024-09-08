import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../service/axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Toast, ALERT_TYPE, Dialog } from "react-native-alert-notification";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const role = "CUSTOMER";
  // const [data, setData] = useState([]);

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleSubmit = async () => {
    if (!email || !password || !confirmPassword) {
      Toast.show({
        title: "Error",
        type: ALERT_TYPE.DANGER,
        textBody: "All fields are required.",
        autoClose: 2000,
      });
      return;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        title: "Error",
        type: ALERT_TYPE.DANGER,
        textBody: "Please enter a valid email address.",
        autoClose: 2000,
      });
      return;
    }
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(password)) {
      Toast.show({
        title: "Error",
        type: ALERT_TYPE.DANGER,
        textBody:
          "Password must be at least 8 characters long, start with a capital letter, and contain at least one number.",
        autoClose: 2000,
      });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({
        title: "Error",
        type: ALERT_TYPE.DANGER,
        textBody: "Passwords do not match.",
        autoClose: 2000,
      });
      return;
    }

    const data = {
      email,
      password,
      role,
    };

    try {
      const response = await axiosInstance.post("/customer/register", data);
      // setData(response.data);
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody:
          "Registration successful. Please check your email for verification.",
        autoClose: 2000,
      });
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      Toast.show({
        title: "Error",
        type: ALERT_TYPE.DANGER,
        textBody: "Failed to register. Please try again.",
        autoClose: 2000,
      });
      return;
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex flex-col min-h-screen p-8">
          <View className="flex-row items-center gap-x-2">
            <MaterialIcons name="join-left" size={30} color="black" />
            <Text className="text-xl">Sign up</Text>
          </View>
          <View className="my-10">
            <Text className="text-3xl font-bold">
              Sign up now to unlock exclusive offers and discounts.
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="my-2">
                Already have an account?{" "}
                <Text className="font-bold text-blue-500">Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
          <View className="gap-y-2 mb-2">
            <Text>Email</Text>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#a1a1aa"
              value={email}
              onChangeText={(text) => setEmail(text)}
              className="py-3 px-4 rounded-full text-lg bg-zinc-200 focus:border-2 focus:border-zinc-600"
              keyboardType="email-address"
            />
          </View>
          <View className="gap-y-2 mb-2">
            <Text>Password</Text>
            <View className="flex-row items-center py-3 px-4 rounded-full text-lg bg-zinc-200 focus:border-2 focus:border-zinc-600">
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
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={24}
                  color="#18181b"
                />
              </Pressable>
            </View>
          </View>
          <View className="gap-y-2 mb-2">
            <Text>Confirm Password</Text>
            <View className="flex-row items-center py-3 px-4 rounded-full text-lg bg-zinc-200 focus:border-2 focus:border-zinc-600">
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#6b7280"
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                className="text-white text-lg flex-1"
                secureTextEntry={!isConfirmPasswordVisible}
              />
              <Pressable onPress={toggleConfirmPasswordVisibility}>
                <MaterialCommunityIcons
                  name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                  size={24}
                  color="#18181b"
                />
              </Pressable>
            </View>
          </View>
          <View className="h-[1px] bg-zinc-600 my-2" />
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-zinc-800 py-3 rounded-full my-2"
          >
            <Text className="font-bold text-lg text-center text-zinc-200">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
