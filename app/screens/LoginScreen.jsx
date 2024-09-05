import {Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View,} from "react-native";
import React, {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import axiosInstance from "../service/axios";
import {useDispatch} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {CheckBox} from "react-native-elements";
import {useTogglePasswordVisibility} from "../hooks/useTogglePasswordVisibility";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {login} from "../store/users";
import {getDataProfile} from "../service/fetchDataProfile";
import {ALERT_TYPE, Toast} from "react-native-alert-notification";

export const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const dispatch = useDispatch();
    const {isPasswordVisible, togglePasswordVisibility, rightIcon} =
        useTogglePasswordVisibility();

    const handleLogin = async () => {
        if (email === "" || password === "") {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: "Warning",
                textBody: "Email or Password cannot be empty",
                autoClose: 2000
            })
            return;
        }
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: "Warning",
                textBody: "Please enter a valid email",
                autoClose: 2000
            })
            return;
        }
        if (password.length < 8) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: "Warning",
                textBody: "Password must be at least 8 characters long",
                autoClose: 2000
            })
            return;
        }

        try {
            const response = await axiosInstance.post(`/login`, {
                email,
                password,
            });

            if (!response.data.data) {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Login Failed",
                    textBody: "Please check your email and password",
                    autoClose: 2000
                })
                return;
            }

            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: "Success",
                textBody: "Login Successfully",
                autoClose: 2000
            })

            if (rememberMe === true) {
                await AsyncStorage.setItem(
                    "loggedInUser",
                    JSON.stringify({email, password})
                );
            }

            await getDataProfile();
            dispatch(login(response.data.data));
            navigation.navigate("Tab", {
                screen: "Home",
            });
        } catch (error) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: "Login Failed",
                textBody: "Please check your email and password",
                autoClose: 2000
            })
        }
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <View className="flex flex-col justify-center min-h-screen max-w-screen bg-zinc-900 p-5">
                    <View className="">
                        <Image
                            source={require("../../assets/Gold.png")}
                            className="w-36 h-36"
                        />
                        <View>
                            <View className="mb-4 px-2">
                                <Text className="font-bold text-3xl text-zinc-200">
                                    Welcome Back!
                                </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("Register")}
                                    className="flex flex-row gap-x-2"
                                >
                                    <Text className="text-zinc-200">New to Barber Bro?</Text>
                                    <Text className="font-bold text-blue-400">Create an account.</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="my-2 px-2">
                                <View className="py-1">
                                    <Text className="text-zinc-200 text-lg">Email</Text>
                                </View>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    className="bg-zinc-800 p-3 focus:border-2 focus:border-zinc-400 rounded text-zinc-200 text-lg"
                                    placeholder="Enter your email"
                                    placeholderTextColor="#52525b"
                                    keyboardType="email-address"
                                />
                            </View>
                            <View className="my-2 px-2">
                                <View className="py-1">
                                    <Text className="text-zinc-200 text-lg">Password</Text>
                                </View>
                                <View
                                    className="flex-row items-center focus:border-2 focus:border-zinc-400 justify-between bg-zinc-800 p-3 rounded text-zinc-200 text-lg">
                                    <TextInput
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!isPasswordVisible}
                                        className="text-zinc-200 text-lg"
                                        placeholder="Enter your password"
                                        placeholderTextColor="#52525b"
                                    />
                                    <Pressable onPress={togglePasswordVisibility}>
                                        <MaterialCommunityIcons
                                            name={rightIcon}
                                            size={24}
                                            color="white"
                                        />
                                    </Pressable>
                                </View>
                            </View>
                            <View className="flex-row items-center my-2 px-2 justify-between">
                                <View className="flex-row items-center">
                                    <CheckBox
                                        checked={rememberMe}
                                        onPress={() => setRememberMe(!rememberMe)}
                                        containerStyle={{
                                            backgroundColor: "transparent",
                                            borderColor: "transparent",
                                            margin: 0,
                                            padding: 0,
                                        }}
                                        checkedColor="#e4e4e7"
                                    />
                                    <Text className="text-zinc-200">Remember me</Text>
                                </View>
                                <View>
                                    <TouchableOpacity>
                                        <Text className="text-blue-400 font-bold">Forgot password?</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View className="h-[1px] bg-zinc-700 m-2"/>
                            <View className="my-4 px-2">
                                <TouchableOpacity
                                    className="bg-zinc-200 rounded py-2"
                                    onPress={handleLogin}
                                >
                                    <Text className="font-bold text-lg text-center text-zinc-800">
                                        Log in
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
