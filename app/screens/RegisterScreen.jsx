import React, {useMemo, useState} from "react";
import {Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import axiosInstance from "../service/axios";

export default function RegisterScreen({navigation}) {
    // const [name, setName] = useState("");
    // const [gender, setGender] = useState("");
    // const [phone, setPhone] = useState("");
    // const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const role = "CUSTOMER";
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
                labelStyle: {color: "white"},
            },
            {
                id: "female",
                label: "Female",
                value: "female",
                color: "white",
                selectedColor: "white",
                unselectedColor: "white",
                labelStyle: {color: "white"},
            },
        ],
        []
    );

    const handleGenderChange = (id) => {
        setSelectedGender(id);
        setGender(radioButtons.find((item) => item.id === id).value);
    };

    return (
        <SafeAreaView className="flex flex-col h-screen bg-black ">
            <ScrollView>
                <View className="items-center">
                    <Image
                        source={require("../../assets/Gold.png")}
                        className="w-36 h-36"
                    />
                </View>
                <View className="gap-2 items-center">
                    <Text className="text-white font-bold text-3xl">Sign up</Text>
                    <Text className="text-white">Sign up now and unlock exclusive access</Text>
                </View>
                <View className="gap-3 my-4 px-4">
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

                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#6b7280"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        className="bg-gray-800 p-3 rounded text-white text-lg"
                        keyboardType="email-address"
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#6b7280"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        secureTextEntry
                        className="bg-gray-800 p-3 rounded text-white text-lg"
                    />
                    <TextInput
                        placeholder="Confirm Password"
                        placeholderTextColor="#6b7280"
                        value={confirmPassword}
                        onChangeText={(text) => setConfirmPassword(text)}
                        secureTextEntry
                        className="bg-gray-800 p-3 rounded text-white text-lg mb-2"
                    />
                    <View className="h-[1px] bg-gray-700 my-2"/>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-white py-2 rounded my-2"
                    >
                        <Text className="font-bold text-lg text-center">Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        className="bg-gray-800 py-2 rounded my-2"
                    >
                        <Text className="font-bold text-white text-lg text-center">Back to Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}