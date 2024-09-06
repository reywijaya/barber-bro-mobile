import React, { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Button,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import axiosInstance from "../service/axios";
import UserAvatar from "react-native-user-avatar";

const toTitleCase = (str) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.replace(word[0], word[0].toUpperCase()))
    .join(" ");

export const ReviewScreen = ({ navigation }) => {
  const userData = useSelector((state) => state.profileData.profileData);
  const user = useSelector((state) => state.user.loggedInUser);
  const dataBooking = useSelector((state) => state.appointment.appointments);

  const [modalVisible, setModalVisible] = useState(false);
  console.log(dataBooking.booking_date, dataBooking.booking_time);
  const [day, month, year] = dataBooking.booking_date.split("/").map(Number);
  console.log(day, month, year);
  const formattedDate = new Date(year, month - 1, day);

  const idServices = dataBooking.services.map((service) => service.id);
  const bookingValues = {
    barber_id: dataBooking.barbershop.id,
    services: idServices,
    booking_date: formattedDate.getTime(),
    booking_time: dataBooking.booking_time,
  };

  const handleBooking = async () => {
    try {
      // Simulate booking request
      const response = await axiosInstance.post("/bookings", bookingValues, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Handle payment and navigate to Home
      handlePayment(response.data.data.midtransPaymentUrl);

      console.log("Booking successful");
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handlePayment = (link) => {
    // Open payment URL
    Linking.openURL(link);

    // Navigate to Home screen after payment URL is opened
    setTimeout(() => {
      navigation.navigate("Home");
    }, 2000); // Delay to allow URL to open

    console.log("Payment successful");
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {/* Header */}
        <View className="flex-row bg-zinc-700 p-4 items-center gap-3">
          <Ionicons
            name="arrow-back"
            size={20}
            color="#e4e4e7"
            onPress={() => navigation.goBack()}
          />
          <Text className="font-bold text-zinc-200">Review Booking</Text>
        </View>

        {/* Main Content */}
        <View className="bg-zinc-900 h-screen">
          {/* Booking Information */}
          <View className="flex-col bg-zinc-700 m-2 p-4 rounded-md">
            <View className="flex-row gap-4 items-center">
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
            <View className="border-b border-zinc-600 p-2 my-4">
              <View className="flex-row justify-between mb-3">
                <Text className="text-zinc-400">Date</Text>
                <Text className="text-zinc-400 text-xs">
                  {dataBooking.booking_date} at {dataBooking.booking_time}
                </Text>
              </View>

              <View className="flex-row justify-between ">
                <Text className="text-zinc-400 text-md">Service</Text>
              </View>

              {dataBooking.services.map((item) => (
                <View className="flex-row justify-between my-1" key={item.id}>
                  <Text className="text-zinc-400 text-xs">{item.name}</Text>
                  <Text className="text-zinc-400 text-xs">{item.price}</Text>
                </View>
              ))}
            </View>

            <View className="flex-row justify-between">
              <Text className="text-zinc-400">Total Payment</Text>
              <Text className="text-zinc-400 text-xs">
                Rp. {dataBooking.totalPayment}
              </Text>
            </View>
          </View>

          {/* Barbershop Information */}
          <View className="flex-col bg-zinc-700 m-2 p-4 rounded-md">
            <View className="flex-row gap-4 items-center">
              <Image
                source={{
                  uri:
                    "http://10.10.102.48:8080" +
                    dataBooking.barbershop.barbershop_profile_picture_id.path,
                }}
                className="w-10 h-10 rounded-md"
                resizeMode="cover"
              />
              <View className="flex-col">
                <Text className="font-bold text-zinc-400 text-sm">
                  {dataBooking.barbershop.name}
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
              className="flex-row items-center"
              onPress={() =>
                navigation.navigate("Maps", {
                  latitude: dataBooking.barbershop.latitude,
                  longitude: dataBooking.barbershop.longitude,
                  markerTitle: dataBooking.barbershop.name,
                })
              }
            >
              <View className="flex-row bg-zinc-600 p-2 my-3 w-full rounded-md items-center justify-center">
                <MaterialCommunityIcons
                  color={"#d1d5db"}
                  name="map-marker"
                  size={20}
                />
                <Text className="text-zinc-400 text-sm ml-2">
                  Get direction
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Booking Button */}
      <TouchableOpacity
        className="bg-zinc-200 w-full p-3 items-center justify-center absolute bottom-0 right-0 left-0 rounded-md"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-zinc-900 font-bold">Booking Now</Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-4 rounded-md w-80">
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
