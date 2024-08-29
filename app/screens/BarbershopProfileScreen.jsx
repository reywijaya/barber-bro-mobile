import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Rating } from "react-native-elements";
import { useEffect, useState } from "react";
import { getReviews } from "../service/fetchDataReview";
import { getBarbershopById } from "../service/fetchDataBarberShop";
import { Linking } from "react-native";
import { ScrollView } from "react-native";

const dummyImage = [
  {
    id: 1,
    imageURL:
      "https://assets-global.website-files.com/644a9d9ce529ef8812f82a28/647fb85c69e95444243ef9bd_Henley%27s%20Gentlemen%27s%20Grooming%20-%20Barbershop%20and%20Mens%20Grooming.webp",
  },
  {
    id: 2,
    imageURL:
      "https://awsimages.detik.net.id/community/media/visual/2024/03/06/captain-barbershop-1_169.jpeg?w=1200",
  },
  {
    id: 3,
    imageURL:
      "https://malangraya.media/wp-content/uploads/2023/07/Barbershop-di-Malang.jpg",
  },
  {
    id: 4,
    imageURL:
      "https://insights.ibx.com/wp-content/uploads/2023/06/kym-barbershop.jpg",
  },
  {
    id: 5,
    imageURL: "https://frisorbarbershop.com/images/b-promo/world/1promo.jpg",
  },
];

export default function BarbershopProfileScreen({ route, navigation }) {
  const { id } = route.params;
  const [barbershop, setBarbershop] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const fetchData = async () => {
    try {
      const barbershopData = await getBarbershopById(id);
      const reviewsData = await getReviews();
      setBarbershop(barbershopData);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleRefresh = () => {
    setRefresh(true);
    fetchData();
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView className="flex-1">
      <FlatList
        data={[]}
        refreshing={refresh}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <View>
            {/* Back Button and Header */}
            <View className="flex flex-col bg-black p-2">
              <View className="flex-row bg-zinc-900 p-2 rounded-lg">
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => navigation.goBack()}
                >
                  <View className="px-2 items-center">
                    <Feather name="arrow-left" size={20} color="#e4e4e7" />
                  </View>
                  <View className="px-2 items-center">
                    <Text className="text-zinc-200 text-xl">Back</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Barbershop Information */}
              <View className="flex-col items-center rounded-lg p-2 bg-zinc-900 my-2">
                <Image
                  source={{ uri: barbershop.logo_url }}
                  style={{ width: 90, height: 90 }}
                  className="rounded-lg"
                />
                <View className="mt-2 items-center">
                  <View className="flex-row items-center gap-x-2">
                    <Text className="text-zinc-200 font-bold text-lg">
                      {barbershop.name}
                    </Text>
                    <MaterialIcons name="verified" size={16} color="white" />
                  </View>
                  <Text className="text-zinc-400">{barbershop.address}</Text>
                  <Text className="text-zinc-400">
                    {barbershop.street_address}
                  </Text>
                  <Text className="text-zinc-400">
                    {barbershop.city}, {barbershop.state_province_region},{" "}
                    {barbershop.postal_zip_code}, {barbershop.country}
                  </Text>
                </View>
              </View>

              {/* Location and Description */}
              <TouchableOpacity className="flex-row justify-center items-center rounded-lg p-2 bg-zinc-900">
                <View className="px-2">
                  <Ionicons name="location-outline" size={20} color="#e4e4e7" />
                </View>
                <Text className="text-zinc-200">View Location</Text>
              </TouchableOpacity>
              <View className="flex-row mt-2 justify-around items-center rounded-lg p-2 bg-zinc-900">
                <View className="items-center">
                  {/* Description */}
                  <Text className="text-zinc-400 p-2">Description</Text>
                  <Text className="text-zinc-200 p-2">
                    {barbershop.description}
                  </Text>
                </View>
              </View>
              {/* Gallery */}
              <View className="bg-black ">
                <Text className="text-zinc-400 px-1 font-bold mb-2 mt-2">
                  Gallery
                </Text>
                <View className="bg-zinc-900 p-2  rounded-lg">
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    {dummyImage.map((image) => {
                      return (
                        <Image
                          key={image.id}
                          source={{ uri: image.imageURL }}
                          className="h-40 w-60 rounded-lg m-2"
                        />
                      );
                    })}
                  </ScrollView>
                </View>
              </View>

              {/* Operational Hours */}
              <View className="bg-black ">
                <Text className="text-zinc-400 px-1 font-bold mb-2 mt-2">
                  Operational Hours
                </Text>
                <View className="bg-zinc-900 p-2  rounded-lg">
                  <FlatList
                    data={barbershop.operational_hours}
                    keyExtractor={(item) => item.day}
                    renderItem={({ item }) => (
                      <View className="flex-row justify-between p-2">
                        <Text className="text-lg text-zinc-200">
                          {item.day}
                        </Text>
                        <Text className="text-lg font-bold text-zinc-200">
                          {item.opening_time} - {item.closing_time}
                        </Text>
                      </View>
                    )}
                  />
                </View>
              </View>

              {/* Services */}
              <View className="bg-black ">
                <Text className="text-zinc-400 px-1 font-bold mb-2 mt-2">
                  Services
                </Text>
                <View className="bg-zinc-900 p-2 rounded-lg">
                  <FlatList
                    data={barbershop.services}
                    keyExtractor={(item) => item.service_name}
                    renderItem={({ item }) => (
                      <View className="flex-row justify-between p-2">
                        <Text className="text-lg text-zinc-200">
                          {item.service_name}
                        </Text>
                        <Text className="text-lg font-bold text-zinc-200">
                          ${parseFloat(item.price).toFixed(2)}
                        </Text>
                      </View>
                    )}
                  />
                </View>
              </View>

              {/* Social Media */}
              <View className="bg-black ">
                <Text className="text-zinc-400 px-1 font-bold mb-2 mt-2">
                  Social Media
                </Text>
                <View className="flex flex-row bg-zinc-900 p-2 rounded-lg">
                  {barbershop.social_media.map((item) => (
                    <View key={item.platform_name} className="space-x-2 p-2">
                      <FontAwesome5
                        name={item.platform_name.toLowerCase()}
                        size={24}
                        color="#e4e4e7"
                        onPress={() => Linking.openURL(item.platform_url)}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        }
        ListFooterComponent={
          <View className="flex-1 bg-black p-2 ">
            <Text className=" text-zinc-400 px-1 font-bold mb-2">
              User Reviews
            </Text>
            <View className="bg-zinc-900 p-3 rounded-lg mb-5">
              <FlatList
                data={reviews}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View className="bg-zinc-900  flex flex-col mb-4">
                    <View className="flex-row items-center justify-between">
                      <Image
                        source={{ uri: item.profile_image }}
                        alt="user profile"
                        className="w-10 h-10 rounded-md"
                      />
                      <Text className="text-zinc-200 ml-2">{item.name}</Text>
                      <Text className="text-zinc-400 ml-2">{item.date}</Text>
                    </View>
                    <View className="flex-row mt-2">
                      <Rating
                        type="star"
                        ratingCount={5}
                        imageSize={20}
                        readonly
                        startingValue={item.rating}
                        tintColor="#18181b"
                      />
                    </View>
                    <Text className="text-zinc-200 mt-2">{item.comment}</Text>
                  </View>
                )}
              />
            </View>
          </View>
        }
      />
      <TouchableOpacity
        className="absolute bottom-0 right-0 left-0 bg-opacity-100 bg-zinc-200 p-3 mx-2 rounded-lg"
        onPress={() => console.log("Book Now")}
      >
        <Text className="text-zinc-900 font-bold text-center">Book Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
