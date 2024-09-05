import React from 'react';
import {  ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DetailsBookingScreen = ({ route, navigation }) => {
    const bookingData = {
        booking_id: "1b91f513-0402-43b2-90c1-1637a69f162e",
        customer: {
          firstName: "Aditya Bayu",
          surname: "Prabowo",
          email: "Aditya@gmail.com",
          phone: "088227661015",
          address: "Jalan Topaz No 7",
          about: "Strongers",
          is_male: true,
          date_of_birth: 1725348960000,
        },
        barber: {
          name: "Prime Barber",
          contact_number: "082134567890",
          email: "barber1@example.com",
          street_address: "Jl. Mawar No. 12",
          city: "Jakarta",
          state_province_region: "DKI Jakarta",
          postal_zip_code: "10110",
          country: "Indonesia",
          description: "High-end barber services",
        },
        services: [
          {
            service_name: "Haircut",
            price: 50000.0,
          },
        ],
        bookingDate: 1725461728955,
        bookingTime: "14:55",
        status: "Pending",
        totalPrice: 50000.0,
      };
    
      return (
        <SafeAreaView className="flex-1 bg-zinc-900">
          <View className="flex-1 p-4">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View className="bg-zinc-800 p-6 rounded-lg shadow-md">
                <Text className="text-2xl font-bold text-white text-center mb-6">Booking Details</Text>
    
                {/* Customer Info */}
                <View className="mb-8">
                  <Text className="text-lg font-semibold text-zinc-300 mb-2">Customer Information</Text>
                  <View className="border-t border-zinc-600 pt-2">
                    <Text className="text-base text-zinc-400 mb-1">Name: {bookingData.customer.firstName} {bookingData.customer.surname}</Text>
                    <Text className="text-base text-zinc-400 mb-1">Phone: {bookingData.customer.phone}</Text>
                    <Text className="text-base text-zinc-400 mb-1">Email: {bookingData.customer.email}</Text>
                    <Text className="text-base text-zinc-400">Address: {bookingData.customer.address}</Text>
                  </View>
                </View>
    
                {/* Barber Info */}
                <View className="mb-8">
                  <Text className="text-lg font-semibold text-zinc-300 mb-2">Barber Information</Text>
                  <View className="border-t border-zinc-600 pt-2">
                    <Text className="text-base text-zinc-400 mb-1">Name: {bookingData.barber.name}</Text>
                    <Text className="text-base text-zinc-400 mb-1">Phone: {bookingData.barber.contact_number}</Text>
                    <Text className="text-base text-zinc-400 mb-1">Email: {bookingData.barber.email}</Text>
                    <Text className="text-base text-zinc-400">
                      Address: {bookingData.barber.street_address}, {bookingData.barber.city}
                    </Text>
                  </View>
                </View>
    
                {/* Service Info */}
                <View className="mb-8">
                  <Text className="text-lg font-semibold text-zinc-300 mb-2">Service Information</Text>
                  <View className="border-t border-zinc-600 pt-2">
                    {bookingData.services.map((service, index) => (
                      <View key={index} className="mb-2">
                        <Text className="text-base text-zinc-400">Service: {service.service_name}</Text>
                        <Text className="text-base text-zinc-400">Price: Rp{service.price.toLocaleString()}</Text>
                      </View>
                    ))}
                  </View>
                </View>
    
                {/* Booking Info */}
                <View>
                  <Text className="text-lg font-semibold text-zinc-300 mb-2">Booking Information</Text>
                  <View className="border-t border-zinc-600 pt-2">
                    <Text className="text-base text-zinc-400 mb-1">Date: {new Date(bookingData.bookingDate).toLocaleDateString()}</Text>
                    <Text className="text-base text-zinc-400 mb-1">Time: {bookingData.bookingTime}</Text>
                    <Text className="text-base text-zinc-400 mb-1">Status: {bookingData.status}</Text>
                    <Text className="text-base text-zinc-400">Total Price: Rp{bookingData.totalPrice.toLocaleString()}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      );
};

export default DetailsBookingScreen