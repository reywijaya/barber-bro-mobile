import {Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import axiosInstance from "../service/axios";
import {useDispatch} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LoginScreen = ({navigation}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const handleLogin = async () => {
        if (username === "" || password === "") {
            alert("Username or Password cannot be empty");
            return;
        }
        try {
            const response = await axiosInstance.get(`/users`, {
                params: {username},
            });
            const user = response.data[0];
            if (!user || user.password !== password) {
                alert("Invalid username or password");
                return;
            }
            alert("Login successful");
            await AsyncStorage.setItem("loggedInUser", JSON.stringify(user))
            dispatch({
                type: "LOGIN",
                payload: user,
            })

            navigation.navigate("Tab", {
                screen: "Home",
                // params: user,
            });

        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <SafeAreaView className="flex flex-col items-center justify-center bg-black h-screen">
            <View className="w-full px-10 gap-4">
                <Text className="font-bold text-3xl text-white py-4">Log in</Text>
                <View>
                    <TextInput
                        value={username}
                        onChangeText={setUsername}
                        className="bg-gray-700 p-3 rounded text-white text-lg"
                        placeholder="Username or email"
                        placeholderTextColor="#6b7280"
                    />
                </View>
                <View>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        className="bg-gray-700 p-3 rounded text-white text-lg"
                        placeholder="Password"
                        placeholderTextColor="#6b7280"
                    />
                </View>
                <View>
                    <TouchableOpacity onPress={handleLogin} className="bg-white py-4 rounded items-center mt-4">
                        <Text className="font-bold">LOGIN</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};