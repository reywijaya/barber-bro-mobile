import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
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
import { useSelector } from "react-redux";

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

const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
};

export default function BarbershopProfileScreen({ route, navigation }) {
  const { id } = route.params;
  const [barbershop, setBarbershop] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const dataProfile = useSelector((state) => state.profileData.profileData);
  console.log("Data: ", dataProfile);
  // console.log("Data: ", barbershop.id);

  const fetchData = async () => {
    try {
      const barbershopData = await getBarbershopById(id);
      setBarbershop(barbershopData);
      const reviewsData = await getReviews();
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
  const handleBookNow = () => {
    if (!dataProfile.firstName || !dataProfile.surname) {
      alert("Please update your profile to book an appointment.");
    }else{
      navigation.navigate("Appointment", { barbershop });
    }
      
    
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-zinc-900">
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="flex-1"
        refreshing={refresh}
        onRefresh={handleRefresh}
      >
        <View>
          {/* Back Button and Header */}
          <View className="flex-row bg-zinc-900 p-2 items-center gap-3">
            <Ionicons
              name="arrow-back"
              size={20}
              color="#e4e4e7"
              onPress={() => navigation.goBack()}
            />
            <Text className="text-zinc-200 text-xl">Back</Text>
          </View>

          <View className="flex flex-col bg-black p-2">
            {/* Barbershop Information */}
            <View className="flex-col items-center rounded-lg p-2 bg-zinc-900 my-2">
              <Image
                source={{
                  uri:
                    "http://10.10.102.48:8080" +
                    barbershop.barbershop_profile_picture_id.path,
                }}
                style={{ width: 90, height: 90 }}
                className="rounded-lg"
              />
              <View className="mt-2 items-center">
                <View className="flex-row items-center gap-x-2">
                  <Text className="text-zinc-200 font-bold text-lg">
                    {toTitleCase(barbershop.name)}
                  </Text>
                  <MaterialIcons name="verified" size={16} color="white" />
                </View>
                <View className="flex-col items-center gap-y-1">
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
            </View>

            {/* Location and Description */}
            <TouchableOpacity
              className="flex-row justify-center items-center rounded-lg p-2 bg-zinc-900"
              onPress={() =>
                navigation.navigate("Maps", {
                  latitude: barbershop.latitude,
                  longitude: barbershop.longitude,
                  markerTitle: barbershop.name,
                })
              }
            >
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
                  {toTitleCase(barbershop.description)}
                </Text>
              </View>
            </View>

            {/* Gallery */}
            <View className="bg-black">
              <Text className="text-zinc-400 px-1 font-bold mb-2 mt-2">
                Gallery
              </Text>
              <View className="bg-zinc-900 p-2 rounded-lg">
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {dummyImage.map((image) => (
                    <Image
                      key={image.id}
                      source={{ uri: image.imageURL }}
                      className="h-40 w-60 rounded-lg m-2"
                    />
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Operational Hours */}
            <View className="bg-black">
              <Text className="text-zinc-400 px-1 font-bold mb-2 mt-2">
                Operational Hours
              </Text>
              <View className="bg-zinc-900 p-2 rounded-lg">
                <ScrollView>
                  {barbershop.operational_hours.map((item) => (
                    <View
                      key={item.day}
                      className="flex-row justify-between p-2"
                    >
                      <Text className="text-lg text-zinc-200">
                        {toTitleCase(item.day)}
                      </Text>
                      <Text className="text-lg font-bold text-zinc-200">
                        {`${item.opening_time.substring(
                          0,
                          2
                        )}.${item.opening_time.substring(
                          3,
                          5
                        )} - ${item.closing_time.substring(
                          0,
                          2
                        )}.${item.closing_time.substring(3, 5)}`}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Services */}
            <View className="bg-black">
              <Text className="text-zinc-400 px-1 font-bold mb-2 mt-2">
                Services
              </Text>
              <View className="bg-zinc-900 p-2 rounded-lg">
                <ScrollView>
                  {barbershop.services.map((item) => (
                    <View
                      key={item.service_name}
                      className="flex-row justify-between p-2"
                    >
                      <Text className="text-lg text-zinc-200">
                        {toTitleCase(item.service_name)}
                      </Text>
                      <Text className="text-lg font-bold text-zinc-200">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 2,
                        }).format(item.price)}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Social Media */}
            <View className="bg-black">
              <Text className="text-zinc-400 px-1 font-bold mb-2 mt-2">
                Social Media
              </Text>
              <View className="flex flex-row bg-zinc-900 p-2 rounded-lg">
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
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
                </ScrollView>
              </View>
            </View>

            {/* User Reviews */}
            <View className="bg-black min-h-screen">
              <Text className="text-zinc-400 px-1 font-bold mb-2">
                User Reviews
              </Text>
              <View className="bg-zinc-900 p-2 rounded-lg">
                <ScrollView>
                  {reviews.map((item) => (
                    <View
                      key={item.id}
                      className="bg-zinc-900  flex flex-col mb-4"
                    >
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
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-0 right-0 left-0 bg-opacity-100 bg-zinc-200 p-3 mx-2 rounded-lg"
        onPress={handleBookNow}
      >
        <Text className="text-zinc-900 font-bold text-center">Book Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
