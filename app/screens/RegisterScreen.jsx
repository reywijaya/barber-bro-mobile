import React, {useState} from "react";
import {Alert, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import axiosInstance from "../service/axios";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {ALERT_TYPE, Toast} from "react-native-alert-notification";


export default function RegisterScreen({navigation}) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const role = "CUSTOMER";
    const [data, setData] = useState([]);

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
                type: ALERT_TYPE.WARNING,
                title: "Warning",
                textBody: "All fields are required",
                autoClose: 2000
            })
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: "Email not valid",
                textBody: "Please enter a valid email address",
                autoClose: 2000
            })
            return;
        }
        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        if (!passwordRegex.test(password)) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: "Warning",
                textBody: "Password must be at least 8 characters long, start with a capital letter, and contain at least one number",
                autoClose: 3000
            })
            return;
        }
        if (password !== confirmPassword) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: "Warning",
                textBody: "Password do not match",
                autoClose: 3000
            })
            return;
        }

        const data = {
            fullName,
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
        <SafeAreaView>
            <ScrollView>
                <View className="flex flex-col justify-center min-h-screen max-w-screen bg-zinc-900 px-5 py-2">
                    <View>
                        <Image
                            source={require("../../assets/Gold.png")}
                            className="w-36 h-36"
                        />
                    </View>
                    <View className="mb-4 px-2">
                        <Text className="font-bold text-3xl text-zinc-200">
                            Get started
                        </Text>
                        <Text className="text-lg text-zinc-200">Create your account now!</Text>
                    </View>
                    <View className="my-2 px-2">
                        <View className="py-1">
                            <Text className="text-zinc-200 text-lg">Full name</Text>
                        </View>
                        <TextInput
                            placeholder="Enter your full name"
                            placeholderTextColor="#52525b"
                            value={fullName}
                            onChangeText={(text) => setFullName(text)}
                            className="bg-zinc-800 p-3 focus:border-2 focus:border-zinc-400 rounded text-zinc-200 text-lg"
                            keyboardType="default"
                        />
                    </View>
                    <View className="my-2 px-2">
                        <View className="py-1">
                            <Text className="text-zinc-200 text-lg">Email</Text>
                        </View>
                        <TextInput
                            placeholder="Enter your email"
                            placeholderTextColor="#52525b"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            className="bg-zinc-800 p-3 focus:border-2 focus:border-zinc-400 rounded text-zinc-200 text-lg"
                            keyboardType="email-address"
                        />
                    </View>
                    <View className="my-2 px-2">
                        <View className="py-1">
                            <Text className="text-zinc-200 text-lg">Password</Text>
                        </View>
                        <View
                            className="flex-row items-center justify-between focus:border-2 focus:border-zinc-400 bg-zinc-800 p-3 rounded text-zinc-200 text-lg">
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!isPasswordVisible}
                                className="text-zinc-200 text-lg"
                                placeholder="Password"
                                placeholderTextColor="#52525b"
                            />
                            <Pressable onPress={togglePasswordVisibility}>
                                <MaterialCommunityIcons
                                    name={isPasswordVisible ? "eye-off" : "eye"}
                                    size={24}
                                    color="white"
                                />
                            </Pressable>
                        </View>
                    </View>
                    <View className="my-2 px-2">
                        <View className="py-1">
                            <Text className="text-zinc-200 text-lg">Confirm Password</Text>
                        </View>
                        <View
                            className="flex-row items-center focus:border-2 focus:border-zinc-400 justify-between bg-zinc-800 p-3 rounded text-zinc-200 text-lg">
                            <TextInput
                                placeholder="Confirm Password"
                                placeholderTextColor="#52525b"
                                value={confirmPassword}
                                onChangeText={(text) => setConfirmPassword(text)}
                                className="text-zinc-200 text-lg"
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
                    </View>
                    <View className="h-[1px] bg-zinc-700 m-2"/>
                    <View className="my-2 px-2">
                        <TouchableOpacity
                            onPress={handleSubmit}
                            className="bg-zinc-200 rounded py-2"
                        >
                            <Text className="font-bold text-lg text-center text-zinc-800">Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="my-2 px-2">
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Login")}
                            className="flex flex-row gap-x-2"
                        >
                            <Text className="text-zinc-200">Already have an account?</Text>
                            <Text className="font-bold text-blue-400">Log in.</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
