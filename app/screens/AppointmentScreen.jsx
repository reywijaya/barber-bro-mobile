import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setAppointments } from "../store/appointment";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  }).format(price);
};

const validateTime = (selectedTimeString, operationalHours) => {
  // Ensure operationalHours is an array
  if (!Array.isArray(operationalHours)) {
    console.warn("Operational hours data is not an array.");
    return false;
  }

  const [selectedHour, selectedMinute] = selectedTimeString
    .split(":")
    .map(Number);

  for (let hour of operationalHours) {
    const { day, opening_time, closing_time } = hour;
    if (!opening_time || !closing_time) {
      console.warn(`Opening time or closing time missing for day: ${day}`);
      continue;
    }

    const [openHour, openMinute] = opening_time.split(":").map(Number);
    const [closeHour, closeMinute] = closing_time.split(":").map(Number);

    if (
      isWithinRange(
        selectedHour,
        selectedMinute,
        openHour,
        openMinute,
        closeHour,
        closeMinute
      )
    ) {
      return true;
    }
  }

  return false;
};

const isWithinRange = (
  hour,
  minute,
  openHour,
  openMinute,
  closeHour,
  closeMinute
) => {
  const selectedTime = hour * 60 + minute;
  const openingTime = openHour * 60 + openMinute;
  const closingTime = closeHour * 60 + closeMinute;

  return selectedTime >= openingTime && selectedTime <= closingTime;
};

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
    if (barbershop) {
      setTotalPayment(0);
      setSelectedServiceId(null);
    }
  }, [barbershop]);

  const radioButtons = useMemo(() => {
    if (!barbershop || !Array.isArray(barbershop.services)) {
      console.warn("Barbershop services are not available or not an array");
      return [];
    }
    return barbershop.services.map((service) => ({
      id: service.service_id || "no-id",
      label: service.service_name || "No Service Name",
      value: service.service_id || "no-id",
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
          minimumDate: new Date(),
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

  const showTimepicker = async () => {
    try {
      const { action, hour, minute } = await new Promise((resolve) => {
        DateTimePickerAndroid.open({
          value: new Date(
            0,
            0,
            0,
            parseInt(selectedTime.split(":")[0]),
            parseInt(selectedTime.split(":")[1])
          ),
          mode: "time",
          is24Hour: true,
          onChange: (event, selectedDate) => {
            if (event.type === "dismissed") resolve({ action: "dismissed" });
            const time = selectedDate || new Date();
            resolve({
              action: "set",
              hour: time.getHours(),
              minute: time.getMinutes(),
            });
          },
        });
      });

      if (action === "set") {
        const formattedTime = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        if (validateTime(formattedTime, barbershop.operational_hours)) {
          setSelectedTime(formattedTime);
        } else {
          Alert.alert(
            "Invalid Time",
            `Time ${formattedTime} is not within operational hours barbershop.`
          );
        }
      }
    } catch (error) {
      console.error("Error selecting time:", error);
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
      console.error("Failed to save booking data:", error);
      alert("Failed to save booking data. Please try again.");
    }
  };

  if (!barbershop || !barbershop.services || !barbershop.operational_hours) {
    return (
      <SafeAreaView>
        <View className="h-screen items-center bg-zinc-900 justify-center">
          <Text className="text-zinc-200 font-bold text-base">
            No Barbershop Data Available
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="flex-1"
        refreshing={refreshing}
        onRefresh={onRefresh}
      >
        {/* Back Button and Header */}
        <View className="flex-row bg-zinc-800 p-2 items-center gap-3">
          <Ionicons
            name="arrow-back"
            size={20}
            color="#e4e4e7"
            onPress={() => navigation.goBack()}
          />
          <Text className="text-zinc-200 text-xl">Back</Text>
        </View>

        <View className="bg-zinc-900 p-2 ">
          {/* Barbershop Header */}
          <View className="mb-4">
            <ImageBackground
              source={{
                uri:
                  "http://10.10.102.48:8085" +
                  (barbershop.barbershop_profile_picture_id?.path || ""),
              }}
              className="w-full h-64 rounded-lg overflow-hidden"
              style={{ opacity: 0.8 }}
            >
              {/* Gradient overlay for better text readability */}
              <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/60" />

              <View className="absolute bottom-0 left-0 right-0 p-4">
                <View className="flex-row items-center">
                  <Image
                    source={{
                      uri:
                        "http://10.10.102.48:8085" +
                        (barbershop.barbershop_profile_picture_id?.path || ""),
                    }}
                    className="w-20 h-20 rounded-md"
                    style={{ resizeMode: "cover", opacity: 1 }}
                  />
                  <View className="ml-4">
                    <Text className="text-white font-bold text-base shadow-lg border-b border-collapse">
                      {barbershop.name || "No Name Available"}
                    </Text>
                    <View className="mt-2">
                      {barbershop.operational_hours.length > 0 ? (
                        barbershop.operational_hours.map((hour, index) => (
                          <Text
                            key={index}
                            className="text-white text-xs shadow-md"
                          >
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
              </View>
            </ImageBackground>
          </View>

          {/* Service Selection */}
          <View className="mb-4">
            <Text className="text-zinc-400 font-bold text-base">
              Choose Service
            </Text>
            <View className="mt-2">
              {radioButtons.map(({ id, label, price }) => (
                <TouchableOpacity
                  key={id}
                  onPress={() => handleServiceChange(id)}
                  className={`p-4 mb-2 rounded-lg ${
                    selectedServiceId === id ? "bg-zinc-600" : "bg-zinc-800"
                  }`}
                >
                  <Text className="text-zinc-200 font-semibold text-lg">
                    {label}
                  </Text>
                  <Text className="text-zinc-400">{formatPrice(price)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date and Time Picker */}
          <View className="mb-4">
            <Text className="text-zinc-400 font-bold text-base">
              Select Date and Time
            </Text>
            <TouchableOpacity
              onPress={showDatepicker}
              className="flex flex-row items-center mt-2 p-4 bg-zinc-800 rounded-lg"
            >
              <Ionicons name="calendar" size={20} color="white" />
              <Text className="text-zinc-200 ml-2">{formattedDate}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={showTimepicker}
              className="flex flex-row items-center mt-2 p-4 bg-zinc-800 rounded-lg"
            >
              <Ionicons name="time" size={20} color="white" />
              <Text className="text-zinc-200 ml-2">{selectedTime}</Text>
            </TouchableOpacity>
          </View>

          {/* Total Payment */}
          <View className="mb-4">
            <Text className="text-zinc-400 font-bold text-base">
              Total Payment
            </Text>
            <Text className="text-zinc-200 p-4 bg-zinc-800 rounded-lg">
              {formatPrice(totalPayment)}
            </Text>
          </View>

          {/* Confirm Booking Button */}
          <TouchableOpacity
            onPress={saveBookingData}
            className="bg-zinc-200 rounded-lg p-4"
          >
            <Text className="text-zinc-900 text-center font-bold">
              Confirm Booking
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
