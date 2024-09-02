import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const MapsComponent = ({ route, navigation }) => {
  const { latitude, longitude, markerTitle } = route.params;
  const [region, setRegion] = useState({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const handleRegionChangeComplete = (region) => {
    setRegion(region);
  };

  const zoomIn = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: Math.max(prevRegion.latitudeDelta * 0.9, 0.001), // Limit minimum zoom level
      longitudeDelta: Math.max(prevRegion.longitudeDelta * 0.9, 0.001),
    }));
  };

  const zoomOut = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 0.9, // Limit maximum zoom level
      longitudeDelta: prevRegion.longitudeDelta / 0.9,
    }));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#f4f4f5" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Back</Text>
        </View>

        {/* MAPS */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={handleRegionChangeComplete}
          >
            <Marker
              coordinate={{ latitude: latitude, longitude: longitude }}
              title={markerTitle}
            />
          </MapView>

          {/* Zoom Controls */}
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
              <Ionicons name="add-circle" size={36} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
              <Ionicons name="remove-circle" size={36} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: '#374151',
    alignItems: 'center',
    padding: 10,
  },
  backButton: {
    padding: 10,
  },
  headerText: {
    color: '#f4f4f5',
    fontWeight: 'bold',
    fontSize: 18,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  zoomControls: {
    position: 'absolute',
    bottom: 50,
    right: 10,
    alignItems: 'center',
  },
  zoomButton: {
    margin: 10,
    backgroundColor:"#333",
    borderRadius: 50,
  },
});

export default MapsComponent;
