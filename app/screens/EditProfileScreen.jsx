import React, { useState, useMemo, useEffect } from "react";
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
import { setProfileData } from "../store/profileData";
import { getDataProfile } from "../service/fetchDataProfile";

export default function EditProfileScreen({ navigation }) {
  const user = useSelector((state) => state.user.loggedInUser);
  const profile = useSelector((state) => state.profileData.profileData);
  // console.log(profile);
  const [firstName, setFirstName] = useState(profile.firstName || "");
  const [surname, setSurname] = useState(profile.surname || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [address, setAddress] = useState(profile.address || "");
  const [about, setAbout] = useState(profile.about || "");
  const [isMale, setIsMale] = useState(profile.is_male || true);
  const [dateOfBirth, setDateOfBirth] = useState(
    profile.date_of_birth
      ? new Date(profile.date_of_birth).getTime()
      : new Date().getTime()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate ? selectedDate.getTime() : dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
  };

  getDataProfile();

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
      date_of_birth: dateOfBirth,
    };

    try {
      await axiosInstance.put("/customers/current", updatedData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error(error.response.data);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const radioButtons = useMemo(
    () => [
      {
        id: "male",
        label: "Male",
        value: true,
        color: "white",
        selectedColor: "white",
        unselectedColor: "white",
        labelStyle: { color: "white" },
      },
      {
        id: "female",
        label: "Female",
        value: false,
        color: "white",
        selectedColor: "white",
        unselectedColor: "white",
        labelStyle: { color: "white" },
      },
    ],
    []
  );

  return (
    <SafeAreaView>
      <ScrollView horizontal={false}>
        <View className="bg-black p-4">
          <View className="gap-2 items-center ">
            <Text className="text-zinc-100 font-bold text-3xl">
              Edit Profile
            </Text>
          </View>
          <View className="gap-3 my-4 px-4">
            <View className="mb-4">
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#a1a1aa"
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
                className="bg-zinc-700 p-3 rounded text-zinc-100 text-lg"
              />
            </View>

            <View className="mb-4">
              <TextInput
                placeholder="Surname"
                placeholderTextColor="#a1a1aa"
                value={surname}
                onChangeText={(text) => setSurname(text)}
                className="bg-zinc-700 p-3 rounded text-zinc-100 text-lg"
              />
            </View>

            <View className="mb-4">
              <TextInput
                placeholder="Phone"
                placeholderTextColor="#a1a1aa"
                value={phone}
                onChangeText={(text) => setPhone(text)}
                className="bg-zinc-700 p-3 rounded text-zinc-100 text-lg"
                keyboardType="phone-pad"
              />
            </View>

            <View className="mb-4">
              <TextInput
                placeholder="Address"
                placeholderTextColor="#a1a1aa"
                value={address}
                onChangeText={(text) => setAddress(text)}
                className="bg-zinc-700 p-3 rounded text-zinc-100 text-lg"
              />
            </View>

            <View className="mb-4">
              <TextInput
                placeholder="About"
                placeholderTextColor="#a1a1aa"
                value={about}
                onChangeText={(text) => setAbout(text)}
                className="bg-zinc-700 p-3 rounded text-zinc-100 text-lg"
              />
            </View>

            <View className="mb-4">
              <RadioGroup
                layout="row"
                radioButtons={radioButtons}
                onPress={(id) => setIsMale(id === "male")}
                selectedId={isMale ? "male" : "female"}
                className="flex-row"
              />
            </View>

            <View className="mb-4">
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className="bg-zinc-700 p-3 rounded"
              >
                <Text className="text-zinc-100 text-lg">
                  {new Date(dateOfBirth).toDateString()}
                </Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(dateOfBirth)}
                  mode="date"
                  display="calendar"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <View className="h-[1px] bg-zinc-700 my-2" />

            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-zinc-100 py-2 rounded my-2"
            >
              <Text className="font-bold text-lg text-center">
                Save Changes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Tab")}
              className="bg-zinc-800 py-2 rounded my-2"
            >
              <Text className="font-bold text-zinc-100 text-lg text-center">
                Back to Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
