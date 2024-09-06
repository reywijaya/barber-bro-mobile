import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { RadioGroup } from "react-native-radio-buttons-group";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import { setAppointments } from "../store/appointment";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
};
const availableTimes = Array.from({ length: 13 }, (_, i) => {
  const hour = (9 + i).toString().padStart(2, "0");
  return `${hour}:00`;
});

export default function AppointmentScreen({ route, navigation }) {
  const { barbershop } = route.params || {};
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [totalPayment, setTotalPayment] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState(date.toLocaleDateString());
  const [selectedTime, setSelectedTime] = useState("09:00");
  const dispatch = useDispatch();
  const [previousBarbershop, setPreviousBarbershop] = useState(barbershop);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await AsyncStorage.getItem("loggedInUser");
        if (data) {
          setUserData(JSON.parse(data));
        }
      } catch (error) {
        console.error("Failed to load user data from AsyncStorage:", error);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    if (
      barbershop &&
      previousBarbershop &&
      barbershop.id !== previousBarbershop.id
    ) {
      setTotalPayment(0);
      setSelectedServiceId(null);
    }
    setPreviousBarbershop(barbershop);
  }, [barbershop, previousBarbershop]);

  const radioButtons = useMemo(() => {
    if (
      !barbershop ||
      !barbershop.services ||
      !Array.isArray(barbershop.services)
    ) {
      console.warn("Barbershop services are not available or not an array");
      return [];
    }

    return barbershop.services.map((service) => ({
      id: service.service_id || "no-id",
      label: service.service_name || "No Service Name",
      value: service.service_id || "no-id", // Ensure value matches the id
      price: service.price || 0,
    }));
  }, [barbershop]);

  const handleServiceChange = (id) => {
    const selectedService = radioButtons.find((service) => service.id === id);
    if (selectedService) {
      setSelectedServiceId(id);
      setTotalPayment(selectedService.price);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setSelectedServiceId(null);
    setTotalPayment(0);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const showDatepicker = async () => {
    try {
      const { action, year, month, day } = await new Promise((resolve) => {
        DateTimePickerAndroid.open({
          value: date,
          mode: "date",
          is24Hour: true,
          onChange: (event, selectedDate) => {
            if (event.type === "dismissed") resolve({ action: "dismissed" });
            const date = selectedDate || new Date();
            resolve({
              action: "set",
              year: date.getFullYear(),
              month: date.getMonth(),
              day: date.getDate(),
            });
          },
        });
      });

      if (action === "set") {
        const newDate = new Date(year, month, day);
        setDate(newDate);
        setFormattedDate(newDate.toLocaleDateString());
      }
    } catch (error) {
      console.error("Error selecting date:", error);
    }
  };

  const saveBookingData = async () => {
    if (!selectedServiceId) {
      alert("Please select a service.");
      return;
    }

    if (!formattedDate || !selectedTime) {
      alert("Please select both date and time.");
      return;
    }

    if (!userData || !userData.token) {
      alert("User data is missing. Please log in again.");
      return;
    }

    const selectedService = radioButtons.find(
      (service) => service.id === selectedServiceId
    );
    const bookingData = {
      barbershop: barbershop,
      services: [
        {
          id: selectedServiceId,
          name: selectedService.label,
          price: selectedService.price,
        },
      ],
      booking_date: date.toLocaleDateString(),
      booking_time: selectedTime,
      totalPayment: totalPayment,
    };

    try {
      dispatch(setAppointments(bookingData));
      console.log("Booking saved successfully:", bookingData);
      navigation.navigate("Review");
    } catch (error) {
      console.error("Failed to save booking data:", error.response.data);
      alert("Failed to save booking data. Please try again.");
    }
  };

  if (!barbershop || !barbershop.services || !barbershop.operational_hours) {
    return (
      <SafeAreaView>
        <View className="h-screen items-center bg-zinc-900">
          <Text className="text-zinc-200 font-bold text-base my-auto">
            No Barbershop Data Available
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="bg-zinc-900">
          <View className="bg-zinc-800 p-3">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="mr-2"
              >
                <Ionicons name="arrow-back" size={20} color="white" />
              </TouchableOpacity>
              <Text className="text-zinc-100 font-bold text-base">Back</Text>
            </View>
          </View>
          {/* Barbershop Header */}
          <View className="bg-zinc-900">
            <ImageBackground
              source={{
                uri:
                  "http://10.10.102.48:8080" +
                  (barbershop.barbershop_profile_picture_id?.path || ""),
              }}
              className="w-full h-64"
              imageStyle={{ opacity: 0.3, borderRadius: 10 }}
            >
              <View className="absolute bottom-0 left-0 right-0 p-4 flex-row items-center">
                <Image
                  source={{
                    uri:
                      "http://10.10.102.48:8080" +
                      (barbershop.barbershop_profile_picture_id?.path || ""),
                  }}
                  className="w-20 h-20 rounded-md"
                  style={{ resizeMode: "cover", opacity: 0.9 }}
                />
                <View className="ml-4">
                  <Text className="text-zinc-100 font-bold text-lg">
                    {barbershop.name || "No Name Available"}
                  </Text>
                  <View className="mt-1">
                    {barbershop.operational_hours.length > 0 ? (
                      barbershop.operational_hours.map((hour, index) => (
                        <Text key={index} className="text-zinc-300 text-xs">
                          {toTitleCase(hour.day)}:{" "}
                          {hour.opening_time.substring(0, 5)} -{" "}
                          {hour.closing_time.substring(0, 5)}
                        </Text>
                      ))
                    ) : (
                      <Text className="text-zinc-300 text-xs">Closed</Text>
                    )}
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* Services Section */}
          <View className=" mt-4 p-4 ">
            <Text className="text-zinc-400 font-bold text-base mb-5 ml-1">
              Select Service
            </Text>
            <View className="flex-col bg-zinc-700 rounded-lg">
              {radioButtons.map(({ id, label, price }) => (
                <TouchableOpacity
                  key={id}
                  onPress={() => handleServiceChange(id)}
                  className={`flex flex-col items-center p-3 rounded-lg mt-2 mb-4 ${
                    selectedServiceId === id ? "bg-zinc-800" : "bg-zinc-600"
                  }`}
                >
                  <Text className="text-zinc-100 font-bold text-base">
                    {label}
                  </Text>
                  <Text className="text-zinc-300 text-sm">
                    Rp.{price.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date and Time Section */}
          <View className="p-4">
            <TouchableOpacity
              onPress={showDatepicker}
              className="mb-3 border border-zinc-500 rounded-lg p-3"
            >
              <Text className="text-zinc-100 font-bold text-base">
                Date: {formattedDate}
              </Text>
            </TouchableOpacity>
            <View className="border border-zinc-500 rounded-lg p-2">
              <Picker
                selectedValue={selectedTime}
                onValueChange={(itemValue) => setSelectedTime(itemValue)}
                mode="dropdown"
                style={{ color: "white" }}
              >
                {availableTimes.map((time, index) => (
                  <Picker.Item key={index} label={time} value={time} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Total Payment Section */}
          <View className="p-4">
            <Text className="text-zinc-100 font-bold text-lg">
              Total Payment: Rp.{totalPayment.toFixed(2)}
            </Text>
          </View>

          {/* Save Button */}
          <View className="p-4">
            <TouchableOpacity
              onPress={saveBookingData}
              className="bg-zinc-200 p-3 rounded-lg items-center"
            >
              <Text className="text-zinc-900 font-bold text-base">
                Save Booking
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
