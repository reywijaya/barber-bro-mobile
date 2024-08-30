import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
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

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const role = "CUSTOMER";
  const [data, setData] = useState([]);

  // State untuk visibility password dan confirm password
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Function untuk toggle visibility password
  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  // Function untuk toggle visibility confirm password
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleSubmit = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Error",
        "Password must be at least 8 characters long, start with a capital letter, and contain at least one number."
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    const data = {
      email,
      password,
      role,
    };

    try {
      const response = await axiosInstance.post("/customer/register", data);
      setData(response.data);
      Alert.alert("Success", "Registration Successful!");
      navigation.navigate("Login");
    } catch (error) {
      console.error(error.message);
      Alert.alert("Error", "Failed to register. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black ">
      <ScrollView horizontal={false} className="h-screen">
        <View className="items-center">
          <Image
            source={require("../../assets/Gold.png")}
            className="w-36 h-36"
          />
        </View>
        <View className="gap-2 items-center">
          <Text className="text-white font-bold text-3xl">Sign up</Text>
          <Text className="text-white">
            Sign up now and unlock exclusive access
          </Text>
        </View>
        <View className="gap-3 my-4 px-4">
          <TextInput
            placeholder="Email"
            placeholderTextColor="#6b7280"
            value={email}
            onChangeText={(text) => setEmail(text)}
            className="bg-gray-800 p-3 rounded text-white text-lg"
            keyboardType="email-address"
          />

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
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="white"
              />
            </Pressable>
          </View>

          <View className="flex-row items-center bg-gray-800 p-3 rounded">
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
                color="white"
              />
            </Pressable>
          </View>

          <View className="h-[1px] bg-gray-700 my-2" />
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-white py-2 rounded my-2"
          >
            <Text className="font-bold text-lg text-center">Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            className="bg-gray-800 py-2 rounded my-2"
          >
            <Text className="font-bold text-white text-lg text-center">
              Back to Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
