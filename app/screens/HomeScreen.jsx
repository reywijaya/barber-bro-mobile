import { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ImageBackground,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { getBarbershop } from "../service/fetchDataBarberShop";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [barbershopData, setBarbershopData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getBarbershop().then((data) => {
      setBarbershopData(data);
    });
  }, []);

  const updateSearch = (search) => {
    setSearch(search);
  };

  const filteredBarbershopData = barbershopData.filter((item) => {
    return item.name.toLowerCase().includes(search.toLowerCase());
  });
  // console.log(filteredBarbershopData);

  const onRefresh = () => {
    setRefreshing(true);
    getBarbershop().then((data) => {
      setBarbershopData(data);
      setRefreshing(false);
    });
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

      <FlatList
        data={filteredBarbershopData}
        renderItem={({ item }) => {
          return (
            <View className="flex flex-col bg-black p-5">
              <View className="rounded-lg items-center">
                <ImageBackground
                  source={{ uri: item.logo_url }}
                  style={{ height: 180, width: 280 }}
                  imageStyle={{ opacity: 0.7, borderRadius: 10 }}
                >
                  <View className="flex-row justify-between items-end h-full px-3 py-1 ">
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
                        4.5
                      </Text>
                    </View>
                    <View className="flex flex-row  gap-1">
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
                        0.2 km
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </View>
              <View className="mt-4 mb-4 ml-5 flex flex-row ">
                <View className="flex flex-row items-center bg ">
                  <Image
                    source={{ uri: item.logo_url }}
                    className="w-10 h-10 rounded-full"
                    resizeMode="cover"
                  />
                  <View className="ml-4 flex flex-col">
                    <Text className="text-xl font-bold text-white">
                      {item.name}
                    </Text>
                    <View className="flex flex-row items-center">
                      <Text className="text-white">09.00 - 22.00</Text>
                    </View>
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
                  className="bg-zinc-200 rounded-lg py-2 "
                  style={{ flex: 1 }}
                >
                  <Text className="text-zinc-800 text-center font-bold">
                    View Details
                  </Text>
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
