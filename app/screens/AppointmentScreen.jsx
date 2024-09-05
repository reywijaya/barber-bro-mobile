import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { CheckBox } from "react-native-elements";
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
  const [isSelected, setIsSelected] = useState({});
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
    // If the barbershop has changed, reset totalPayment
    if (barbershop && previousBarbershop && barbershop.id !== previousBarbershop.id) {
      setTotalPayment(0);
      setIsSelected({});
    }
    setPreviousBarbershop(barbershop);
  }, [barbershop, previousBarbershop]);

  const handleCheckbox = (service_id, service_name, price) => {
    setIsSelected((prevState) => {
      const updatedSelection = {
        ...prevState,
        [service_id]: !prevState[service_id]
          ? { service_name, price }
          : undefined,
      };

      const isSelectedNow = !prevState[service_id];
      if (isSelectedNow) {
        setTotalPayment((prevTotal) => prevTotal + price);
      } else if(isSelectedNow===0){
        setTotalPayment(0);
      } else {
        setTotalPayment((prevTotal) => prevTotal - price);
      }
      return updatedSelection;
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setIsSelected({});
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
    if (
      Object.keys(isSelected).length === 0 ||
      !Object.values(isSelected).some((value) => value)
    ) {
      alert("Please select at least one service.");
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

    const selectedServices = Object.keys(isSelected)
      .filter((key) => isSelected[key])
      .map((service_id) => ({
        id: service_id,
        name: isSelected[service_id].service_name,
        price: isSelected[service_id].price,
      }));

    const bookingData = {
      barbershop: barbershop,
      services: selectedServices,
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
          <Text className="text-zinc-200 font-bold text-lg my-auto">
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
              <Text className="text-zinc-100 font-bold text-lg">  
                Back
              </Text>
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
                  <Text className="text-zinc-100 font-bold text-xl">
                    {barbershop.name || "No Name Available"}
                  </Text>
                  <View className="mt-1">
                    {barbershop.operational_hours.length > 0 ? (
                      barbershop.operational_hours.map((hour, index) => (
                        <Text key={index} className="text-zinc-300 text-sm">
                          {toTitleCase(hour.day)}:{" "}
                          {hour.opening_time.substring(0, 5)} -{" "}
                          {hour.closing_time.substring(0, 5)}
                        </Text>
                      ))
                    ) : (
                      <Text className="text-zinc-300 text-sm">
                        No operational hours available
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* Service Selection */}
          <View className="p-4 mt-4">
            <Text className="text-zinc-400 font-bold text-lg mb-2">
              Services
            </Text>
            <View className="bg-zinc-700 rounded-lg p-3">
              {barbershop.services.length > 0 ? (
                barbershop.services.map((service) => (
                  <View
                    key={service.service_id}
                    className="flex-row justify-between items-center border-b border-zinc-600 py-2"
                  >
                    <CheckBox
                      checked={isSelected[service.service_id]}
                      onPress={() =>
                        handleCheckbox(
                          service.service_id,
                          service.service_name,
                          service.price
                        )
                      }
                      containerStyle={{ backgroundColor: "transparent" }}
                    />
                    <Text className="text-zinc-200 font-bold">
                      {service.service_name}
                    </Text>
                    <Text className="text-zinc-300">Rp.{service.price}</Text>
                  </View>
                ))
              ) : (
                <Text className="text-zinc-300">No services available</Text>
              )}
            </View>
          </View>

          {/* Date & Time Selection */}
          <View className="p-4">
            <Text className="text-zinc-400 font-bold text-lg mb-2">
              Booking Time
            </Text>
            <View className="flex flex-col bg-zinc-700 p-3 rounded-lg">
              <View className="flex flex-row items-center mb-3 justify-between">
                <Text className="text-zinc-200">Date</Text>
                <View className="bg-zinc-800 rounded-lg p-3">
                  <TouchableOpacity onPress={showDatepicker}>
                    <Text className="text-zinc-100 ml-2">{formattedDate}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex flex-row items-center justify-between">
                <Text className="text-zinc-200 w-1/5">Time</Text>
                <View className="flex-1 bg-zinc-800 rounded-lg">
                  <Picker
                    selectedValue={selectedTime}
                    onValueChange={(itemValue) => setSelectedTime(itemValue)}
                    style={{ color: "#e4e4e7",width: "100%", height: 50 }}
                  >
                    {availableTimes.map((time) => (
                      <Picker.Item key={time} label={time} value={time} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
          </View>

          {/* Total Payment */}
          <View className="p-4">
            <Text className="text-zinc-400 font-bold text-lg">
              Total Payment: Rp.{totalPayment}
            </Text>
          </View>

          {/* Save Button */}
          <View className="p-4">
            <TouchableOpacity
              className="bg-zinc-200 py-3 rounded-lg"
              onPress={saveBookingData}
            >
              <Text className="text-zinc-900 text-center font-bold">
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

