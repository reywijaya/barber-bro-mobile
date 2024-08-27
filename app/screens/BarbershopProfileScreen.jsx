import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Feather, Fontisto, MaterialIcons} from "@expo/vector-icons";

const dummyImage = [
    {
        id: 1,
        imageURL: "https://assets-global.website-files.com/644a9d9ce529ef8812f82a28/647fb85c69e95444243ef9bd_Henley%27s%20Gentlemen%27s%20Grooming%20-%20Barbershop%20and%20Mens%20Grooming.webp"
    },
    {
        id: 2,
        imageURL: "https://awsimages.detik.net.id/community/media/visual/2024/03/06/captain-barbershop-1_169.jpeg?w=1200"
    },
    {
        id: 3,
        imageURL: "https://malangraya.media/wp-content/uploads/2023/07/Barbershop-di-Malang.jpg"
    },
    {
        id: 4,
        imageURL: "https://insights.ibx.com/wp-content/uploads/2023/06/kym-barbershop.jpg"
    },
    {
        id: 5,
        imageURL: "https://frisorbarbershop.com/images/b-promo/world/1promo.jpg"
    }
]

const services = [
    {
        id: 1,
        name: "Hair Cut",
        price: "70K"
    },
    {
        id: 2,
        name: "Hair Coloring",
        price: "350K"
    },
    {
        id: 3,
        name: "Shaving",
        price: "30K"
    },
    {
        id: 4,
        name: "Hair Perming",
        price: "200K"
    },
    {
        id: 5,
        name: "Smoothing",
        price: "70K"
    }
]

export default function BarbershopProfileScreen() {
    return (
        <SafeAreaView>
            <ScrollView>
                <View className="flex flex-col bg-black py-4 px-2">
                    <TouchableOpacity className="flex-row bg-zinc-900 items-center rounded-lg p-2">
                        <View className="px-2">
                            <Feather name="arrow-left" size={20} color="#e4e4e7"/>
                        </View>
                        <View className="px-2">
                            <Text className="text-zinc-200 text-xl">Back</Text>
                        </View>
                    </TouchableOpacity>
                    <View className="flex-col items-center rounded-lg p-2 bg-zinc-900 my-2">
                        <View>
                            <Image
                                source={require("../../assets/logo-gold.png")}
                                style={{width: 90, height: 90}}
                                className="rounded-lg"/>
                        </View>
                        <View className="mt-2 items-center">
                            <View className='flex-row items-center gap-x-2'>
                                <Text className="text-zinc-200 font-bold text-lg">Gentlemen's Hair</Text>
                                <MaterialIcons name='verified' size={16} color='white'/>
                            </View>
                            <Text className="text-zinc-400">Open everyday</Text>
                        </View>
                    </View>
                    <TouchableOpacity className="flex-row justify-center items-center rounded-lg p-2 bg-zinc-900">
                        <View className="px-2">
                            <Fontisto name='map-marker-alt' size={16} color="#e4e4e7"/>
                        </View>
                        <Text className="text-zinc-200">View Location</Text>
                    </TouchableOpacity>
                    <View className="flex-row mt-2 justify-around items-center rounded-lg p-2 bg-zinc-900">
                        <View className="items-center">
                            <Text className="text-zinc-200 font-bold text-xl">297</Text>
                            <Text className="text-zinc-400">Total Customers</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-zinc-200 font-bold text-xl">August 2024</Text>
                            <Text className="text-zinc-400">Partner Since</Text>
                        </View>
                    </View>
                    <Text className="text-zinc-400 p-2">Gallery</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {dummyImage.map((image) => {
                            return (
                                <Image
                                    key={image.id}
                                    source={{uri: image.imageURL}}
                                    className="h-40 w-60 rounded-lg m-2"/>
                            )
                        })}
                    </ScrollView>
                    <Text className="text-zinc-400 p-2">List of Services</Text>
                    {services.map((service) => {
                        return (
                            <View
                                key={service.id}
                                className='p-3 mx-2 bg-zinc-900 flex-row justify-between'>
                                <Text className='text-lg text-zinc-200'>{service.name}</Text>
                                <Text className='text-lg font-bold text-zinc-200'>{service.price}</Text>
                            </View>
                        )
                    })}
                    <TouchableOpacity className='rounded-lg items-center m-2 p-2 bg-zinc-200'>
                        <Text className="font-bold text-lg">BOOK NOW</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}