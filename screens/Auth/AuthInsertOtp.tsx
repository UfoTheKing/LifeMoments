import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { AuthStackScreenProps } from "@/types";
import Container from "@/components/Container";
import { Box, useTheme } from "native-base";
import { authStyles, FORM_CONTROL_MAX_WIDTH } from "./AuthInsertUsername";
import { ScreenWidth, textColorGray } from "@/constants/Layout";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "react-query";
import { AuthDto } from "@/models/dto/Auth";
import { AuthSignUpLogIn } from "@/api/routes/auth";
import { ErrorResponseType } from "@/api/client";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { storeAuthToken } from "@/business/secure-store/AuthToken";
import { storeDeviceUuid } from "@/business/secure-store/DeviceUuid";
import { login } from "@/business/redux/features/user/userSlice";

const pinLength = 4;
const dialPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "del"];
const dialPadSize =
  ScreenWidth < FORM_CONTROL_MAX_WIDTH
    ? ScreenWidth * 0.2
    : FORM_CONTROL_MAX_WIDTH * 0.2;
const dialPadTextSize = dialPadSize * 0.4;
const _spacing = 20;

const pinContainerSize =
  ScreenWidth < FORM_CONTROL_MAX_WIDTH
    ? ScreenWidth / 2
    : FORM_CONTROL_MAX_WIDTH / 2;
const pinMaxSize = pinContainerSize / pinLength;
const pinSpacing = 10;
const pinSize = pinMaxSize - pinSpacing * 2;

type Props = {};

const AuthInsertOtp = ({
  navigation,
  route,
}: AuthStackScreenProps<"AuthInsertOtp">) => {
  const { userData, subtitle } = route.params;

  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const { colors } = useTheme();

  const dispatch = useDispatch();

  const mutation = useMutation((data: AuthDto) => AuthSignUpLogIn(data), {
    onSuccess: async (data) => {
      await storeAuthToken(data.accessToken);
      await storeDeviceUuid(data.device.uuid);
      dispatch(login(data));
    },
    onError: (error: ErrorResponseType) => {
      Toast.show({
        type: "error",
        text1: error.message,
      });
    },
  });

  React.useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate("Root", {
        screen: "TabHomeStack",
      });
    }
  }, [isLoggedIn]);

  return (
    <Container dismissKeyboardEnabled>
      <Box style={{ flex: 1 }} marginTop={10}>
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Text
            style={[
              authStyles.pageTitleText,
              {
                color: colors.primary[900],
              },
            ]}
          >
            Hello {userData.username}!
          </Text>
          <Text
            style={[
              authStyles.pageSubText,
              {
                color: textColorGray,
              },
            ]}
          >
            {subtitle}
          </Text>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: pinSpacing * 2,
              marginBottom: _spacing * 2,
              // backgroundColor: "green",
              height: pinSize * 2,
              alignItems: "flex-end",
            }}
          >
            {[...Array(pinLength)].map((_, index) => {
              const isSelected = !!userData.phoneNumberVerificationCode[index];
              return (
                <MotiView
                  key={index}
                  style={{
                    width: pinSize,
                    borderRadius: pinSize,
                    backgroundColor: "#000",
                  }}
                  animate={{
                    height: isSelected ? pinSize : 2,
                    marginBottom: isSelected ? pinSize / 2 : 0,
                  }}
                  transition={{
                    type: "timing",
                    duration: 200,
                  }}
                />
              );
            })}
          </View>

          <DialPad
            isLoading={mutation.isLoading}
            onPress={(item) => {
              if (item === "del") {
                let tmpOtp = userData.phoneNumberVerificationCode;
                if (tmpOtp) {
                  tmpOtp = tmpOtp.slice(0, -1);
                  navigation.setParams({
                    userData: {
                      ...userData,
                      phoneNumberVerificationCode: tmpOtp,
                    },
                  });
                }
              } else if (typeof item === "number") {
                let tmpOtp = userData.phoneNumberVerificationCode;
                if (tmpOtp.length >= pinLength) return;
                tmpOtp = tmpOtp + item.toString();
                navigation.setParams({
                  userData: {
                    ...userData,
                    phoneNumberVerificationCode: tmpOtp,
                  },
                });

                if (tmpOtp.length === pinLength) {
                  mutation.mutate({
                    ...userData,
                    phoneNumberVerificationCode: tmpOtp,
                  });
                }
              }
            }}
          />
        </View>
      </Box>
    </Container>
  );
};

const DialPad = ({
  isLoading,
  onPress,
}: {
  isLoading: boolean;
  onPress: (item: (typeof dialPad)[number]) => void;
}) => {
  return (
    <FlatList
      data={dialPad}
      keyExtractor={(item, index) => index.toString()}
      numColumns={3}
      style={{
        flexGrow: 0,
      }}
      columnWrapperStyle={{
        gap: _spacing,
      }}
      contentContainerStyle={{
        gap: _spacing,
      }}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          disabled={item === "" || isLoading}
          onPress={() => onPress(item)}
        >
          <View
            style={{
              ...styles.dialPadButton,

              borderWidth: typeof item !== "number" ? 0 : 1,
            }}
          >
            {item === "del" ? (
              <Ionicons name="backspace-outline" size={dialPadTextSize} />
            ) : (
              <Text style={styles.dialPadButtonText}>{item}</Text>
            )}
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default AuthInsertOtp;

const styles = StyleSheet.create({
  dialPadButton: {
    width: dialPadSize,
    height: dialPadSize,
    borderRadius: dialPadSize,

    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  dialPadButtonText: {
    fontSize: dialPadTextSize,
  },
});
