import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Feather, Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import React from "react";

export default function ProfileScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.loggedInUser.loggedInUser.data);
    console.log("user : ", user);

    const handleLogout = async () => {
        await AsyncStorage.removeItem("loggedInUser");
        dispatch({type: "LOGOUT"});
        navigation.navigate("Login");
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <View className="flex flex-col bg-black p-4">
                    <View className="flex-row gap-6 py-4">
                        <Image
                            source={{uri: "https://cdn1-production-images-kly.akamaized.net/EkW4GPoCyNohCcl37diQznJqpJk=/1200x1200/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/4243489/original/075739700_1669706866-unknown_278188195_2911935799106242_7342000182256547621_n.jpg"}}
                            className="w-20 h-20 rounded-full"
                        />
                        <View>
                            <Text className="text-gray-200 font-bold text-xl">Jasmine Green Tea</Text>
                            <Text className="text-gray-400 text-xs">you may think that the sun don't shine</Text>
                        </View>
                    </View>
                    <View className="h-[1px] bg-gray-700 my-2"/>
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                            <MaterialCommunityIcons name='account-circle-outline' size={26} color="#9ca3af"/>
                            <Text className="text-gray-400 text-lg py-2">Account</Text>
                        </View>
                        <View>
                            <Feather name='arrow-right' size={24} color="#9ca3af"/>
                        </View>
                    </View>
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name='notifications-outline' size={24} color="#9ca3af"/>
                            <Text className="text-gray-400 text-lg py-2">Notification</Text>
                        </View>
                        <View>
                            <Feather name='arrow-right' size={24} color="#9ca3af"/>
                        </View>
                    </View>
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                            <MaterialIcons name='security' size={24} color="#9ca3af"/>
                            <Text className="text-gray-400 text-lg py-2">Security & Privacy</Text>
                        </View>
                        <View>
                            <Feather name='arrow-right' size={24} color="#9ca3af"/>
                        </View>
                    </View>
                    <View className="h-[1px] bg-gray-700 my-2"/>
                    <View>
                        <TouchableOpacity className="flex-row items-center justify-between"
                                          onPress={() => navigation.navigate('Barbershop')}
                        >
                            <View className="flex-row items-center gap-2">
                                <Ionicons name='heart-outline' size={24} color="#9ca3af"/>
                                <Text className="text-gray-400 text-lg py-2">Liked Barbershop</Text>
                            </View>
                            <View>
                                <Feather name='arrow-right' size={24} color="#9ca3af"/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                            <MaterialIcons name='history' size={25} color="#9ca3af"/>
                            <Text className="text-gray-400 text-lg py-2">Book History</Text>
                        </View>
                        <View>
                            <Feather name='arrow-right' size={24} color="#9ca3af"/>
                        </View>
                    </View>
                    <View className="h-[1px] bg-gray-700 my-2"/>
                    <Text className="text-gray-400 py-2">More info and support</Text>
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name='information-circle-outline' size={26} color="#9ca3af"/>
                            <Text className="text-gray-400 text-lg py-2">About</Text>
                        </View>
                        <View>
                            <Feather name='arrow-right' size={24} color="#9ca3af"/>
                        </View>
                    </View>
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name='help-circle-outline' size={26} color="#9ca3af"/>
                            <Text className="text-gray-400 text-lg py-2">Help Center</Text>
                        </View>
                        <View>
                            <Feather name='arrow-right' size={24} color="#9ca3af"/>
                        </View>
                    </View>
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                            <MaterialIcons name='security' size={24} color="#9ca3af"/>
                            <Text className="text-gray-400 text-lg py-2">Privacy Policy</Text>
                        </View>
                        <View>
                            <Feather name='arrow-right' size={24} color="#9ca3af"/>
                        </View>
                    </View>
                    <View className="h-[1px] bg-gray-700 my-2"/>
                    <Text className="text-gray-400 py-2">More info and support</Text>
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                            <MaterialCommunityIcons name='account' size={26} color="#60a5fa"/>
                            <Text className="text-blue-400 text-lg py-2">Add account</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity className="flex-row items-center gap-2"
                                          onPress={handleLogout}
                        >
                            <Ionicons name='exit-outline' size={26} color="#ef4444"/>
                            <Text className="text-red-500 text-lg py-2">Log out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}