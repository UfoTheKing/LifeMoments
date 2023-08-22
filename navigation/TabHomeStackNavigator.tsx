import { StyleSheet } from "react-native";
import React from "react";
import { TabHomeParamList } from "@/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@/screens/BottomTabs/TabHome/HomeScreen";

type Props = {};

const Stack = createNativeStackNavigator<TabHomeParamList>();

export default function TabHomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackVisible: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
