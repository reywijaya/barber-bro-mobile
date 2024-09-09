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
    <SafeAreaView className="flex flex-col p-8">
      <View className="flex-row items-center justify-between">
        <Ionicons
          name="arrow-back"
          size={24}
          color="#030712"
          onPress={() => navigation.goBack()}
        />
        <View className="flex-row items-center gap-x-1">
          <Text className="text-lg font-bold">
            {toTitleCase(barbershop.name)}
          </Text>
          <MaterialIcons name="verified" size={18} color="black" />
        </View>
        <Feather name="more-horizontal" size={24} color="#030712" />
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }
      >
        <View>
          <View className="items-center w-full p-2 my-4">
            <Image
              source={{
                uri: `http://10.10.102.48:8085${barbershop.barbershop_profile_picture_id.path}`,
              }}
              style={{ width: 200, height: 200, borderRadius: 100 }}
            />
          </View>

          {/* Location and Description */}
          <TouchableOpacity
            className="justify-center px-2 rounded-3xl my-2 gap-y-2 border-2 border-zinc-200"
            onPress={() =>
              navigation.navigate("Maps", {
                latitude: barbershop.latitude,
                longitude: barbershop.longitude,
                markerTitle: barbershop.name,
              })
            }
          >
            <Text className="font-extrabold bg-zinc-200 p-2 rounded-3xl text-center">Address</Text>
            <Text className="p-2 text-center">
              {`${barbershop.street_address}, ${barbershop.city}, ${barbershop.state_province_region}, ${barbershop.postal_zip_code}, ${barbershop.country}`}
            </Text>
            <View className="flex-row items-center py-2 justify-center">
              <Ionicons name="location-outline" size={14} color="black" />
              <Text className="font-bold">
                View Location
              </Text>
            </View>
          </TouchableOpacity>

          <View className="justify-center p-2 rounded-3xl my-2 border-2 border-zinc-200">
            <Text className="font-extrabold bg-zinc-200 p-2 rounded-3xl text-center">Description</Text>
            <Text className="text-center py-2">
              {toTitleCase(barbershop.description)}
            </Text>
          </View>

          {/* Gallery */}
          <View className="border-2 border-zinc-200 rounded-3xl my-2 p-2">
            <Text className="font-extrabold bg-zinc-200 p-2 rounded-3xl text-center">Gallery</Text>
            <ScrollView className="mt-4" horizontal showsHorizontalScrollIndicator={false}>
              {dummyImage.map((image) => (
                <Image
                  key={image.id}
                  source={{ uri: image.imageURL }}
                  style={{ width: 240, height: 160 }}
                  className="rounded-3xl mr-2"
                />
              ))}
            </ScrollView>
          </View>

          {/* Operational Hours */}
          <View className="border-2 border-zinc-200 rounded-3xl my-2 p-2">
            <Text className="font-extrabold bg-zinc-200 p-2 rounded-3xl text-center">
              Operational Hours
            </Text>
            <ScrollView>
              {barbershop.operational_hours.map((item) => (
                <View
                  key={item.day}
                  className="flex-row items-center justify-between p-2"
                >
                  <Text className="px-2 text-lg">
                    {toTitleCase(item.day)}
                  </Text>
                  <Text className="px-2 text-lg font-bold">
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
          <View className="border-2 border-zinc-200 rounded-3xl my-2 p-2">
            <Text className="font-extrabold bg-zinc-200 p-2 rounded-3xl text-center">Services</Text>
            <ScrollView>
              {barbershop.services.map((item) => (
                <View
                  key={item.service_name}
                  className="flex-row items-center justify-between p-2"
                >
                  <Text className="text-lg px-2">
                    {toTitleCase(item.service_name)}
                  </Text>
                  <Text className="text-lg font-bold px-2">
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
          <View className="border-2 border-zinc-200 rounded-3xl my-2 p-2">
            <Text className="font-extrabold bg-zinc-200 p-2 rounded-3xl text-center">Social Media</Text>
            <View className="flex-row items-center justify-center mt-2">
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
            </View>
          </View>

          {/* Reviews */}
          <View className="border-2 border-zinc-200 rounded-3xl my-2 p-2">
            <Text className="font-extrabold bg-zinc-200 p-2 rounded-3xl text-center">Reviews</Text>
            <View className="mt-2">
              {reviews.map((item) => (
                <View
                  key={item.id}
                  className="border-2 border-zinc-200 rounded-3xl my-2 p-4"
                >
                  <View className="flex-row items-center justify-between">
                    <Image
                      source={{ uri: item.profile_image }}
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
                    <View className="ml-2 flex-1">
                      <Text className="text-zinc-800 font-medium">
                        {item.name}
                      </Text>
                      <Text className="text-zinc-500 text-sm">{item.date}</Text>
                    </View>
                    <Rating
                      tintColor="white"
                      type="star"
                      imageSize={14}
                      startingValue={item.rating}
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
        className="absolute bottom-0 left-0 right-0 bg-zinc-800 m-8 py-3 rounded-full"
        onPress={handleBookNow}
      >
        <Text className="text-zinc-200 font-bold text-center text-lg">
          Book Now
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
