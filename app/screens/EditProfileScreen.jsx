import React, { useState, useEffect, useMemo } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../service/axios";
import { RadioGroup } from "react-native-radio-buttons-group";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { getDataProfile } from "../service/fetchDataProfile";
import { setProfileData } from "../store/profileData";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";

export default function EditProfileScreen({ navigation }) {
  const user = useSelector((state) => state.user.loggedInUser);
  const profile = useSelector((state) => state.profileData.profileData);
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [surname, setSurname] = useState(profile?.surname || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [about, setAbout] = useState(profile?.about || "");
  const [isMale, setIsMale] = useState(profile?.is_male || true);
  const [dateOfBirth, setDateOfBirth] = useState(
    profile?.date_of_birth ? new Date(profile.date_of_birth) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (user.token) {
      getDataProfile(dispatch, user.token);
    }
  }, [user.token, dispatch]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
  };

  const handleSubmit = async () => {
    if (!firstName || !surname || !phone || !address || !about) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (!/^\d{10,13}$/.test(phone)) {
      Alert.alert("Error", "Phone number must be between 10 and 13 digits.");
      return;
    }

    const updatedData = {
      firstName,
      surname,
      phone,
      address,
      about,
      is_male: isMale,
      date_of_birth: dateOfBirth.getTime(),
    };

    console.log("Updated Data:", updatedData);

    try {
      const response = await axiosInstance.put(
        "/customers/current",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Response:", response.data.data);
      dispatch(setProfileData(response.data.data));
      Alert.alert("Success", "Profile updated successfully!");
      navigation.navigate("Tab");
    } catch (error) {
      console.error("Update Error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        `Failed to update profile. ${error.response?.data?.error || "Please try again."
        }`
      );
    }
  };

  const radioButtons = useMemo(
    () => [
      {
        id: "male",
        label: "Male",
        value: true,
        color: "black",
        selectedColor: "black",
        unselectedColor: "gray",
        labelStyle: { color: "black" },
      },
      {
        id: "female",
        label: "Female",
        value: false,
        color: "black",
        selectedColor: "black",
        unselectedColor: "gray",
        labelStyle: { color: "black" },
      },
    ],
    []
  );

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex flex-col p-8">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => navigation.navigate("Tab")}>
              <FontAwesome5 name="arrow-circle-left" size={24} color={"black"} />
            </TouchableOpacity>
            <Text className="font-bold text-lg w-2/3">Account Settings</Text>
          </View>

          <View className="gap-y-4 my-4">
            <View className="gap-y-2">
              <Text>First Name</Text>
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#a1a1aa"
                value={firstName}
                onChangeText={setFirstName}
                className="py-2 px-4 rounded-full border-2 border-zinc-200 text-lg focus:border-2 focus:border-zinc-500"
              />
            </View>

            <View className="gap-y-2">
              <Text>Surname</Text>
              <TextInput
                placeholder="Surname"
                placeholderTextColor="#a1a1aa"
                value={surname}
                onChangeText={setSurname}
                className="py-2 px-4 rounded-full border-2 border-zinc-200 text-lg focus:border-2 focus:border-zinc-500"
              />
            </View>

            <View className="gap-y-2">
              <Text>Phone Number</Text>
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#a1a1aa"
                value={phone}
                onChangeText={setPhone}
                className="py-2 px-4 rounded-full border-2 border-zinc-200 text-lg focus:border-2 focus:border-zinc-500"
                keyboardType="phone-pad"
              />
            </View>

            <View className="gap-y-2">
              <Text>Address</Text>
              <TextInput
                placeholder="Address"
                placeholderTextColor="#a1a1aa"
                value={address}
                onChangeText={setAddress}
                className="py-2 px-4 rounded-full border-2 border-zinc-200 text-lg focus:border-2 focus:border-zinc-500" />
            </View>

            <View className="gap-y-2">
              <Text>Gender</Text>
              <RadioGroup
                layout="row"
                radioButtons={radioButtons}
                onPress={(id) => setIsMale(id === "male")}
                selectedId={isMale ? "male" : "female"}
              />
            </View>

            <View className="gap-y-2">
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className="py-2 px-4 rounded-full border-2 border-zinc-200 text-lg focus:border-2 focus:border-zinc-500"
              >
                <Text className="text-lg">
                  {dateOfBirth.toDateString()}
                </Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth}
                  mode="date"
                  display="calendar"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-zinc-800 rounded-full py-2 mt-2"
            >
              <Text className="text-zinc-200 text-lg text-center">
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}