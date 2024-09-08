import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, Image } from "react-native";
import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../service/axios";

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  }).format(price);
};

const toTitleCase = (str) =>
  str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );

const DetailsBookingScreen = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const [bookingData, setBookingData] = useState({});

  const fetchBookingData = async () => {
    try {
      const res = await axiosInstance.get(`/bookings/${bookingId}/update`);
      setBookingData(res.data.data);
    } catch (error) {
      console.log("Error fetching booking data:", error);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, []);

  const {
    barber,
    customer,
    services = [],
    booking_date,
    booking_time,
    total_price,
    status,
  } = bookingData;

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-zinc-900">
        {/* Header with Go Back Button */}
        <View className="bg-zinc-800 items-center flex-row p-2">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-zinc-200 font-bold text-base ml-2">
            Booking Details
          </Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView className="p-4">
          {/* Barbershop Information */}
          {barber && (
            <View className="mb-4 bg-zinc-800 p-4 rounded-lg">
              <Image
                source={{
                  uri: `http://10.10.102.48:8085${
                    barber.barbershop_profile_picture_id?.path 
                  }`,
                }}
                className="w-full h-40 rounded-md mb-4"
                style={{ resizeMode: "cover" }}
              />
              <Text className="text-white font-bold text-lg">
                {barber.name}
              </Text>
              <Text className="text-zinc-400 text-sm">
                {barber.street_address}, {barber.city}
              </Text>
              <Text className="text-zinc-400 text-sm">
                {barber.contact_number}
              </Text>
            </View>
          )}

          {/* Booking Details */}
          <View className="mb-4 bg-zinc-800 p-4 rounded-lg">
            <Text className="text-white font-bold text-lg">
              Booking Details
            </Text>
            <Text className="text-zinc-400 text-sm mt-2">
              Date:{" "}
              {booking_date
                ? new Date(booking_date).toLocaleDateString()
                : "N/A"}
            </Text>
            <Text className="text-zinc-400 text-sm">
              Time: {booking_time || "N/A"}
            </Text>
            <Text className="text-zinc-400 text-sm">
              Status: {status ? toTitleCase(status) : "N/A"}
            </Text>
          </View>

          {/* Customer Information */}
          {customer && (
            <View className="mb-4 bg-zinc-800 p-4 rounded-lg">
              <Text className="text-white font-bold text-lg">
                Customer Information
              </Text>
              <Text className="text-zinc-400 text-sm mt-2">
                Name: {customer.firstName} {customer.surname}
              </Text>
              <Text className="text-zinc-400 text-sm">
                Email: {customer.email}
              </Text>
              <Text className="text-zinc-400 text-sm">
                Phone: {customer.phone}
              </Text>
            </View>
          )}

          {/* Services Information */}
          {services.length > 0 && (
            <View className="mb-4 bg-zinc-800 p-4 rounded-lg">
              <Text className="text-white font-bold text-lg">Services</Text>
              {services.map((service, index) => (
                <Text key={index} className="text-zinc-400 text-sm mt-2">
                  {service.service_name} - {formatPrice(service.price)}
                </Text>
              ))}
            </View>
          )}

          {/* Total Price */}
          {total_price && (
            <View className="bg-zinc-800 p-4 rounded-lg mb-8">
              <Text className="text-white font-bold text-lg">Total Price</Text>
              <Text className="text-zinc-400 text-sm mt-2">
                {formatPrice(total_price)}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DetailsBookingScreen;
