import HomeScreen from "@/screens/Root/Home/HomeScreen";
import { RootStackParamList } from "@/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";
import { Image, View } from "react-native";

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

type Props = {};

const RootNavigation = ({}: Props) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackVisible: false,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#2e86c1",
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={{
                  uri: "https://1000marche.net/wp-content/uploads/2020/03/Instagram-Logo-2010-2013.png",
                }}
                style={{
                  width: 100,
                  height: 30,
                  resizeMode: "contain",
                }}
              />
            </View>
          ),
          headerRight: () => (
            <Image
              source={{
                uri: "https://www.w3schools.com/howto/img_avatar.png",
              }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                marginRight: 10,
              }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigation;
