import React, { useState, useMemo } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../service/axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RadioGroup } from "react-native-radio-buttons-group";
import { useDispatch, useSelector } from "react-redux";

export default function EditProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.loggedInUser.loggedInUser);

  const [name, setName] = useState(user.name || "");
  const [gender, setGender] = useState(user.gender || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [address, setAddress] = useState(user.address || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState(user.password || "");
  const [confirmPassword, setConfirmPassword] = useState(user.password || "");
  // Gender selection setup
  const [selectedGender, setSelectedGender] = useState(
    user.gender === "male" ? "male" : "female"
  );
  // State dan fungsi untuk mengelola visibilitas password
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // State dan fungsi untuk mengelola visibilitas confirm password
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleSubmit = async () => {
    if (!name || !gender || !phone || !address || !email) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (!/^\d{10,13}$/.test(phone)) {
      Alert.alert("Error", "Phone number must be between 10 and 13 digits.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    if (password && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    const updatedData = {
      name,
      gender,
      phone,
      address,
      email,
      ...(password && { password }), // Sertakan password hanya jika diisi
    };

    try {
      const response = await axiosInstance.put(
        "/customer/update-profile",
        updatedData
      );
      dispatch({ type: "EDIT", payload: response.data });
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error(error.message);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const radioButtons = useMemo(
    () => [
      {
        id: "male",
        label: "Male",
        value: "male",
        color: "white",
        selectedColor: "white",
        unselectedColor: "white",
        labelStyle: { color: "white" },
      },
      {
        id: "female",
        label: "Female",
        value: "female",
        color: "white",
        selectedColor: "white",
        unselectedColor: "white",
        labelStyle: { color: "white" },
      },
    ],
    []
  );

  const handleGenderChange = (id) => {
    setSelectedGender(id);
    setGender(radioButtons.find((item) => item.id === id).value);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView horizontal={false} className="h-screen">
        <View className="items-center">
          <Image
            source={require("../../assets/Gold.png")}
            className="w-36 h-36"
          />
        </View>
        <View className="gap-2 items-center">
          <Text className="text-white font-bold text-3xl">Edit Profile</Text>
        </View>
        <View className="gap-3 my-4 px-4">
          {/* Form untuk Name */}
          <View className="mb-4">
            <TextInput
              placeholder="Name"
              placeholderTextColor="#6b7280"
              value={name}
              onChangeText={(text) => setName(text)}
              className="bg-gray-700 p-3 rounded text-white text-lg"
            />
          </View>

          {/* Form untuk Gender */}
          <View className="mb-4">
            <RadioGroup
              layout="row"
              radioButtons={radioButtons}
              onPress={handleGenderChange}
              selectedId={selectedGender}
              className="flex-row"
            />
          </View>

          {/* Form untuk Phone */}
          <View className="mb-4">
            <TextInput
              placeholder="Phone"
              placeholderTextColor="#6b7280"
              value={phone}
              onChangeText={(text) => setPhone(text)}
              className="bg-gray-700 p-3 rounded text-white text-lg"
              keyboardType="phone-pad"
            />
          </View>

          {/* Form untuk Address */}
          <View className="mb-4">
            <TextInput
              placeholder="Address"
              placeholderTextColor="#6b7280"
              value={address}
              onChangeText={(text) => setAddress(text)}
              className="bg-gray-700 p-3 rounded text-white text-lg"
            />
          </View>

          {/* Form untuk Email */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#6b7280"
            value={email}
            onChangeText={(text) => setEmail(text)}
            className="bg-gray-800 p-3 rounded text-white text-lg"
            keyboardType="email-address"
          />

          {/* Form untuk Password */}
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

          {/* Form untuk Confirm Password */}
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

          {/* Separator */}
          <View className="h-[1px] bg-gray-700 my-2" />

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-white py-2 rounded my-2"
          >
            <Text className="font-bold text-lg text-center">Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Tab")}
            className="bg-gray-800 py-2 rounded my-2"
          >
            <Text className="font-bold text-white text-lg text-center">
              Back to Profile
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
