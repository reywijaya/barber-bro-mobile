import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import axios from 'axios';
import { tailwind } from 'nativewind'; // import tailwind from nativewind

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
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
      fetchRoute(location.coords.latitude, location.coords.longitude, latitude, longitude);
    })();
  }, []);

  const fetchRoute = async (startLat, startLng, endLat, endLng) => {
    const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Ganti dengan API Key Anda
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json`, {
        params: {
          origin: `${startLat},${startLng}`,
          destination: `${endLat},${endLng}`,
          key: GOOGLE_MAPS_API_KEY,
        },
      });

      if (response.data.routes.length > 0) {
        const points = response.data.routes[0].overview_polyline.points;
        const decodedPoints = decodePolyline(points);
        setRouteCoordinates(decodedPoints);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch route");
    }
  };

  const decodePolyline = (encoded) => {
    const points = [];
    let index = 0, lat = 0, lng = 0;
    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1);
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1);
      lng += dlng;
      points.push({
        latitude: (lat / 1e5) + 0,
        longitude: (lng / 1e5) + 0,
      });
    }
    return points;
  };

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
        <View className="flex-row bg-gray-800 items-center p-2">
          <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#f4f4f5" />
          </TouchableOpacity>
          <Text className="text-white font-bold text-lg">Back</Text>
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
                coordinate={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }}
                title="Your Location"
                pinColor="blue"
              />
            )}
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#FF0000"
              strokeWidth={3}
            />
          </MapView>

          {/* Zoom Controls */}
          <View className="absolute bottom-12 right-2 items-center">
            <TouchableOpacity className="m-2 bg-gray-800 rounded-full p-2" onPress={zoomIn}>
              <Ionicons name="add-circle" size={36} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="m-2 bg-gray-800 rounded-full p-2" onPress={zoomOut}>
              <Ionicons name="remove-circle" size={36} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="m-2 bg-gray-800 rounded-full p-2" onPress={goToCurrentLocation}>
              <MaterialIcons name="my-location" size={36} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MapsComponent;
