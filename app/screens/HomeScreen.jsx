import { useState, useEffect, useMemo } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ImageBackground,
  Alert,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBarbershop } from "../service/fetchDataBarberShop";
import { getBarbershops } from "../store/barbershops";
import { getDataProfile } from "../service/fetchDataProfile";
import axiosInstance from "../service/axios";

const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
};

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.loggedInUser);
  const dataProfile = useSelector((state) => state.profileData.profileData);
  const [dataNearbyBarbershop, setDataNearbyBarbershop] = useState([]);
  console.log("nearbyBarbershop", dataNearbyBarbershop);

  const fetchBarbershopData = async () => {
    const data = await getBarbershop();
    dispatch(getBarbershops(data));
    getDataProfile(dispatch, user.token);
  };

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("loggedInUser");
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        Alert.alert("Welcome", `Welcome back, ${userData.email}!`);
      }
    } catch (error) {
      console.error("Failed to load user data from AsyncStorage:", error);
    }
  };

  const updateSearch = (search) => {
    setSearch(search);
  };

  const filteredBarbershopData = useMemo(() => {
    if (!search) {
      return dataNearbyBarbershop;
    }

    return dataNearbyBarbershop.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, dataNearbyBarbershop]);

  const latitude = -7.93476752;
  const longitude = 112.60261667;

  const apiNearbyBarbershop = async (latitude, longitude) => {
    try {
      const res = await axiosInstance.get(
        `/barbers/nearby?latitude=${latitude}&longitude=${longitude}`
      );
      setDataNearbyBarbershop(res.data.data);
    } catch (error) {
      console.log("Error fetching nearby barbershops:", error.response.data);
    }
  };

  useEffect(() => {
    fetchBarbershopData();
    loadUserData();
    apiNearbyBarbershop(latitude, longitude);
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    const data = await getBarbershop();
    dispatch(getBarbershops(data));
    getDataProfile(dispatch, user.token);
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 mt-7 bg-black">
      <View className="px-5">
        <SearchBar
          placeholder="Search"
          onChangeText={updateSearch}
          value={search}
          containerStyle={{ backgroundColor: "#27272a", borderRadius: 10 }}
          inputContainerStyle={{ backgroundColor: "#27272a", height: 30 }}
          searchIcon={{ size: 24, color: "#d4d4d8" }}
          inputStyle={{ fontSize: 18, color: "#d4d4d8" }}
          autoFocus
          style={{ width: "100%", maxWidth: 400 }}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredBarbershopData.map((item) => (
          <View key={item.id} className="flex flex-col bg-black p-5">
            <View className="rounded-lg items-center">
              <ImageBackground
                source={{
                  uri:
                    "http://10.10.102.48:8085" +
                    item.barbershop_profile_picture_id.path,
                }}
                style={{ height: 180, width: 280 }}
                imageStyle={{ opacity: 0.7, borderRadius: 10 }}
              >
                <View className="flex-row justify-between items-end h-full px-3 py-1">
                  <View className="flex flex-row gap-1">
                    <Ionicons
                      name="star-sharp"
                      size={14}
                      color="#ddc686"
                      style={{ opacity: 0.9 }}
                    />
                    <Text
                      className="text-white text-xs font-bold"
                      style={{ opacity: 0.9 }}
                    >
                      {item.average_rating}
                    </Text>
                  </View>
                  <View className="flex flex-row gap-1">
                    <Ionicons
                      name="location-sharp"
                      size={14}
                      color="white"
                      style={{ opacity: 0.9 }}
                    />
                    <Text
                      className="text-white text-xs font-bold"
                      style={{ opacity: 0.9 }}
                    >
                      {item.distance_km.toFixed(1)} km
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
            <View className="mt-4 mb-4 ml-5 flex flex-row">
              <View className="flex flex-row items-center shadow-lg">
                <Image
                  source={{
                    uri:
                      "http://10.10.102.48:8080" +
                      item.barbershop_profile_picture_id.path,
                  }}
                  className="w-10 h-10 rounded-full"
                  resizeMode="cover"
                />
                <View className="ml-4 flex flex-col">
                  <Text className="text-xl font-bold text-white">
                    {toTitleCase(item.name)}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex flex-row justify-center px-5">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Barbershop", {
                    id: item.id,
                  })
                }
                className="bg-zinc-200 rounded-lg py-2"
                style={{ flex: 1 }}
              >
                <Text className="text-zinc-800 text-center font-bold">
                  View Details
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
