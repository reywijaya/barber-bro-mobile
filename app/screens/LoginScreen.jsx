import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../service/axios";
import { useTogglePasswordVisibility } from "../hooks/useTogglePasswordVisibility";
import { login } from "../store/users";
import { getDataProfile } from "../service/fetchDataProfile";
import { AntDesign } from "@expo/vector-icons";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { SafeAreaView } from "react-native-safe-area-context";

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const { isPasswordVisible, togglePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();
  // const userData=useSelector((state) => state.user.loggedInUser);
  // console.log(userData)

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        title: "Error",
        type: ALERT_TYPE.DANGER,
        textBody: "Email and password are required",
        autoClose: 2000,
      });
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        title: "Error",
        type: ALERT_TYPE.DANGER,
        textBody: "Please enter a valid email address",
        autoClose: 2000,
      });
      return;
    }

    if (password.length < 8) {
      Toast.show({
        title: "Error",
        type: ALERT_TYPE.DANGER,
        textBody: "Password must be at least 8 characters long",
        autoClose: 2000,
      });
      return;
    }

    try {
      const response = await axiosInstance.post(`/login`, { email, password });

      if (response.status === 200) {
        const { token, ...userData } = response.data.data;
        // console.log("userData:", userData);
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("rememberMe", rememberMe.toString());
        // getDataProfile(token, dispatch);
        if (rememberMe) {
          await AsyncStorage.setItem(
            "rememberedUser",
            JSON.stringify(userData)
          );
        }

        dispatch(login(response.data.data));
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Login successful",
          autoClose: 2000,
        });
        navigation.navigate("Tab", { screen: "Home" });
      } else {
        Toast.show({
          title: "Error",
          type: ALERT_TYPE.DANGER,
          textBody: "Login failed, please check your email or password",
          autoClose: 2000,
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      console.log("error:", errorMessage);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        textBody: errorMessage,
        autoClose: 2000,
      });
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex flex-col min-h-screen p-8">
          <View className="flex-row items-center gap-x-2">
            <AntDesign name="rightsquareo" size={24} color="black" />
            <Text className="text-xl">Sign in</Text>
          </View>
          <View className="my-10">
            <Text className="text-3xl font-bold">
              Welcome to Barber Bro, find the perfect barbershop near you.
            </Text>
            <Text className="my-2">
              New to Barber Bro?{" "}
              <Text
                onPress={() => navigation.navigate("Register")}
                className="font-bold text-blue-500"
              >
                Sign up here.
              </Text>
            </Text>
          </View>
          <View className="gap-y-2 mb-2">
            <Text>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              className="py-3 px-4 rounded-full text-lg bg-zinc-200 focus:border-2 focus:border-zinc-600"
              placeholder="Email"
              placeholderTextColor="#a1a1aa"
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
                className="text-lg flex-1"
                placeholder="Password"
                placeholderTextColor="#a1a1aa"
              />
              <Pressable onPress={togglePasswordVisibility}>
                <MaterialCommunityIcons
                  name={rightIcon}
                  size={24}
                  color="#18181b"
                />
              </Pressable>
            </View>
          </View>
          <View className="flex-row items-center my-2 justify-between">
            <View className="flex-row items-center">
              <CheckBox
                checked={rememberMe}
                onPress={() => setRememberMe(!rememberMe)}
                checkedColor="#18181b"
                containerStyle={{
                  backgroundColor: "transparent",
                  borderWidth: 0,
                  padding: 0,
                  margin: 0,
                }}
              />
              <Text className={rememberMe ? "font-bold" : ""}>Remember me</Text>
            </View>
            <Text className="text-blue-500 font-bold">Forgot Password?</Text>
          </View>
          <View className="h-[1px] bg-zinc-600 my-2" />
          <View className="my-2">
            <TouchableOpacity
              className="bg-zinc-800 rounded-full py-3"
              onPress={handleLogin}
            >
              <Text className="font-bold text-lg text-center text-zinc-200">
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
