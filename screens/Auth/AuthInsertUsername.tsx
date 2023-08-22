import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Container from "@/components/Container";
import { Box, Button, Input, useTheme } from "native-base";
import { ScreenWidth, textColorGray } from "@/constants/Layout";
import { TextInput } from "react-native-gesture-handler";
import { AuthStackScreenProps } from "@/types";
import { useFocusEffect } from "@react-navigation/native";
import { AuthValidateUsername } from "@/api/routes/auth";
import { useQuery, useQueryClient } from "react-query";

type Props = {};

const AuthInsertUsername = ({
  navigation,
  route,
}: AuthStackScreenProps<"AuthInsertUsername">) => {
  const { userData } = route.params;

  const { colors } = useTheme();

  const queryClient = useQueryClient();

  const inputRef = React.useRef<TextInput>(null);

  const { data, isLoading, refetch, isRefetching } = useQuery(
    ["Auth", "ValidateUsername", userData.username],
    () => AuthValidateUsername(userData.username),
    {
      enabled: false,
      retry: false,
      onSuccess(data) {
        if (data.otpSent) {
          navigation.navigate("AuthInsertOtp", {
            userData: {
              ...userData,
            },
            subtitle: data.message,
          });
        } else {
          navigation.navigate("AuthInsertDateOfBirth", {
            userData: {
              ...userData,
            },
          });
        }

        queryClient.invalidateQueries(["Auth", "ValidateUsername"]);
      },
    }
  );

  const onChangeUsername = (text: string) => {
    navigation.setParams({
      userData: {
        ...userData,
        username: text.toLocaleLowerCase().trim(),
      },
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      inputRef.current?.focus();
    }, [])
  );

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
            Hello!
          </Text>
          <Text
            style={[
              authStyles.pageSubText,
              {
                color: textColorGray,
              },
            ]}
          >
            Let' get started, choose a username?
          </Text>
        </View>

        <View
          style={{
            width: ScreenWidth,
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View style={authStyles.formContainer}>
            <Input
              ref={inputRef}
              variant={"unstyled"}
              style={authStyles.formInput}
              value={userData.username}
              onChangeText={onChangeUsername}
              placeholder="Username..."
              placeholderTextColor={PlaceHolderColor}
              isDisabled={isLoading || isRefetching}
            />

            <Button
              style={authStyles.continueButton}
              onPress={() => refetch()}
              isLoading={isLoading || isRefetching}
              isDisabled={userData.username.length < 3}
            >
              <Text style={authStyles.textCompleteAndContinue}>Continue</Text>
            </Button>
          </View>
        </View>
      </Box>
    </Container>
  );
};

export default AuthInsertUsername;

export const FORM_CONTROL_MAX_WIDTH = 400;
export const PlaceHolderColor = "#c7c7c7";

export const authStyles = StyleSheet.create({
  pageTitleText: {
    fontWeight: "600",
    fontSize: 30,
    lineHeight: 45,
  },
  pageSubText: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 18,
  },
  formContainer: {
    maxWidth: FORM_CONTROL_MAX_WIDTH,
    width: "100%",
  },
  formInput: {
    height: 50,
    fontSize: 25,
    textAlign: "left",
    fontWeight: "bold",
    backgroundColor: "#f7f7f7",
  },

  continueButton: {
    marginTop: 20,
    width: "100%",
    borderRadius: 20,
    height: 50,
  },
  textCompleteAndContinue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  textError: {
    fontSize: 12,
    color: "red",
    marginBottom: 10,
    fontWeight: "500",
    marginTop: 5,
  },
});
