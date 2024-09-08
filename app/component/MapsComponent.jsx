import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { tailwind } from "nativewind"; // import tailwind from nativewind
import { Toast } from "react-native-alert-notification";

const MapsComponent = ({ route, navigation }) => {
  const { latitude, longitude, markerTitle } = route.params;
  const [region, setRegion] = useState({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          // Alert.alert(
          //   "Permission Denied",
          //   "Please enable location services to use this feature."
          // );
          Toast.show({
            type: "error",
            text: "Please enable location services to use this feature.",
            autoClose: 2000,
          })
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);

        // Calculate the route (straight line)
        setRouteCoordinates([
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          { latitude: latitude, longitude: longitude },
        ]);
      } catch (error) {
        setErrorMsg("Error getting location");
        // Alert.alert("Error", "Failed to retrieve current location. Please try again.");
      }
    })();
  }, []);

  const handleRegionChangeComplete = (region) => {
    setRegion(region);
  };

  const zoomIn = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: Math.max(prevRegion.latitudeDelta * 0.9, 0.001),
      longitudeDelta: Math.max(prevRegion.longitudeDelta * 0.9, 0.001),
    }));
  };

  const zoomOut = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 0.9,
      longitudeDelta: prevRegion.longitudeDelta / 0.9,
    }));
  };

  const goToCurrentLocation = () => {
    if (currentLocation) {
      setRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else {
      Alert.alert("Location not available", "Unable to get current location.");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        {/* Back Button and Header */}
        <View className="flex-row items-center p-2 bg-white border border-solid border-black">
          <Ionicons
            name="arrow-back"
            size={24}
            color="#030712"
            onPress={() => navigation.goBack()}
          />
          <Text className="text-zinc-900 text-xl font-bold ml-2">Back</Text>
        </View>

        {/* MAPS */}
        <View className="flex-1 relative">
          <MapView
            style={{ flex: 1 }}
            region={region}
            onRegionChangeComplete={handleRegionChangeComplete}
          >
            <Marker
              coordinate={{ latitude: latitude, longitude: longitude }}
              title={markerTitle}
            />
            {currentLocation && (
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="Your Location"
                pinColor="blue"
              />
            )}
            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="#FF0000"
                strokeWidth={3}
              />
            )}
          </MapView>

          {/* Zoom Controls */}
          <View className="absolute bottom-12 right-2 items-center">
            <TouchableOpacity
              className="m-2 bg-gray-800 rounded-full p-2"
              onPress={zoomIn}
            >
              <Ionicons name="add-circle" size={36} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="m-2 bg-gray-800 rounded-full p-2"
              onPress={zoomOut}
            >
              <Ionicons name="remove-circle" size={36} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="m-2 bg-gray-800 rounded-full p-2"
              onPress={goToCurrentLocation}
            >
              <MaterialIcons name="my-location" size={36} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MapsComponent;
