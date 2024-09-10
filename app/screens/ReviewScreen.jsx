import React, { useState } from "react";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Button,
  Linking,
  Alert, // Import Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../service/axios";
import UserAvatar from "react-native-user-avatar";
import {
  setListBookingById,
  setListBookingUser,
} from "../store/listBookingUser";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const toTitleCase = (str) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.replace(word[0], word[0].toUpperCase()))
    .join(" ");
const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  }).format(price);
};

const formatDate = (dateString) => {
  // Split the date string by '/'
  const [day, month, year] = dateString.split("/").map(Number);

  
  const formattedMonth = month.toString().padStart(2, "0");
  const formattedDay = day.toString().padStart(2, "0");

  // Create a new Date object with the formatted date
  const formattedDate = new Date(`${year}-${formattedMonth}-${formattedDay}`);

  return formattedDate;
};
export const ReviewScreen = ({ navigation }) => {
  const userData = useSelector((state) => state.profileData.profileData);
  const user = useSelector((state) => state.user.loggedInUser);
  // console.log("user", user);
  const dataBooking = useSelector((state) => state.appointment.appointments);
  const [modalVisible, setModalVisible] = useState(false);
  // console.log(dataBooking.booking_date, dataBooking.booking_time);

  const formattedDate = formatDate(dataBooking.booking_date);
  // console.log("formattedDate", formattedDate);
  const formattedTime = moment(dataBooking.booking_time, "HH:mm").format(
    "HH:mm"
  );

  const idServices = dataBooking.services.map((service) => service.id);
  const bookingValues = {
    barber_id: dataBooking.barbershop.id,
    services: idServices,
    booking_date: formattedDate.getTime(),
    booking_time: formattedTime,
  };
  // console.log("bookingValues", bookingValues);

  const handleBooking = async () => {
    try {
      // Simulate booking request
      const response = await axiosInstance.post("/bookings", bookingValues, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(response.data.data);

      // Handle payment
      handlePayment(response.data.data);

      // Show success alert
      Alert.alert("Booking Successful", "Your booking has been confirmed.");
      console.log("Booking successful");
      navigation.navigate("History");
    } catch (error) {
      console.error(error.response.data);
      const casting = JSON.stringify(error.response.data.error);

      // Show error alert
      Alert.alert("Booking Failed", casting);
    }
  };

  const handlePayment = (data) => {
    Linking.openURL(data.midtrans_payment_url);

    console.log("Payment successful");
  };

  return (
    <SafeAreaView className="flex flex-col p-8 min-h-screen">
      {/* Back Button and Header */}
      <View className="flex-row items-center">
        <Ionicons
          name="arrow-back"
          size={24}
          color="#030712"
          onPress={() => navigation.goBack()}
        />
        <Text className="text-lg font-bold text-center w-2/3">
          Review Your Booking
        </Text>
      </View>

      {/* Main Content */}
      <View className="border-2 border-zinc-200 my-8 p-2 rounded-3xl">
        <Text className="font-extrabold bg-zinc-200 p-2 rounded-3xl text-center w-full">
          Booking Details
        </Text>
        {/* Booking Details */}
        <View className="mt-2 px-2">
          <View className="flex-row justify-between">
            <Text className="font-bold">Date</Text>
            <Text className="font-bold">
              {dataBooking.booking_date} at {dataBooking.booking_time}
            </Text>
          </View>

          <Text className="mt-2">Choosen Service:</Text>
          {dataBooking.services.map((item) => (
            <View className="flex-row justify-between" key={item.id}>
              <Text className="font-bold">{item.name}</Text>
              <Text className="font-bold">{formatPrice(item.price)}</Text>
            </View>
          ))}

          <View className="h-[1px] w-full bg-zinc-300 my-2"></View>
          <View className="flex-row justify-between">
            <Text className="font-extrabold text-lg">Total Payment</Text>
            <Text className="font-extrabold text-lg">
              {formatPrice(dataBooking.totalPayment)}
            </Text>
          </View>
        </View>
      </View>

      {/* Booking Button */}
      <TouchableOpacity
        className="bg-zinc-800 w-full py-3 items-center justify-center rounded-full"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-zinc-200 font-bold text-lg">Proceed Booking</Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center">
          <View className="bg-zinc-200 p-4 rounded-3xl w-80 items-center">
            <Text className="text-lg font-bold mb-4">Confirm Booking</Text>
            <Text className="mb-4 text-center">
              Are you sure you want to book this appointment?
            </Text>
            <View className="flex-row justify-around w-full">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-red-200 rounded-3xl w-1/3 py-2 justify-center items-center"
              >
                <Text className="text-red-700 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-200 rounded-3xl w-1/3 py-2 justify-center items-center"
                onPress={() => {
                  handleBooking();
                  setModalVisible(false);
                }}
              >
                <Text className="text-blue-700 font-bold">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
