import { AuthDto } from "@/models/dto/Auth";
import AuthInsertDateOfBirth from "@/screens/Auth/AuthInsertDateOfBirth";
import AuthInsertOtp from "@/screens/Auth/AuthInsertOtp";
import AuthInsertPhoneNumber from "@/screens/Auth/AuthInsertPhoneNumber";
import AuthInsertUsername from "@/screens/Auth/AuthInsertUsername";
import { AuthStackParamList } from "@/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

const Stack = createNativeStackNavigator<AuthStackParamList>();

type Props = {};

const AuthStack = (props: Props) => {
  const initialParams: AuthDto = {
    username: "",
    phoneNumberVerificationCode: "",
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackVisible: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="AuthInsertUsername"
        component={AuthInsertUsername}
        initialParams={{
          userData: initialParams,
        }}
      />

      <Stack.Screen name="AuthInsertOtp" component={AuthInsertOtp} />
      <Stack.Screen
        name="AuthInsertDateOfBirth"
        component={AuthInsertDateOfBirth}
      />
      <Stack.Screen
        name="AuthInsertPhoneNumber"
        component={AuthInsertPhoneNumber}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
