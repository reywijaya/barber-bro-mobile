import {Image, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function WelcomeScreen3({navigation}) {
    return (
        <SafeAreaView>
            <View className="min-h-screen min-w-screen flex items-center justify-around p-10">
                <View>
                    <Text className="font-bold text-4xl text-center">Book Your Appointment!</Text>
                    <Text className="text-md text-center">Make an appointment right away, as easy as snapping your
                        fingers</Text>
                </View>
                <View>
                    <Image
                        source={require('../../assets/welcome-3.png')}
                        style={{width: 300, height: 300}}
                    />
                </View>
                <View className="flex flex-col w-full gap-y-4">
                    <TouchableOpacity
                        className="rounded-full bg-zinc-800 h-12 py-3"
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text className="text-zinc-200 font-bold text-center">Log in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="rounded-full border-2 border-zinc-800 h-12 py-3"
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text className="font-bold text-center">Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}