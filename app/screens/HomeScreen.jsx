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
  TextInput,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign, Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBarbershop } from "../service/fetchDataBarberShop";
import { getBarbershops } from "../store/barbershops";
import { getDataProfile } from "../service/fetchDataProfile";
import axiosInstance from "../service/axios";
import { Toast } from "react-native-alert-notification";

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
        Toast.show({
          title: "Success",
          type: ALERT_TYPE.SUCCESS,
          textBody: `Welcome back, ${userData.email}!`,
          autoClose: 2000,
        });
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

  //for navigation bar
  const [active, setActive] = useState("Nearby");

  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
              <AntDesign name="search1" size={24} color="black" />
              <TextInput
                onChangeText={updateSearch}
                value={search}
                className="pl-2 text-lg"
                placeholder="Search" />
            </View>
          </View>

          <View className="flex flex-row items-center mb-2 bg-zinc-200 rounded-full p-2 justify-between">
            <TouchableOpacity
              onPress={() => setActive("Nearby")}
              className={`${active === "Nearby" ? "bg-zinc-300 border-2 border-zinc-300" : ""} rounded-full py-2 w-24 items-center`}>
              <Text className="font-bold">Nearby</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActive("Popular")}
              className={`${active === "Popular" ? "bg-zinc-300 border-2 border-zinc-300" : ""} rounded-full py-2 w-24 items-center`}>
              <Text className="text-zinc-900 font-bold">Popular</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActive("Verified")}
              className={`${active === "Verified" ? "bg-zinc-300 border-2 border-zinc-300" : ""} rounded-full py-2 w-24 items-center`}>
              <Text className="text-zinc-900 font-bold">Verified</Text>
            </TouchableOpacity>
          </View>

          {filteredBarbershopData.map((item) => (
            <View key={item.id} className="flex flex-col my-2 border-2 border-zinc-200 rounded-3xl p-2">
              <TouchableOpacity onPress={() => navigation.navigate("Barbershop", { id: item.id })}>
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
                      <Text className="text-xs font-bold">{item.average_rating}</Text>
                    </View>
                    <View className="flex-row items-center gap-x-2">
                      <Feather name="map-pin" size={14} color="black" />
                      <Text className="text-xs font-bold">
                        {item.distance_km.toFixed(1)} km
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
