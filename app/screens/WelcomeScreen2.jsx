import {Image, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {FontAwesome5} from "@expo/vector-icons";

export default function WelcomeScreen2({navigation}) {
    return (
        <SafeAreaView>
            <View className="min-h-screen min-w-screen flex items-center justify-around p-10">
                <View>
                    <Text className="font-bold text-4xl text-center">Barber Bro comes with Solutions!</Text>
                    <Text className="text-md text-center">We provide personalized Barbershop Recommendation near
                        you</Text>
                </View>
                <View>
                    <Image
                        source={require('../../assets/welcome-2.png')}
                        style={{width: 300, height: 300}}
                    />
                </View>
                <View>
                    <TouchableOpacity
                        className="rounded-full bg-zinc-800 py-3 px-24 flex-row gap-x-2"
                        onPress={() => navigation.navigate("Welcome3")}
                    >
                        <Text className="text-zinc-200 font-bold">Continue</Text>
                        <FontAwesome5 name="arrow-circle-right" size={20} color="#e4e4e7" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}