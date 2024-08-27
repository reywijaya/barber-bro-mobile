import { useMemo, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RadioGroup from "react-native-radio-buttons-group";
import axiosInstance from "../service/axios";

export default function RegisterScreen({ navigation }) {
  // const [name, setName] = useState("");
  // const [gender, setGender] = useState("");
  // const [phone, setPhone] = useState("");
  // const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const role="CUSTOMER";
  // const [selectedGender, setSelectedGender] = useState(null);

  const handleSubmit = async () => {
    if (
      //!name ||
      // !gender ||
      // !phone ||
      // !address ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    // if (!/^\d{10,13}$/.test(phone)) {
    //   Alert.alert("Error", "Phone number must be between 10 and 13 digits.");
    //   return;
    // }
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
      // name,
      // gender,
      // phone,
      // address,
      email,
      password,
      role
    };

    try {
      const response = await axiosInstance.post("/register", data);
      // console.log(response.data);
      Alert.alert("Success", "Registration Successful!");
      navigation.navigate("Login");
    } catch (error) {
      console.error(error.message);
      Alert.alert("Error", "Failed to register. Please try again.");
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
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <ScrollView className="flex-1">
          <Text className="text-white font-bold text-3xl p-4">Register</Text>
          <View className="flex-1 p-4">
            {/* 
            <View className="mb-4">
              <TextInput
                placeholder="Name"
                placeholderTextColor="#6b7280"
                value={name}
                onChangeText={(text) => setName(text)}
                className="bg-gray-700 p-3 rounded text-white text-lg"
              />
            </View>
            <View className="mb-4">
              <RadioGroup
                layout="row"
                radioButtons={radioButtons}
                onPress={handleGenderChange}
                selectedId={selectedGender}
                className="flex-row"
              />
            </View>
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
            <View className="mb-4">
              <TextInput
                placeholder="Address"
                placeholderTextColor="#6b7280"
                value={address}
                onChangeText={(text) => setAddress(text)}
                className="bg-gray-700 p-3 rounded text-white text-lg"
              />
            </View> */}
            <View className="mb-4">
              <TextInput
                placeholder="Email"
                placeholderTextColor="#6b7280"
                value={email}
                onChangeText={(text) => setEmail(text)}
                className="bg-gray-700 p-3 rounded text-white text-lg"
                keyboardType="email-address"
              />
            </View>
            <View className="mb-4">
              <TextInput
                placeholder="Password"
                placeholderTextColor="#6b7280"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
                className="bg-gray-700 p-3 rounded text-white text-lg"
              />
            </View>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#6b7280"
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              secureTextEntry
              className="bg-gray-700 p-3 rounded text-white text-lg"
            />
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-white p-3 rounded mt-4"
            >
              <Text className="font-bold text-lg text-center">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
