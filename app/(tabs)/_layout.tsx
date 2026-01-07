import React from "react";
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { Tabs } from "expo-router";
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from '../../services/i18n';


export default function Layout() {
  return (
    <Tabs 
      backBehavior="order"
      screenOptions={{ 
          tabBarActiveTintColor: "#2563eb",
          tabBarInactiveTintColor: "#6b7280",
          tabBarStyle: {
            backgroundColor: "#ffffff"
          }
      }}>

        <Tabs.Screen
            name="index"
            options={{href: null}}
        />

        <Tabs.Screen name="p-home" options={{
            title: i18n.t('p_home'), 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome6 name="house" size={20} color={color} />
            )
        }}/>

        <Tabs.Screen name="p-discover" options={{
            title: i18n.t('p_discover'), 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome6 name="compass" size={20} color={color} />
            )
        }}/>

        <Tabs.Screen name="p-my_collections" options={{
            title: i18n.t('p_my_collections'), 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome6 name="heart" size={20} color={color} />
            )
        }}/>

        <Tabs.Screen name="p-personal_center" options={{
            title: i18n.t('tab_profile'), 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome6 name="user" size={20} color={color} />
            )
        }}/>
    </Tabs>
  );
}