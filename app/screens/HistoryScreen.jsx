import { useEffect, useState } from "react";
import { ScrollView, Text, View, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../service/axios";
import { setListBookingUser } from "../store/listBookingUser";
import moment from "moment";

const HistoryScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user.loggedInUser);
  const listBooking = useSelector(
    (state) => state.listBookingUser.listBookingUser
  );
  const dispatch = useDispatch();
  
  const [refreshing, setRefreshing] = useState(false);

  const fetchDataBooking = async () => {
    try {
      const response = await axiosInstance.get("/bookings/current", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      dispatch(setListBookingUser(response.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDataBooking(); // Memuat ulang data
    setRefreshing(false); // Menonaktifkan indikator refresh
  };

  useEffect(() => {
    fetchDataBooking();
  }, []);

  const handleViewDetail = (bookingId) => {
    // Arahkan ke halaman detail dengan parameter bookingId
    navigation.navigate("DetailsBooking", { bookingId });
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-zinc-900">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          className="p-4"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header */}
          <View className="bg-zinc-800 p-4 rounded-lg mb-4">
            <Text className="text-zinc-200 font-bold text-xl">History</Text>
            <View className="border-b border-zinc-600 my-2"></View>
          </View>

          {/* List Booking */}
          <View className="space-y-4">
            {listBooking && listBooking.length > 0 ? (
              listBooking.map((booking) => (
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
                    Date: {moment(booking.bookingDate).format("MMMM Do YYYY, HH:mm")}
                  </Text>

                  {/* Layanan yang Dipesan */}
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
                    Status: {booking.status}
                  </Text>

                  {/* Button View Detail */}
                  <TouchableOpacity
                    onPress={() => handleViewDetail(booking.booking_id)}
                    className="bg-zinc-200 p-2 mt-2 rounded-lg"
                  >
                    <Text className="text-zinc-900 text-center font-semibold">
                      View Detail
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text className="text-zinc-200 text-center">
                No bookings available
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;
