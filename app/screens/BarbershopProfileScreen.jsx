import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Linking,
  RefreshControl,
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
    } else {
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
    <SafeAreaView className="flex-1 bg-zinc-200">
      {/* Back Button and Header */}
      <View className="flex-row items-center p-2 bg-white border border-solid border-black">
        <Ionicons
          name="arrow-back"
          size={24}
          color="#030712"
          onPress={() => navigation.goBack()}
        />
        <Text className="text-zinc-900 text-xl font-bold ml-2">Back</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }
      >
        {/* Barbershop Information */}
        <View className="bg-zinc-100 shadow-md mb-2">
          <View className="flex-row items-center bg-black p-4 mb-2">
            <Image
              source={{
                uri: `http://10.10.102.48:8085${barbershop.barbershop_profile_picture_id.path}`,
              }}
              style={{ width: 90, height: 90 }}
              className="rounded-lg border-4 border-white"
            />
            <View className="ml-4 flex-1">
              <Text className="text-zinc-100 text-lg font-semibold">
                {toTitleCase(barbershop.name)}
                <MaterialIcons name="verified" size={18} color="white" />
              </Text>
              <Text className="text-zinc-100 text-justify">{barbershop.address}</Text>
              <Text className="text-zinc-100 text-justify">{barbershop.street_address}</Text>
              <Text className="text-zinc-100 mt-1">
                {`${barbershop.city}, ${barbershop.state_province_region}, ${barbershop.postal_zip_code}, ${barbershop.country}`}
              </Text>
            </View>
          </View>

          {/* Location and Description */}
          <TouchableOpacity
            className="flex-row items-center justify-center p-4 bg-white mt-2 mb-3 border border-zinc-950"
            onPress={() =>
              navigation.navigate("Maps", {
                latitude: barbershop.latitude,
                longitude: barbershop.longitude,
                markerTitle: barbershop.name,
              })
            }
          >
            <Ionicons name="location-outline" size={20} color="black" />
            <Text className="text-zinc-900 text-lg font-bold ml-2 ">
              View Location
            </Text>
          </TouchableOpacity>
          <View className="bg-white p-4 rounded-lg shadow-md mb-2">
            <Text className="text-zinc-600 font-bold mb-3">Description</Text>
            <Text className="text-zinc-900 mt-1 text-justify">
              {toTitleCase(barbershop.description)}
            </Text>
          </View>

          {/* Gallery */}
          <View className="bg-white p-4 rounded-lg shadow-md mb-4">
            <Text className="text-zinc-600 font-bold mb-3">Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {dummyImage.map((image) => (
                <Image
                  key={image.id}
                  source={{ uri: image.imageURL }}
                  style={{ width: 240, height: 160 }}
                  className="rounded-lg m-2 border border-zinc-300"
                />
              ))}
            </ScrollView>
          </View>

          {/* Operational Hours */}
          <View className="bg-white p-4 rounded-lg shadow-md mb-4">
            <Text className="text-zinc-600 font-bold mb-3">
              Operational Hours
            </Text>
            <ScrollView>
              {barbershop.operational_hours.map((item) => (
                <View
                  key={item.day}
                  className="flex-row justify-between p-2 border-b border-zinc-300"
                >
                  <Text className="text-lg text-zinc-800">
                    {toTitleCase(item.day)}
                  </Text>
                  <Text className="text-lg font-bold text-zinc-800">
                    {`${item.opening_time.substring(
                      0,
                      2
                    )}:${item.opening_time.substring(
                      3,
                      5
                    )} - ${item.closing_time.substring(
                      0,
                      2
                    )}:${item.closing_time.substring(3, 5)}`}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Services */}
          <View className="bg-white p-4 rounded-lg shadow-md mb-4">
            <Text className="text-zinc-600 font-bold mb-3">Services</Text>
            <ScrollView>
              {barbershop.services.map((item) => (
                <View
                  key={item.service_name}
                  className="flex-row justify-between p-2 border-b border-zinc-300"
                >
                  <Text className="text-lg text-zinc-800">
                    {toTitleCase(item.service_name)}
                  </Text>
                  <Text className="text-lg font-bold text-zinc-800">
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

          {/* Social Media */}
          <View className="bg-white p-4 rounded-lg shadow-md mb-4">
            <Text className="text-zinc-600 font-bold mb-3">Social Media</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {barbershop.social_media.map((item) => (
                <View key={item.platform_name} className="p-2">
                  <FontAwesome5
                    name={item.platform_name.toLowerCase()}
                    size={24}
                    color="black"
                    onPress={() => Linking.openURL(item.platform_url)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Reviews */}
          <View className="bg-white p-4 rounded-lg shadow-md mb-9">
            <Text className="text-zinc-600 font-bold mb-3">Reviews</Text>
            <View className="bg-zinc-100 p-2 rounded-lg">
              {reviews.map((item) => (
                <View
                  key={item.id}
                  className="bg-white p-4 mb-4 border border-zinc-300 rounded-lg shadow-sm"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <Image
                      source={{ uri: item.profile_image }}
                      style={{ width: 40, height: 40 }}
                      className="rounded-md"
                    />
                    <View className="ml-2 flex-1">
                      <Text className="text-zinc-800 font-medium">
                        {item.name}
                      </Text>
                      <Text className="text-zinc-500 text-sm">{item.date}</Text>
                    </View>
                    <Rating
                      type="star"
                      ratingCount={5}
                      imageSize={20}
                      readonly
                      startingValue={item.rating}
                      tintColor="#f9f9f9"
                    />
                  </View>
                  <Text className="text-zinc-800 mt-2">{item.comment}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Booking Button */}
      <TouchableOpacity
        className="absolute bottom-0 left-0 right-0 bg-zinc-100 p-4 border border-zinc-950"
        onPress={handleBookNow}
      >
        <Text className="text-zinc-900 font-bold text-center text-lg">
          Book Now
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
