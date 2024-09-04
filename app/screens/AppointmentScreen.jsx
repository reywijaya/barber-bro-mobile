import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
};

export default function AppointmentScreen({ route, navigation }) {
  const { barbershop } = route.params || {};
  const [isSelected, setIsSelected] = useState({});
  const [totalPayment, setTotalPayment] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  // console.log("barbershop", barbershop);
  // console.log("userData: ", userData);
  const profileData = useSelector(
    (state) => state.profileData.profileData
  );
  // console.log("profileData: ", profileData);
  const appointMent= useSelector((state) => state.appointment.appointments);
  // console.log("appointMent: ", appointMent);

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

  // console.log("User Data", userData);
  const handleCheckbox = (name, price) => {
    setIsSelected((prevState) => {
      const updatedSelection = {
        ...prevState,
        [name]: !prevState[name],
      };

      const isSelectedNow = !prevState[name];
      setTotalPayment(
        (prevTotal) => prevTotal + (isSelectedNow ? price : -price)
      );

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

  if (!barbershop || !barbershop.services || !barbershop.operational_hours) {
    return (
      <SafeAreaView>
        <View className="h-screen items-center bg-black">
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
        <View className="bg-black">
          <ImageBackground
            source={{
              uri:
                "http://10.10.102.48:8080" +
                (barbershop.barbershop_profile_picture_id?.path || ""),
            }}
            className="w-full h-64"
            imageStyle={{ opacity: 0.4, borderRadius: 10 }}
          >
            <View className="flex-row absolute bottom-0 left-0 right-0 p-2 items-center">
              <Image
                source={{
                  uri:
                    "http://10.10.102.48:8080" +
                    (barbershop.barbershop_profile_picture_id?.path || ""),
                }}
                className="w-16 h-16 rounded-md"
                style={{ resizeMode: "cover", opacity: 0.8 }}
              />
              <View className="flex-col justify-center gap-1 ml-2">
                <Text className="text-zinc-300 font-bold text-lg">
                  {barbershop.name || "No Name Available"}
                </Text>
                <View className="mt-1">
                  {barbershop.operational_hours.length > 0 ? (
                    barbershop.operational_hours.map((hour, index) => (
                      <Text key={index} className="text-zinc-300 text-sm">
                        {toTitleCase(hour.day)}:{" "}
                        {hour.opening_time.substring(0, 2)}.
                        {hour.opening_time.substring(3, 5)} -{" "}
                        {hour.closing_time.substring(0, 2)}.
                        {hour.closing_time.substring(3, 5)}
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

        <View className="bg-black p-4">
          <Text className="text-zinc-400 font-bold p-2">Service</Text>
          <View className="bg-zinc-800 rounded-lg p-2">
            {barbershop.services.length > 0 ? (
              barbershop.services.map((service) => (
                <View
                  key={service.service_name}
                  className="flex-row justify-between items-center border-b border-zinc-600 p-1"
                >
                  <CheckBox
                    checked={isSelected[service.service_name]}
                    onPress={() =>
                      handleCheckbox(service.service_name, service.price)
                    }
                  />
                  <Text className="text-zinc-300">{service.service_name}</Text>
                  <Text className="text-zinc-300">
                    Rp. {service.price.toLocaleString()}
                  </Text>
                </View>
              ))
            ) : (
              <Text className="text-zinc-300">No services available</Text>
            )}
          </View>
        </View>
        <View className="bg-zinc-700 p-4">
          <DateTimePickerAndroid
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            style={{ backgroundColor: "white" }}
          />
        </View>

        <View className="bg-black p-3 h-screen">
          <Text className="text-zinc-400 font-bold p-2">Payment</Text>
          <View className="bg-zinc-800 rounded-lg">
            <View className="flex-row justify-between items-center p-3">
              <View className="flex-col gap-2">
                <Text className="text-zinc-300">Total Payment</Text>
                <Text className="text-zinc-300">
                  Rp. {totalPayment.toLocaleString()}
                </Text>
              </View>
              <TouchableOpacity
                className="bg-zinc-200 p-2 mx-4 rounded-lg"
                onPress={() => navigation.navigate("Payment")}
              >
                <Text className="text-zinc-900 font-bold">Payment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
