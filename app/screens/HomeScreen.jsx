import { useState, useEffect, useMemo } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBarbershop } from "../service/fetchDataBarberShop";
import { getBarbershops } from "../store/barbershops";
import { getDataProfile } from "../service/fetchDataProfile";
import axiosInstance from "../service/axios";
import { login } from "../store/users";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const sortByDistance = (data, order) => {
  return data.sort((a, b) =>
    order === "nearest"
      ? a.distance_km - b.distance_km
      : b.distance_km - a.distance_km
  );
};

const sortByRating = (data, order) => {
  return data.sort((a, b) =>
    order === "highest"
      ? b.average_rating - a.average_rating
      : a.average_rating - b.average_rating
  );
};

const sortBarbershopData = (data, sortDistance, sortRating) => {
  let sortedData = [...data];
  if (sortDistance) {
    sortedData = sortByDistance(sortedData, sortDistance);
  } else if (sortRating) {
    sortedData = sortByRating(sortedData, sortRating);
  }

  return sortedData;
};

const toTitleCase = (str) => {
  if (typeof str !== "string") return str;
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
  // console.log(user);
  const [dataNearbyBarbershop, setDataNearbyBarbershop] = useState([]);
  const [sortDistance, setSortDistance] = useState("");
  const [sortRating, setSortRating] = useState("");

  const fetchBarbershopData = async () => {
    try {
      const data = await getBarbershop();
      dispatch(getBarbershops(data));
      if (user?.token) {
        getDataProfile(dispatch, user.token);
      }
    } catch (error) {
      console.error("Error fetching barbershop data:", error);
    }
  };

  const loadUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !user) {
        navigation.navigate("Login");
        return;
      }
      Toast.show({
        title: "Success",
        type: ALERT_TYPE.SUCCESS,
        textBody: `Welcome back, ${user.email}!`,
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Failed to load user data from AsyncStorage:", error);
    }
  };

  const apiNearbyBarbershop = async (latitude, longitude) => {
    try {
      const res = await axiosInstance.get(
        `/barbers/nearby?latitude=${latitude}&longitude=${longitude}`
      );
      setDataNearbyBarbershop(res.data.data);
    } catch (error) {
      console.error("Error fetching nearby barbershops:", error);
    }
  };

  useEffect(() => {
    const latitude = -7.93476752; // Latitude Enigmacamp Malang
    const longitude = 112.60261667; // Longitude Enigmacamp Malang

    fetchBarbershopData();
    loadUserData();
    apiNearbyBarbershop(latitude, longitude);
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBarbershopData();
    setRefreshing(false);
  };

  const filteredBarbershopData = useMemo(() => {
    let filteredData = dataNearbyBarbershop;
    if (search) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    return sortBarbershopData(filteredData, sortDistance, sortRating);
  }, [search, dataNearbyBarbershop, sortDistance, sortRating]);

  const updateSearch = (search) => {
    setSearch(search);
  };

  const [active, setActive] = useState("Nearby");

  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex flex-col min-h-screen p-8">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-2xl font-bold">Schedule</Text>
              <Text className="text-lg">an appointment</Text>
            </View>
            <View className="flex-row items-center gap-x-2">
              <Ionicons name="notifications" size={22} color="black" />
              <Ionicons name="menu" size={24} color="black" />
            </View>
          </View>

          <View className="my-8">
            <View className="flex flex-row items-center p-3 rounded-full focus:border-2 focus:border-zinc-500 bg-zinc-200">
              <AntDesign
                name="search1"
                size={24}
                color="black"
                onPress={updateSearch}
              />
              <TextInput
                onChangeText={updateSearch}
                value={search}
                className="pl-2 text-lg"
                placeholder="Search"
              />
            </View>
          </View>

          <View className="flex flex-row items-center mb-2 bg-zinc-200 rounded-full p-2 justify-between">
            <TouchableOpacity
              onPress={() => {
                setActive("Nearby");
                setSortDistance("nearest");
                setSortRating("");
              }}
              className={`${
                active === "Nearby"
                  ? "bg-zinc-300 border-2 border-zinc-300"
                  : ""
              } rounded-full py-2 w-24 items-center`}
            >
              <Text className="font-bold">Nearby</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActive("Popular");
                setSortRating("highest");
                setSortDistance("");
              }}
              className={`${
                active === "Popular"
                  ? "bg-zinc-300 border-2 border-zinc-300"
                  : ""
              } rounded-full py-2 w-24 items-center`}
            >
              <Text className="text-zinc-900 font-bold">Popular</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActive("Verified");
                setSortDistance("");
                setSortRating("");
              }}
              className={`${
                active === "Verified"
                  ? "bg-zinc-300 border-2 border-zinc-300"
                  : ""
              } rounded-full py-2 w-24 items-center`}
            >
              <Text className="text-zinc-900 font-bold">Verified</Text>
            </TouchableOpacity>
          </View>

          {filteredBarbershopData.map((item) => (
            <View
              key={item.id}
              className="flex flex-col my-2 border-2 border-zinc-200 rounded-3xl p-2"
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Barbershop", { id: item.id })
                }
              >
                <View className="flex flex-row">
                  <Image
                    source={{
                      uri:
                        "http://10.10.102.48:8085" +
                        item.barbershop_profile_picture_id.path,
                    }}
                    style={{ width: 100, height: 100, borderRadius: 16 }}
                  />
                  <View className="flex-col gap-y-1 px-3">
                    <Text className="text-lg font-bold">
                      {toTitleCase(item.name)}
                    </Text>
                    <Text className="text-zinc-500">
                      {item.city}, {item.state_province_region}
                    </Text>
                    <View className="flex-row items-center gap-x-2">
                      <AntDesign name="star" size={15} color="#f59e0b" />
                      <Text className="text-xs font-bold">
                        {item.average_rating}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-x-2">
                      <Feather name="map-pin" size={14} color="black" />
                      <Text className="text-xs font-bold">
                        {item.distance_km.toFixed(2)} km
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
