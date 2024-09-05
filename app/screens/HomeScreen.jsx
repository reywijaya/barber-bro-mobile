import React, {useEffect, useMemo, useState} from "react";
import {Image, ImageBackground, RefreshControl, ScrollView, Text, TouchableOpacity, View,} from "react-native";
import {SearchBar} from "react-native-elements";
import {SafeAreaView} from "react-native-safe-area-context";
import {useDispatch, useSelector} from "react-redux";

import {AntDesign, FontAwesome, FontAwesome5, Ionicons, MaterialIcons} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getBarbershop } from "../service/fetchDataBarberShop";
import { getBarbershops } from "../store/barbershops";
import { getDataProfile } from "../service/fetchDataProfile";

const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
};

const date = new Date()

const HomeScreen = ({navigation}) => {
    const [search, setSearch] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch();
    const barbershopData = useSelector((state) => state.barbershops.barbershops);

    const loadUserData = async () => {
        try {
            const storedUserData = await AsyncStorage.getItem("loggedInUser");
            if (storedUserData) {
                JSON.parse(storedUserData);
            }
        } catch (error) {
            console.error("Failed to load user data from AsyncStorage:", error);
        }
    };

    useEffect(() => {
        fetchBarbershopData();
        loadUserData();
    }, []);

    const updateSearch = (search) => {
        setSearch(search);
    };

    const filteredBarbershopData = useMemo(() => {
        if (!search) {
            return barbershopData;
        }

        return barbershopData.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    }, [search, barbershopData]);
  
    const onRefresh = async () => {
        setRefreshing(true);
        const data = await getBarbershop();
        dispatch(getBarbershops(data));
        setRefreshing(false);
    };

    const [favorite, setFavorite] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-zinc-900">
            <ScrollView>
                <View className="flex flex-row justify-between items-center p-5">
                    <View>
                        <Text className="font-bold text-zinc-200 text-2xl">Schedule</Text>
                        <Text className="text-zinc-400 text-xl">an appointment</Text>
                    </View>
                    <View className="flex-row gap-x-4">
                        <Ionicons name="notifications" size={22} color="white"/>
                        <Ionicons name="menu" size={22} color="white"/>
                    </View>
                </View>
                <View className="p-5">
                    <View className="flex flex-row gap-x-2">
                        <Text className="text-zinc-200 text-3xl">Hey,</Text>
                        <Text className="text-zinc-200 text-3xl font-bold">Michael</Text>
                        <MaterialIcons name="waving-hand" size={24} color="#ddc686"/>
                    </View>
                    <View>
                        <Text className="text-zinc-200">{date.toDateString()}</Text>
                    </View>
                </View>
                <View className="p-5">
                    <SearchBar
                        clearIcon={<MaterialIcons name="clear" size={24} color="white"/>}
                        searchIcon={<MaterialIcons name="search" size={24} color="white"/>}
                        containerStyle={{backgroundColor: "#27272a", borderRadius: 10}}
                        inputContainerStyle={{backgroundColor: "#27272a", height: 30}}
                        placeholder="Search"
                        placeholderTextColor={"#71717a"}
                        onChangeText={updateSearch}
                        value={search}
                        inputStyle={{fontSize: 18, color: "#d4d4d8"}}
                        style={{width: "100%", maxWidth: 400}}/>
                </View>
                <View className="flex flex-row px-5 py-2 gap-x-2">
                    <MaterialIcons name="history" size={18} color="#a1a1aa"/>
                    <Text className="text-zinc-400 font-bold">Latest Visit</Text>
                </View>
                <View className="px-5 pb-5">
                    <View className="bg-zinc-800 rounded-xl flex flex-row p-4 items-center justify-between">
                        <View className="rounded-lg flex flex-row items-center gap-x-4">
                            <Image
                                source={{uri: "https://www.tezzen.com/wp-content/uploads/2019/11/potong01.jpg"}}
                                style={{width: 80, height: 80}}
                                className="rounded-lg"
                            />
                            <View>
                                <Text className="text-zinc-200 font-bold text-xl">Prime Barbershop</Text>
                                <View className="flex flex-row gap-x-1">
                                    <Ionicons
                                        name="star-sharp"
                                        size={16}
                                        color="#eab308"
                                    />
                                    <Text
                                        className="text-zinc-200 text-md font-bold"
                                    >
                                        4.5
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View className="rounded-lg">
                            <TouchableOpacity>
                                <FontAwesome5 name="arrow-circle-right" size={24} color="#e4e4e7"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View className="flex flex-row px-5 gap-x-2">
                    <FontAwesome name="map-marker" size={18} color="#a1a1aa"/>
                    <Text className="text-zinc-400 font-bold">Nearby you</Text>
                </View>
                <View>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                    >
                        {filteredBarbershopData.map((item) => (<View className="p-2">
                            <View key={item.id} className="border-2 p-2 border-zinc-800 rounded-xl bg-zinc-900">
                                <View className="rounded-lg items-center">
                                    <ImageBackground
                                        source={{
                                            uri: "http://10.10.102.48:8080" + item.barbershop_profile_picture_id.path,
                                        }}
                                        style={{height: 180, width: 200}}
                                        imageStyle={{opacity: 0.7, borderRadius: 10}}
                                    >
                                        <View className="flex-row justify-between p-2">
                                            <View className="flex flex-row gap-x-1">
                                                <Ionicons
                                                    name="star-sharp"
                                                    size={18}
                                                    color="#facc15"
                                                />
                                                <Text
                                                    className="text-white text-md font-bold"
                                                >
                                                    4.5
                                                </Text>
                                            </View>
                                            <View className="flex flex-row gap-x-1">
                                                <TouchableOpacity onPress={() => setFavorite(!favorite)}>
                                                    <AntDesign name={favorite ? "heart" : "hearto"} size={18}
                                                               color={favorite ? "red" : "white"}/>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </View>
                                <View className="my-3 flex flex-row">
                                    <View className="flex">
                                        <View className="flex-row gap-x-2 items-center">
                                            <Text className="font-bold text-yellow-600">OPEN NOW</Text>
                                            <Text className="text-zinc-300 text-xs">09:00 | 20:00</Text>
                                        </View>
                                        <View className="flex flex-col">
                                            <Text className="text-xl font-bold text-white">
                                                {toTitleCase(item.name)}
                                            </Text>
                                        </View>
                                        <View className="flex flex-row gap-x-1 items-center">
                                            <Ionicons
                                                name="location-sharp"
                                                size={12}
                                                color="#a1a1aa"
                                            />
                                            <Text
                                                className="text-zinc-400 text-xs font-bold"
                                            >
                                                0.2 km
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View className="flex flex-row">
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("Barbershop", {
                                            id: item.id,
                                        })}
                                        className="bg-zinc-200 rounded-lg py-2"
                                        style={{flex: 1}}
                                    >
                                        <Text className="text-zinc-800 text-center font-bold">
                                            Book Now
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>))}
                    </ScrollView>
                </View>
                <View className="flex flex-row px-5 py-2 gap-x-2">
                    <Ionicons name="sparkles" size={18} color="#a1a1aa"/>
                    <Text className="text-zinc-400 font-bold">Recommendations</Text>
                </View>
                <View>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                    >
                        {filteredBarbershopData.map((item) => (<View className="p-2">
                            <View key={item.id} className="border-2 p-2 border-zinc-800 rounded-xl bg-zinc-900">
                                <View className="rounded-lg items-center">
                                    <ImageBackground
                                        source={{
                                            uri: "http://10.10.102.48:8080" + item.barbershop_profile_picture_id.path,
                                        }}
                                        style={{height: 180, width: 200}}
                                        imageStyle={{opacity: 0.7, borderRadius: 10}}
                                    >
                                        <View className="flex-row justify-between p-2">
                                            <View className="flex flex-row gap-x-1">
                                                <Ionicons
                                                    name="star-sharp"
                                                    size={18}
                                                    color="#facc15"
                                                />
                                                <Text
                                                    className="text-white text-md font-bold"
                                                >
                                                    4.5
                                                </Text>
                                            </View>
                                            <View className="flex flex-row gap-x-1">
                                                <AntDesign name="hearto" size={18} color="white"/>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </View>
                                <View className="my-3 flex flex-row">
                                    <View className="flex">
                                        <View className="flex-row gap-x-2">
                                            <Text className="font-bold text-yellow-600">OPEN NOW</Text>
                                            <Text className="text-zinc-300">09:00 | 20:00</Text>
                                        </View>
                                        <View className="flex flex-col">
                                            <Text className="text-xl font-bold text-white">
                                                {toTitleCase(item.name)}
                                            </Text>
                                        </View>
                                        <View className="flex flex-row gap-x-1 items-center">
                                            <Ionicons
                                                name="location-sharp"
                                                size={12}
                                                color="#a1a1aa"
                                            />
                                            <Text
                                                className="text-zinc-400 text-xs font-bold"
                                            >
                                                0.2 km
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View className="flex flex-row">
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("Barbershop", {
                                            id: item.id,
                                        })}
                                        className="bg-zinc-200 rounded-lg py-2"
                                        style={{flex: 1}}
                                    >
                                        <Text className="text-zinc-800 text-center font-bold">
                                            Book Now
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>))}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>);
};

export default HomeScreen;