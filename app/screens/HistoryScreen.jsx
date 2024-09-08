import { useEffect, useState, useMemo } from "react";
import {
  ScrollView,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../service/axios";
import { setListBookingUser } from "../store/listBookingUser";
import moment from "moment";
import { TouchableOpacity } from "react-native";

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
  console.log(listBooking);
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data bookings from API
  const fetchDataBooking = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDataBooking();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDataBooking();
    // Optional: Set interval to auto-refresh and update status every 5 minutes
    const intervalId = setInterval(() => {
      fetchDataBooking();
    }, 300000); // 300,000 ms = 5 minutes

    return () => clearInterval(intervalId); // Clear the interval on component unmount
  }, []);

  const handleViewDetail = (bookingId) => {
    navigation.navigate("DetailsBooking", { bookingId });
  };

  const filterBookings = (status) => {
    setSelectedStatus(status);
  };

  // Memoize the filtered bookings to avoid unnecessary recalculations
  const filteredBookings = useMemo(
    () =>
      selectedStatus === "All"
        ? listBooking
        : listBooking.filter(
            (booking) => toTitleCase(booking.status) === selectedStatus
          ),
    [listBooking, selectedStatus]
  );

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-zinc-900">
        <View className="bg-zinc-800 p-4 rounded-lg mb-4">
          <Text className="text-zinc-200 font-bold text-xl">History</Text>
          <View className="border-b border-zinc-600 my-2"></View>

          {/* Filter Status */}
          <View className="flex-row justify-around mb-4">
            <TouchableOpacity
              style={{ borderRadius: 8, width: 50, height: 40 }}
              className={`items-center justify-center bg-zinc-700 ${
                selectedStatus === "All" ? "bg-zinc-600" : ""
              }`}
              onPress={() => filterBookings("All")}
            >
              <Text className="text-zinc-200">All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ borderRadius: 8, width: 60, height: 40 }}
              className={`items-center justify-center bg-zinc-700 ${
                selectedStatus === "Pending" ? "bg-zinc-600" : ""
              }`}
              onPress={() => filterBookings("Pending")}
            >
              <Text className="text-zinc-200">Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ borderRadius: 8, width: 75, height: 40 }}
              className={`items-center justify-center bg-zinc-700 ${
                selectedStatus === "Settlement" ? "bg-zinc-600" : ""
              }`}
              onPress={() => filterBookings("Settlement")}
            >
              <Text className="text-zinc-200">Settlement</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ borderRadius: 8, width: 75, height: 40 }}
              className={`items-center justify-center bg-zinc-700 ${
                selectedStatus === "Completed" ? "bg-zinc-600" : ""
              }`}
              onPress={() => filterBookings("Completed")}
            >
              <Text className="text-zinc-200">Completed</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          className="p-4"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          ) : (
            <>
              {/* List Booking */}
              <View className="space-y-4">
                {filteredBookings && filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <View
                      key={booking.booking_id}
                      className="bg-zinc-700 p-4 rounded-lg space-y-2"
                    >
                      <Text className="text-zinc-200 text-lg font-bold">
                        {booking.barber.name}
                      </Text>
                      <Text className="text-zinc-400 text-sm">
                        Booking ID: {booking.booking_id}
                      </Text>
                      <Text className="text-zinc-400 text-sm">
                        Date:{" "}
                        {moment(booking.bookingDate).format(
                          "MMMM Do YYYY, HH:mm"
                        )}
                      </Text>

                      <View className="space-y-1">
                        {booking.services.map((service) => (
                          <View
                            key={service.service_id}
                            className="flex-row justify-between items-center"
                          >
                            <Text className="text-zinc-200 text-sm">
                              {service.service_name}
                            </Text>
                            <Text className="text-zinc-200 text-sm">
                              Rp{service.price.toLocaleString("id-ID")}
                            </Text>
                          </View>
                        ))}
                      </View>

                      <Text className="text-zinc-400 text-sm">
                        Status Booking: {toTitleCase(booking.status)}
                      </Text>

                      <View className="flex-row justify-between mt-2">
                        <TouchableOpacity
                          onPress={() => handleViewDetail(booking.booking_id)}
                          className="bg-zinc-200 p-2 rounded-lg"
                        >
                          <Text className="text-zinc-900 text-center font-semibold">
                            View Detail
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text className="text-zinc-200 text-center">
                    No bookings available
                  </Text>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;
