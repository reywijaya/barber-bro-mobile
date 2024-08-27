import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import React, {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import axiosInstance from "../service/axios";
import {useDispatch} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LoginScreen = ({navigation}) => {
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
            setError("Invalid email");
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
            console.log("response : ", response.data.data);
            if (!response.data.data) {
                setError("Email or password invalid");
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
            alert(error.response.data.message);
        }
    };

    return (
        <SafeAreaView className="flex flex-col bg-black h-screen">
            <ScrollView>
                <View className="items-center p-10">
                    <Image
                        source={require("../../assets/Gold.png")}
                        className="w-36 h-36"
                        resizeMode="contain"
                    />
                    <View className="w-full">
                        <View className="items-center mb-4 px-2">
                            <Text className="font-bold text-xl text-white">Log in to your account!</Text>

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
                            {error && <Text className="text-red-500">{error}</Text>}
                        </View>
                        <View className="mb-4 px-2">
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                className="bg-gray-800 p-3 rounded text-white text-lg"
                                placeholder="Password"
                                placeholderTextColor="#6b7280"
                            />
                        </View>
                        <View className="h-[1px] bg-gray-700 m-2"/>
                        <View className="my-4 px-2">
                            <TouchableOpacity
                                className="bg-white rounded py-2"
                                onPress={handleLogin}
                            >
                                <Text className="font-bold text-lg text-center">Log in</Text>
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