import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../service/axios";

const HomeScreen = () => {
  const [search, setSearch] = useState("");
  const [barbershopData, setBarbershopData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [facilitiesData, setFacilitiesData] = useState([]);
  const [socialMediaData, setSocialMediaData] = useState([]);
  const [galleryData, setGalleryData] = useState([]);
  const [promotionData, setPromotionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const barbershopResponse = await axiosInstance.get("/barbershop");
        const servicesResponse = await axiosInstance.get("/service");
        const facilitiesResponse = await axiosInstance.get("/facility");
        const socialMediaResponse = await axiosInstance.get("/social_media");
        const galleryResponse = await axiosInstance.get("/gallery_image");
        const promotionResponse = await axiosInstance.get("/promotion");

        // Set data state
        setBarbershopData(barbershopResponse.data);
        setServicesData(servicesResponse.data);
        setFacilitiesData(facilitiesResponse.data);
        setSocialMediaData(socialMediaResponse.data);
        setGalleryData(galleryResponse.data);
        setPromotionData(promotionResponse.data);

        // console.log("Barbershop data: ", barbershopResponse.data);
        // console.log("Services data: ", servicesResponse.data);
        // console.log("Facilities data: ", facilitiesResponse.data);
        // console.log("Social Media data: ", socialMediaResponse.data);
        // console.log("Gallery data: ", galleryResponse.data);
        // console.log("Promotion data: ", promotionResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  const updateSearch = (search) => {
    setSearch(search);
  };

  const filteredBarbershopData = barbershopData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="py-4 px-6">
        <Text className="text-3xl font-semibold">Barber Bro</Text>
      </View>
      <View className="px-6 mr-2 mb-2" style={{ height: 50, width: "100%" }}>
        <SearchBar
          placeholder="Search"
          onChangeText={updateSearch}
          value={search}
          containerStyle={{ backgroundColor: "#FFFFFF", borderRadius: 10 }}
          inputContainerStyle={{ backgroundColor: "#FFFFFF", height: 40 }}
          searchIcon={{ size: 24 }}
          inputStyle={{ fontSize: 16 }}
          autoFocus
        />
      </View>
      <ScrollView className="px-6" horizontal={false}>
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
              <View className="bg-white rounded-lg shadow-md p-4 mb-4">
                <Image
                  source={{ uri: item.logo_url }}
                  className="w- h-10 rounded-lg shadow-lg mx-auto"
                  style={{ resizeMode: "contain", height: 100, width: 100 }}
                />
                <View className="p-4">
                  <Text className="text-2xl font-bold">{item.name}</Text>
                  <Text className="text-gray-600 font-bold">
                    {item.street_address}, {item.city}
                  </Text>
                  <Text className="text-gray-600 text-justify">
                    {item.description}
                  </Text>
                  <Text className="text-gray-600">
                    Services:{" "}
                    {barbershopServices
                      .map((service) => service.service_name)
                      .join(", ")}
                  </Text>
                  <Text className="text-gray-600">
                    Price Range:{" "}
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
                  >
                    <Text className="text-white">View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("BarbershopGallery", {
                        barbershopId: item.barbershop_id,
                      })
                    }
                    className="bg-blue-500 rounded-lg p-2 mx-2"
                  >
                    <Text className="text-white">View Gallery</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          keyExtractor={(item) => item.barbershop_id}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
export default HomeScreen;
