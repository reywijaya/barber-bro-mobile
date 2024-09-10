import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View, RefreshControl, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../service/axios";
import { setListBookingUser } from "../store/listBookingUser";
import moment from "moment";
import { TouchableOpacity } from "react-native";
import { Entypo, Fontisto, MaterialIcons } from "@expo/vector-icons";

const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
};

const HistoryScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user.loggedInUser);
  const listBooking = useSelector(
    (state) => state.listBookingUser.listBookingUser
  );
  // console.log(listBooking);
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Pending");

  // Fetch data bookings from API
  const fetchDataBooking = async () => {
    setRefreshing(true);
    try {
      const response = await axiosInstance.get("/bookings/current", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      dispatch(setListBookingUser(response.data.data));
    } catch (error) {
      console.log("Failed to fetch bookings:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDataBooking();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDataBooking();
  }, []);

  const handleViewDetail = (bookingId) => {
    navigation.navigate("DetailsBooking", { bookingId });
  };

  const filterBookings = (status) => {
    setSelectedStatus(status);
  };
  // console.log(selectedStatus)
  // console.log(listBooking)
  const filteredBookings = useMemo(() => {
    return listBooking.filter((booking) => booking.status === selectedStatus);
  }, [selectedStatus, listBooking]);

  console.log(filteredBookings)
  const colorStatus = (status) => {
    switch (status) {
      case "Pending":
        return "text-amber-800 bg-amber-200";
      case "Completed":
        return "text-cyan-800 bg-cyan-200";
      case "Settlement":
        return "text-green-900 bg-green-300";
      default:
        return "text-zinc-900 bg-zinc-300";
    }
  };
  const formatedDate = (date) => {
    return moment(date).format("DD MMM YYYY");
  };
  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="min-h-screen min-w-screen flex flex-col p-8">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-2xl font-bold">Your</Text>
              <Text className="text-lg">appointment list</Text>
            </View>
            <View className="flex-row items-center gap-x-2">
              <Entypo name="bookmarks" size={34} color="black" />
            </View>
          </View>

          <View className="flex-row mt-8 mb-6 bg-zinc-200 rounded-full p-2 justify-between items-center">
            <TouchableOpacity
              className={`rounded-full flex-1 py-2 items-center ${
                selectedStatus === "Pending"
                  ? "bg-zinc-300 border-2 border-zinc-300"
                  : ""
              }`}
              onPress={() => filterBookings("Pending")}
            >
              <Text className="text-zinc-900 font-bold">Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`rounded-full flex-1 py-2 items-center ${
                selectedStatus === "Settlement"
                  ? "bg-zinc-300 border-2 border-zinc-300"
                  : ""
              }`}
              onPress={() => filterBookings("Settlement")}
            >
              <Text className="text-zinc-900 font-bold">Settlement</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`rounded-full flex-1 py-2 items-center ${
                selectedStatus === "Completed"
                  ? "bg-zinc-300 border-2 border-zinc-300"
                  : ""
              }`}
              onPress={() => filterBookings("Completed")}
            >
              <Text className="text-zinc-900 font-bold">Completed</Text>
            </TouchableOpacity>
          </View>

          {filteredBookings && filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <TouchableOpacity
                onPress={() => handleViewDetail(booking.booking_id)}
              >
                <View
                  key={booking.booking_id}
                  className="flex flex-col my-4 border-2 border-zinc-200 gap-y-2 rounded-3xl"
                >
                  <View className="flex-row items-center justify-between px-4">
                    <Text className="text-zinc-900 text-lg font-bold">
                      {booking.barber.name}
                    </Text>
                    <Fontisto name="bookmark-alt" size={20} color={"black"} />
                  </View>

                  <View className="rounded-3xl bg-zinc-200 gap-y-1 p-4">
                    <View className="flex-row items-center justify-center rounded-full bg-zinc-300 py-1 w-1/3">
                      <MaterialIcons
                        name="access-time"
                        size={13}
                        color={"black"}
                      />
                      <Text className="ml-1 text-xs">Booking Date</Text>
                    </View>
                    <Text className="text-zinc-900 text-sm">
                      {formatedDate(booking.booking_date)} {booking.booking_time}
                    </Text>

                    {booking.services.map((service) => (
                      <View key={service.service_id}>
                        <Text className="text-zinc-900 text-sm font-semibold">
                          {service.service_name} Rp.{" "}
                          {service.price.toLocaleString("id-ID")}
                        </Text>
                      </View>
                    ))}

                    <Text
                      className={`${colorStatus(
                        toTitleCase(booking.status)
                      )} font-bold rounded-full py-1 text-center w-1/2`}
                    >
                      {toTitleCase(booking.status)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="flex-col items-center">
              <Image
                source={require("../../assets/lazy.png")}
                style={{ width: 200, height: 200 }}
              />
              <Text className="text-zinc-900 text-lg font-bold text-center">
                No bookings are available
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;
