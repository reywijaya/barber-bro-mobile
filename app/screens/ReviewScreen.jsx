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

export const ReviewScreen = ({ navigation }) => {
  const userData = useSelector((state) => state.profileData.profileData);
  const user = useSelector((state) => state.user.loggedInUser);
  console.log("user", user);
  const dataBooking = useSelector((state) => state.appointment.appointments);


  const [modalVisible, setModalVisible] = useState(false);
  // console.log(dataBooking.booking_date, dataBooking.booking_time);
  const [day, month, year] = dataBooking.booking_date.split("/").map(Number);
  // console.log(day, month, year);
  const formattedDate = new Date(year, month - 1, day);
  const formattedTime = moment(dataBooking.booking_time, 'HH:mm').format('HH:mm');

  const idServices = dataBooking.services.map((service) => service.id);
  const bookingValues = {
    barber_id: dataBooking.barbershop.id,
    services: idServices,
    booking_date: formattedDate.getTime(),
    booking_time: formattedTime,
  };
  console.log("bookingValues", bookingValues);

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
    <SafeAreaView className="flex-1 bg-zinc-200">
      {/* Back Button and Header */}
      <View className="flex-row items-center p-2 bg-white border border-solid border-black">
        <Ionicons
          name="arrow-back"
          size={24}
          color="#030712"
          onPress={() => navigation.goBack()}
        />
        <Text className="text-zinc-900 text-xl font-bold ml-2">Back</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}>
        {/* Main Content */}
        <View className="bg-white mt-2 mx-2 p-4 rounded-md shadow-md">
          {/* Booking Information */}
          <View className="bg-zinc-700 p-4 rounded-md mb-4">
            <View className="flex-row gap-4 items-center mb-4">
              <UserAvatar
                size={50}
                name={`${userData.firstName} ${userData.surname}`}
                src={userData.avatar}
              />
              <View className="flex-col justify-center">
                <Text className="font-bold text-zinc-400 text-sm">
                  {userData.firstName} {userData.surname}
                </Text>
                {dataBooking.services.map((item) => (
                  <Text className="text-zinc-400 text-xs" key={item.id}>
                    {item.name}
                  </Text>
                ))}
              </View>
            </View>

            {/* Booking Details */}
            <View className="border-b border-zinc-600 pb-2 mb-4">
              <View className="flex-row justify-between mb-3">
                <Text className="text-zinc-400">Date</Text>
                <Text className="text-zinc-400 text-xs">
                  {dataBooking.booking_date} at {formattedTime}
                </Text>
              </View>

              <View className="flex-row justify-between mb-1">
                <Text className="text-zinc-400 text-md">Service</Text>
              </View>

              {dataBooking.services.map((item) => (
                <View className="flex-row justify-between my-1" key={item.id}>
                  <Text className="text-zinc-400 text-xs">{item.name}</Text>
                  <Text className="text-zinc-400 text-xs">
                    {formatPrice(item.price)}
                  </Text>
                </View>
              ))}
            </View>

            <View className="flex-row justify-between">
              <Text className="text-zinc-400">Total Payment</Text>
              <Text className="text-zinc-400 text-xs">
                {formatPrice(dataBooking.totalPayment)}
              </Text>
            </View>
          </View>

          {/* Barbershop Information */}
          <View className="bg-zinc-700 p-4 rounded-md mb-4">
            <View className="flex-row gap-4 items-center mb-4">
              <Image
                source={{
                  uri:
                    "http://10.10.102.48:8085" +
                    dataBooking.barbershop.barbershop_profile_picture_id.path,
                }}
                className="w-12 h-12 rounded-md"
                resizeMode="cover"
              />
              <View className="flex-col">
                <Text className="font-bold text-zinc-400 text-sm">
                  {dataBooking.barbershop.name}
                  <MaterialIcons name="verified" size={18} color="white" />
                </Text>
                {dataBooking.barbershop.operational_hours.map((item) => (
                  <View className="flex-row" key={item.id}>
                    <Text className="text-zinc-400 text-xs">
                      {toTitleCase(item.day)}, {item.opening_time} -{" "}
                      {item.closing_time}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Get Directions Button */}
            <TouchableOpacity
              className="flex-row items-center bg-zinc-600 p-2 rounded-md mb-4"
              onPress={() =>
                navigation.navigate("Maps", {
                  latitude: dataBooking.barbershop.latitude,
                  longitude: dataBooking.barbershop.longitude,
                  markerTitle: dataBooking.barbershop.name,
                })
              }
            >
              <MaterialCommunityIcons
                color={"#d1d5db"}
                name="map-marker"
                size={20}
              />
              <Text className="text-zinc-400 text-sm ml-2">Get direction</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Booking Button */}
      <TouchableOpacity
        className="bg-white w-full p-4 items-center justify-center absolute bottom-0 right-0 left-0 border-t border-zinc-300"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-zinc-900 font-bold text-base">Booking Now</Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-opacity-50">
          <View className="bg-zinc-200 p-4 rounded-md w-80">
            <Text className="text-lg font-bold mb-4">Confirm Booking</Text>
            <Text className="mb-4">
              Are you sure you want to book this appointment?
            </Text>
            <View className="flex-row justify-between">
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                color={"red"}
              />
              <Button
                title="Confirm"
                onPress={() => {
                  handleBooking();
                  setModalVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
