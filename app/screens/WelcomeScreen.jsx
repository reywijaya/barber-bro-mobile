import {Image, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import WelcomeScreen2 from "./WelcomeScreen2";

export default function WelcomeScreen({navigation}) {

    return (
        <SafeAreaView>
            <View className="min-h-screen min-w-screen flex items-center justify-around p-10">
                <View>
                    <Text className="font-bold text-4xl text-center">Have you ever feel confused?</Text>
                    <Text className="text-md text-center">Didn't know where to find the perfect cut for yourself?</Text>
                </View>
                <View>
                    <Image
                        source={require('../../assets/welcome-1.png')}
                        style={{width: 300, height: 300}}
                    />
                </View>
                <View>
                    <TouchableOpacity
                        className="rounded-full bg-zinc-800 py-3 px-20"
                        onPress={() => navigation.navigate("Welcome2")}
                    >
                        <Text className="text-zinc-200 font-bold">Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}