import React from 'react';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AppointmentScreen from "./screens/AppointmentScreen";
import {Ionicons} from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{headerShown: false, tabBarShowLabel: true}}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: () => (
                        <Ionicons name="home-outline" size={20} color="black"/>
                    ),
                }}
            />
            <Tab.Screen
                name="Appointment"
                component={AppointmentScreen}
                options={{
                    tabBarIcon: () => (
                        <Ionicons name="calendar-outline" size={20} color="black"/>
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: () => (
                        <Ionicons name="person-outline" size={20} color="black"/>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;