import { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

const services = [
  {
    id: 1,
    name: "Haircuts",
    price: 20000,
  },
  {
    id: 2,
    name: "Shaving",
    price: 15000,
  },
  {
    id: 3,
    name: "Beard Shaping",
    price: 25000,
  },
  {
    id: 4,
    name: "Beard Trim",
    price: 15000,
  },
];

export default function AppointmentScreen({ navigation }) {
  const [isSelected, setIsSelected] = useState({});
  const [totalPayment, setTotalPayment] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const handleCheckbox = (name, price) => {
    setIsSelected((prevState) => {
      const updatedSelection = {
        ...prevState,
        [name]: !prevState[name],
      };

      const isSelectedNow = !prevState[name];
      setTotalPayment((prevTotal) => prevTotal + (isSelectedNow ? price : -price));

      return updatedSelection;
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setIsSelected({});
    setTotalPayment(0);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000); // Simulasi waktu refresh, bisa diganti dengan logika yang dibutuhkan
  };

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="bg-black">
          <ImageBackground
            source={{
              uri: "https://d1otfi4uhdq3fm.cloudfront.net/wp-content/uploads/2019/05/29102842/truefitt.jpg",
            }}
            className="w-80 h-40 mx-auto my-4"
            imageStyle={{ opacity: 0.5, borderRadius: 10 }}
          >
            <View className="flex-row absolute bottom-0 left-0 right-0 p-2">
              <Image
                source={{
                  uri: "http://ts1.mm.bing.net/th?id=OIP._3uoI_sVXo-qIxyVQR4X2gAAAA&pid=15.1",
                }}
                className="w-16 h-16 rounded-md"
                style={{ resizeMode: "cover", opacity: 0.8 }}
              />
              <View className="flex-col justify-center gap-1 ml-2">
                <Text className="text-zinc-300 font-bold ">
                  Baylee The Barber
                </Text>
                <Text className="text-zinc-400 text-sm">09.00 - 20.00</Text>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View className="bg-black p-3">
          <Text className="text-zinc-400 font-bold p-2">Service</Text>
          <View className="bg-zinc-800 rounded-lg py-2">
            {services.map((service) => (
              <View
                key={service.id}
                className="flex-row justify-between items-center border-b border-zinc-600 p-1"
              >
                <CheckBox
                  checked={isSelected[service.name]}
                  onPress={() => handleCheckbox(service.name, service.price)}
                />
                <Text className="text-zinc-300">{service.name}</Text>
                <Text className="text-zinc-300">Rp. {service.price.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className="bg-black p-3">
          <Text className="text-zinc-400 font-bold p-2">Payment</Text>
          <View className="bg-zinc-800 rounded-lg">
            <View className="flex-row justify-between items-center p-3">
              <View className="flex-col gap-2">
                <Text className="text-zinc-300">Total Payment</Text>
                <Text className="text-zinc-300">Rp. {totalPayment.toLocaleString()}</Text>
              </View>
              <TouchableOpacity
                className="bg-zinc-200 p-2 mx-4 rounded-lg"
                onPress={() => navigation.navigate("Payment")}
              >
                <Text className="text-zinc-900 font-bold">Payment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
