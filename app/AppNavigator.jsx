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
import { PaymentScreen, ReviewScreen } from "./screens/ReviewScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import MapsComponent from "./component/MapsComponent";
import { login } from "./store/users";
import HelpScreen from "./screens/HelpScreen";
import AboutScreen from "./screens/AboutScreen";
import PrivateScreen from "./screens/PrivateScreen";
import NotificationScreen from "./screens/NotificationScreen";
import AppointmentScreen from "./screens/AppointmentScreen";
import DetailsBookingScreen from "./screens/DetailsBookingScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import WelcomeScreen2 from "./screens/WelcomeScreen2";
import WelcomeScreen3 from "./screens/WelcomeScreen3";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const checkLoggedInUser = async () => {
    try {
      const loggedInUser = await AsyncStorage.getItem("loggedInUser");
      setUser(JSON.parse(loggedInUser));
    } catch (error) {
      console.error(
        "Failed to load user data from AsyncStorage:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={user ? "Tab" : "Welcome"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Welcome2" component={WelcomeScreen2} />
      <Stack.Screen name="Welcome3" component={WelcomeScreen3} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Barbershop" component={BarbershopProfileScreen} />
      {/* <Stack.Screen name="Payment" component={PaymentScreen} /> */}
      <Stack.Screen name="Appointment" component={AppointmentScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Maps" component={MapsComponent} />
      <Stack.Screen name="HelpCenter" component={HelpScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="DetailsBooking" component={DetailsBookingScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivateScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Tab" component={TabNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
