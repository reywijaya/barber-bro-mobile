import React, { useEffect, useState } from "react";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Image, Text, View, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../service/axios";
import { setListBookingUser } from "../store/listBookingUser";


const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  }).format(price);
};
const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
};

const NotificationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.loggedInUser);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data bookings
  const fetchDataBooking = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/bookings/current", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      dispatch(setListBookingUser(response.data.data));
      setNotifications(response.data.data);
    } catch (error) {
      console.log("Failed to fetch bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataBooking();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#e4e4e7" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="bg-zinc-800 p-4 flex-row items-center">
        <Ionicons
          name="arrow-back-outline"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text className="text-zinc-200 font-bold text-lg ml-2">
          Notifications
        </Text>
        <FontAwesome5
          name="bell"
          size={24}
          color="#e4e4e7"
          style={{ marginLeft: "auto" }}
        />
      </View>
      <ScrollView className="flex-1">
        {notifications.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-zinc-300 text-lg">No notifications</Text>
          </View>
        ) : (
          notifications.map((notification, index) => (
            <View
              key={index}
              className="bg-zinc-700 p-4 rounded-md m-2 flex-row items-start"
            >
              <Image
                source={{
                  uri: `http://10.10.102.48:8085${notification.barber.barbershop_profile_picture_id?.path}`,
                }}
                className="w-16 h-16 rounded-full"
                resizeMode="cover"
              />
              <View className="ml-4 flex-1">
                <Text className="text-zinc-200 text-lg font-bold">
                  {notification.barber.name}
                </Text>
                <Text className="text-zinc-300 text-sm mt-1">
                  {notification.barber.street_address}, {notification.barber.city}
                </Text>
                <Text className="text-zinc-300 text-sm mt-1">
                  {notification.customer.firstName} {notification.customer.surname}
                </Text>
                <Text className="text-zinc-300 text-xs mt-1">
                  {new Date(notification.booking_date).toLocaleDateString()} at {notification.booking_time}
                </Text>
                <Text className="text-zinc-300 text-xs mt-1">
                  Status: {toTitleCase(notification.status)} 
                </Text>
                <Text className="text-zinc-300 text-xs mt-1">
                  Total Price: {formatPrice(notification.total_price)}
                </Text>
              </View>
              <View className="ml-4 flex-row items-center">
                <Ionicons
                  name="time-outline"
                  size={20}
                  color="#e4e4e7"
                />
                <Text className="text-zinc-300 text-xs ml-1">
                  {new Intl.DateTimeFormat("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(notification.booking_date))}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};



export default NotificationScreen;
