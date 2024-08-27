import { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getBarbershop,
  getFacilities,
  getGallery,
  getPromotion,
  getServices,
  getSocialMedia,
} from "../service/fetchDataBarberShop";

const HomeScreen = () => {
  const [search, setSearch] = useState("");
  const [barbershopData, setBarbershopData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [facilitiesData, setFacilitiesData] = useState([]);
  const [socialMediaData, setSocialMediaData] = useState([]);
  const [galleryData, setGalleryData] = useState([]);
  const [promotionData, setPromotionData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getBarbershop().then((data) => {
      setBarbershopData(data);
    });
    getServices().then((data) => {
      setServicesData(data);
    });
    getFacilities().then((data) => {
      setFacilitiesData(data);
    });
    getSocialMedia().then((data) => {
      setSocialMediaData(data);
    });
    getGallery().then((data) => {
      setGalleryData(data);
    });
    getPromotion().then((data) => {
      setPromotionData(data);
    });
  }, []);

  const updateSearch = (search) => {
    setSearch(search);
  };

  const filteredBarbershopData = barbershopData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const onRefresh = () => {
    setRefreshing(true);
    getBarbershop().then((data) => {
      setBarbershopData(data);
      setRefreshing(false);
    });
    getServices().then((data) => {
      setServicesData(data);
      setRefreshing(false);
    });
    getFacilities().then((data) => {
      setFacilitiesData(data);
      setRefreshing(false);
    });
    getSocialMedia().then((data) => {
      setSocialMediaData(data);
      setRefreshing(false);
    });
    getGallery().then((data) => {
      setGalleryData(data);
      setRefreshing(false);
    });
    getPromotion().then((data) => {
      setPromotionData(data);
      setRefreshing(false);
    });
  };

  return (
    <SafeAreaView className="flex-1 mt-7 bg-black">
      <View className="flex flex-row items-center px-5">
        <Image
          source={require("../../assets/Gold.png")}
          className="w-16 h-16 mr-2"
          resizeMode="contain"
        />
        <Text className="text-3xl font-semibold text-white">Barber Bro</Text>
      </View>
      <View className="px-6 mr-2 mb-2">
        <SearchBar
          placeholder="Search"
          onChangeText={updateSearch}
          value={search}
          containerStyle={{ backgroundColor: "#FFFFFF", borderRadius: 10 }}
          inputContainerStyle={{ backgroundColor: "#FFFFFF", height: 30 }}
          searchIcon={{ size: 24 }}
          inputStyle={{ fontSize: 18, color: "black" }}
          autoFocus
          style={{ width: "100%", maxWidth: 400 }}
        />
      </View>

      <FlatList
        data={filteredBarbershopData}
        renderItem={({ item }) => {
          const barbershopServices = servicesData.filter(
            (service) => service.barbershop_id === item.barbershop_id
          );
          const barbershopGallery = galleryData.filter(
            (image) => image.barbershop_id === item.barbershop_id
          );

          return (
            <View className="flex flex-col bg-black p-4 items-center">
              <Image
                source={{ uri: item.logo_url }}
                className="rounded-lg"
                style={{
                  resizeMode: "contain",
                  height: 150,
                  width: 150,
                  alignSelf: "center",
                }}
              />
              <View className="mt-4">
                <Text className="text-2xl font-bold text-white text-center ">
                  {item.name}
                </Text>
                <Text className="text-gray-400 text-center">
                  {item.description}
                </Text>
              </View>
              <View className="px-4 py-2 border-b border-gray-300">
                <Text className="text-sm font-bold text-gray-300">
                  Address:
                </Text>
                <Text className="text-sm text-gray-300">
                  {item.street_address}, {item.city}
                </Text>
              </View>
              <View className="px-4 py-2 border-b border-gray-300">
                <Text className="text-sm font-bold text-gray-300">
                  Services:
                </Text>
                <Text className="text-sm text-gray-300">
                  {barbershopServices.map((service, index) => (
                    <Text key={index}>
                      {index + 1}. {service.service_name}
                      {"\n"}
                    </Text>
                  ))}
                </Text>
              </View>
              <View className="px-4 py-2 border-b border-gray-300">
                <Text className="text-sm font-bold text-gray-300">
                  Price Range:
                </Text>
                <Text className="text-sm text-gray-300">
                  {barbershopServices
                    .map((service) => service.price_range)
                    .join(", ")}
                </Text>
              </View>
              <View className="flex flex-row justify-center p-4">
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("BarbershopDetails", {
                      barbershopId: item.barbershop_id,
                    })
                  }
                  className="bg-blue-500 rounded-lg p-2 mx-2"
                  style={{ flex: 1 }}
                >
                  <Text className="text-white text-center">View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("BarbershopGallery", {
                      barbershopId: item.barbershop_id,
                    })
                  }
                  className="bg-blue-500 rounded-lg p-2 mx-2"
                  style={{ flex: 1 }}
                >
                  <Text className="text-white text-center">View Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item.barbershop_id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};
export default HomeScreen;

