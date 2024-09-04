import React, { useEffect, useState } from "react";
import RegisterScreen from "./screens/RegisterScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Text, View } from "react-native";
import ProfileScreen from "./screens/ProfileScreen";
import BarbershopProfileScreen from "./screens/BarbershopProfileScreen";
import { PaymentScreen } from "./screens/PaymentScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import MapsComponent from "./component/MapsComponent";
import { login } from "./store/users";
import HelpScreen from "./screens/HelpScreen";
import AboutScreen from "./screens/AboutScreen";
import PrivateScreen from "./screens/PrivateScreen";
import NotificationScreen from "./screens/NotificationScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.loggedInUser);
  const dispatch = useDispatch();

  const checkLoggedInUser = async () => {
    try {
      const loggedInUser = await AsyncStorage.getItem("loggedInUser");
      if (loggedInUser) {
        // Parse the logged-in user data
        const userData = JSON.parse(loggedInUser);
        // Dispatch login action
        dispatch(login(userData));
      }
    } catch (error) {
      console.error("Failed to load user data from AsyncStorage:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLoggedInUser();
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={user?.id ? "Tab" : "Login"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Barbershop" component={BarbershopProfileScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Maps" component={MapsComponent} />
      <Stack.Screen name="HelpCenter" component={HelpScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivateScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Tab" component={TabNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
