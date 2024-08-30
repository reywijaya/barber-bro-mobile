import React, {useEffect, useState} from "react";
import RegisterScreen from "./screens/RegisterScreen";
import {LoginScreen} from "./screens/LoginScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import {useDispatch, useSelector} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ActivityIndicator, Text, View} from "react-native";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import BarbershopProfileScreen from "./screens/BarbershopProfileScreen";
import { PaymentScreen } from "./screens/PaymentScreen";
import EditProfileScreen from "./screens/EditProfileScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.loggedInUser.loggedInUser);
    const dispatch = useDispatch();
    console.log("userId : ", user.userId);

    const checkLoggedInUser = async () => {
        try {
            const loggedInUser = await AsyncStorage.getItem("loggedInUser");
            if (loggedInUser.loggedInUser) {
                dispatch({
                    type: "LOGIN",
                    payload: JSON.parse(loggedInUser.loggedInUser),
                });
                setLoading(false);
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkLoggedInUser();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 flex-row items-center justify-center">
                <ActivityIndicator size="large"/>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <Stack.Navigator
            initialRouteName={user.loggedInUser?.id ? "Tab" : "Login"}
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Profile" component={ProfileScreen}/>
            <Stack.Screen name="Barbershop" component={BarbershopProfileScreen}/>
            <Stack.Screen name="Payment" component={PaymentScreen}/>
            <Stack.Screen name="EditProfile" component={EditProfileScreen}/>
            <Stack.Screen name="Tab" component={TabNavigator}/>
        </Stack.Navigator>
    );
};

export default AppNavigator;