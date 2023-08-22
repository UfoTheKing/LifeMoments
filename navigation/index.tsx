import HomeScreen from "@/screens/Root/Home/HomeScreen";
import { RootStackParamList } from "@/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Image, View } from "react-native";
import { useTheme } from "native-base";
import AuthStack from "./AuthStack";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { ILoginResponse } from "@/models/auth/Auth";
import { storeAuthToken } from "@/business/secure-store/AuthToken";
import { storeDeviceUuid } from "@/business/secure-store/DeviceUuid";
import { login } from "@/business/redux/features/user/userSlice";
import BottomTabNavigator from "./BottomTabNavigator";
import CreateStoryScreen from "@/screens/Root/CreateStory/CreateStoryScreen";
import { StyleSheet } from "react-native";

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

type Props = {
  data?: ILoginResponse;
};

const RootNavigation = ({ data }: Props) => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const user = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch();

  const colors = useTheme().colors;

  React.useEffect(() => {
    const loginAuthToken = async () => {
      if (!data) return;
      await storeAuthToken(data.accessToken);
      await storeDeviceUuid(data.device.uuid);
      dispatch(login(data));
    };

    if (!isLoggedIn && data) {
      loginAuthToken();
    }
  }, [data, isLoggedIn]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackVisible: false,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.primary[900],
        },
      }}
    >
      {isLoggedIn ? (
        <Stack.Group>
          <Stack.Screen
            name="Root"
            component={BottomTabNavigator}
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
              headerRight: () => {
                if (user && user.profilePictureUrl) {
                  return (
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        marginRight: 10,
                        borderRadius: 15,
                        backgroundColor: "#f7f7f7",
                      }}
                    >
                      <Image
                        source={{
                          uri: user.profilePictureUrl,
                        }}
                        style={{
                          ...StyleSheet.absoluteFillObject,
                          borderRadius: 15,
                        }}
                      />
                    </View>
                  );
                } else {
                  return (
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        marginRight: 10,
                        borderRadius: 15,
                        backgroundColor: "#f7f7f7",
                      }}
                    />
                  );
                }
              },
            }}
          />

          <Stack.Screen
            name="CreateStory"
            component={CreateStoryScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Group>
      ) : (
        <Stack.Screen
          name="AuthStack"
          component={AuthStack}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigation;
