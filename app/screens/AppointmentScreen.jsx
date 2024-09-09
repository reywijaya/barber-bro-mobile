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
import { Fontisto, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

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
          Toast.show({
            title: "Error",
            type: ALERT_TYPE.DANGER,
            textBody: `Time ${formattedTime} is not within operational hours barbershop.`,
            autoClose: 2000,
          });
        }
      }
    } catch (error) {
      console.error("Error selecting time:", error);
    }
  };

  const saveBookingData = async () => {
    if (!selectedServiceId) {
      Toast.show({
        title: "Error",
        type: ALERT_TYPE.DANGER,
        textBody: "Please select a service.",
        autoClose: 2000,
      });
      return;
    }

    if (!formattedDate || !selectedTime) {
      Toast.show({
        title: "Error",
        type: ALERT_TYPE.DANGER,
        textBody: "Please select a date and time.",
        autoClose: 2000,
      });
      return;
    }

    if (!validateTime(selectedTime, barbershop.operational_hours)) {
      Toast.show({
        title: "Error",
        type: ALERT_TYPE.DANGER,
        textBody: `Time ${selectedTime} is not within operational hours barbershop.`,
        autoClose: 2000,
      });
      return;
    }

    if (!userData || !userData.token) {
      Toast.show({
        title: "Error",
        type: ALERT_TYPE.DANGER,
        textBody: "Please login first.",
        autoClose: 2000,
      });
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
      Toast.show({
        title: "Error",
        type: ALERT_TYPE.DANGER,
        textBody: "Failed to save booking data. Please try again.",
        autoClose: 2000,
      });
    }
  };

  if (!barbershop || !barbershop.services || !barbershop.operational_hours) {
    return (
      <SafeAreaView>
        <View className="h-screen items-center bg-zinc-200 justify-center">
          <Text className="text-zinc-800 font-bold text-base">
            No Barbershop Data Available
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex flex-col p-8 min-h-screen">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Ionicons
          name="arrow-back"
          size={24}
          color="#030712"
          onPress={() => navigation.goBack()}
        />
        <Text className="text-lg font-bold w-2/3">Appointment</Text>
      </View>

      {/* Main Content */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Barbershop Info */}
        <View className="flex-col items-center justify-center border-2 border-zinc-200 rounded-3xl px-6 py-4 my-2">
          <Text className="text-lg font-bold">
            {barbershop.name}
            <MaterialIcons name="verified" size={18} color="black" />
          </Text>
          <View>
            {barbershop.operational_hours.length > 0 ? (
              barbershop.operational_hours.map((hour, index) => (
                <Text key={index} className="text-sm text-center">
                  {toTitleCase(hour.day)}:{" "}
                  {hour.opening_time.substring(0, 5)} -{" "}
                  {hour.closing_time.substring(0, 5)}
                </Text>
              ))
            ) : (
              <Text className="font-extrabold bg-zinc-200 p-2 rounded-lg text-center">Closed</Text>
            )}
          </View>
        </View>

        {/* Service Selection */}
        <View className="flex-col items-center justify-center border-2 border-zinc-200 rounded-3xl p-2 my-2">
          <Text className="font-extrabold bg-zinc-200 p-2 rounded-3xl text-center w-full">
            Select Service
          </Text>
          <View className="mt-4 w-full">
            {radioButtons.map((service) => (
              <TouchableOpacity
                key={service.id}
                onPress={() => handleServiceChange(service.id)}
                className={`py-2 items-center border-2 border-zinc-200 rounded-3xl ${selectedServiceId === service.id ? "bg-zinc-200" : ""}`}
              >
                <Text className="font-extrabold">
                  {service.label}
                </Text>
                <Text>
                  {formatPrice(service.price)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Booking Details */}
        <View className="flex-col items-center justify-center border-2 border-zinc-200 rounded-3xl p-2 my-2">
          <Text className="font-extrabold bg-zinc-200 p-2 rounded-3xl text-center w-full">
            Booking Date
          </Text>
          <TouchableOpacity
            onPress={showDatepicker}
            className="flex-row justify-between py-2 px-4 items-center border-2 border-zinc-200 rounded-3xl w-full mt-2"
          >
            <Text className="font-bold">
              Select Date: {formattedDate}
            </Text>
            <Fontisto name="date" size={18} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showTimepicker}
            className="flex-row justify-between py-2 px-4 items-center border-2 border-zinc-200 rounded-3xl w-full mt-2"
          >
            <Text className="font-bold">
              Select Time: {selectedTime}
            </Text>
            <Ionicons name="time-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>

        {/* Total Payment */}
        <View className="flex-col items-center justify-center border-2 border-zinc-200 rounded-3xl p-2 my-2">
          <Text className="font-extrabold bg-zinc-200 p-2 rounded-3xl text-center w-full">
            Total Payment
          </Text>
          <View className="py-2 items-center bg-zinc-600  rounded-3xl mt-4 w-full">
            <Text className="text-xl text-zinc-100 font-extrabold">
              {formatPrice(totalPayment)}
            </Text>
          </View>
        </View>

        {/* Booking Button */}
        <TouchableOpacity
          className="w-full bg-zinc-800 rounded-full py-2 my-4"
          onPress={saveBookingData}
        >
          <Text className="text-zinc-200 font-bold text-center text-xl">
            Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
