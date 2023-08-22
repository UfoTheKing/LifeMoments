import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { AuthStackScreenProps } from "@/types";
import { QueryClient, useQuery } from "react-query";
import { AuthValidateDateOfBirth } from "@/api/routes/auth";
import { useFocusEffect } from "@react-navigation/native";
import Container from "@/components/Container";
import { Box, Button, FormControl, Input, useTheme } from "native-base";
import { PlaceHolderColor, authStyles } from "./AuthInsertUsername";
import { ScreenWidth, textColorGray } from "@/constants/Layout";
import { instanceOfErrorResponseType } from "@/api/client";

type Props = {};

const AuthInsertDateOfBirth = ({
  navigation,
  route,
}: AuthStackScreenProps<"AuthInsertDateOfBirth">) => {
  const { userData } = route.params;

  const { colors } = useTheme();

  const queryClient = new QueryClient();

  const textInputMonth = React.useRef<TextInput>(null);
  const textInputDay = React.useRef<TextInput>(null);
  const textInputYear = React.useRef<TextInput>(null);

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery(
    [
      "Auth",
      "ValidateDateOfBirth",
      userData.yearOfBirth,
      userData.monthOfBirth,
      userData.dayOfBirth,
    ],
    () =>
      AuthValidateDateOfBirth(
        userData.yearOfBirth!,
        userData.monthOfBirth!,
        userData.dayOfBirth!
      ),
    {
      enabled: false,
      retry: 1,
      onSuccess: () => {
        navigation.navigate("AuthInsertPhoneNumber", {
          userData: {
            ...userData,
          },
        });

        queryClient.invalidateQueries(["Auth", "ValidateDateOfBirth"]);
      },
    }
  );

  useFocusEffect(
    React.useCallback(() => {
      textInputMonth.current?.focus();
    }, [])
  );

  const onChangeYearOfBirth = (text: string) => {
    if (text.length > 4) return;
    if (isNaN(parseInt(text))) return;
    navigation.setParams({
      userData: {
        ...userData,
        yearOfBirth: text.length === 0 ? null : parseInt(text),
      },
    });
  };

  const onChangeMonthOfBirth = (text: string) => {
    if (text.length > 2) return;
    if (isNaN(parseInt(text))) return;
    navigation.setParams({
      userData: {
        ...userData,
        monthOfBirth: text.length === 0 ? null : parseInt(text),
      },
    });

    // Se l'utente ha inserito 2 numeri, allora si passa al giorno
    if (text.length === 2) {
      textInputDay.current?.focus();
    }
  };

  const onChangeDayOfBirth = (text: string) => {
    if (text.length > 2) return;
    if (isNaN(parseInt(text))) return;
    navigation.setParams({
      userData: {
        ...userData,
        dayOfBirth: text.length === 0 ? null : parseInt(text),
      },
    });

    // Se l'utente ha inserito 2 numeri, allora si passa al giorno
    if (text.length === 2) {
      textInputYear.current?.focus();
    }
  };

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
            Hi {userData.username}!
          </Text>
          <Text
            style={[
              authStyles.pageSubText,
              {
                color: textColorGray,
              },
            ]}
          >
            When's your birthday?
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  ...styles.container,
                  flex: 1,
                }}
              >
                <FormControl>
                  <Input
                    ref={textInputMonth}
                    placeholder="MM"
                    variant="unstyled"
                    keyboardType="number-pad"
                    inputMode="numeric"
                    maxLength={2}
                    style={[
                      authStyles.formInput,
                      {
                        textAlign: "center",
                      },
                    ]}
                    placeholderTextColor={"#d2d2d2"}
                    value={userData.monthOfBirth?.toString()}
                    onChangeText={onChangeMonthOfBirth}
                    isDisabled={isLoading || isRefetching}
                  />
                </FormControl>
              </View>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                  color: PlaceHolderColor,
                }}
              >
                /
              </Text>
              <View
                style={{
                  ...styles.container,
                  flex: 1,
                }}
              >
                <FormControl>
                  <Input
                    ref={textInputDay}
                    placeholder="DD"
                    variant="unstyled"
                    keyboardType="number-pad"
                    maxLength={2}
                    style={[
                      authStyles.formInput,
                      {
                        textAlign: "center",
                      },
                    ]}
                    placeholderTextColor={"#d2d2d2"}
                    value={userData.dayOfBirth?.toString()}
                    onChangeText={onChangeDayOfBirth}
                    isDisabled={isLoading || isRefetching}
                  />
                </FormControl>
              </View>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                  color: PlaceHolderColor,
                }}
              >
                /
              </Text>
              <View
                style={{
                  ...styles.container,
                  flex: 1,
                }}
              >
                <FormControl>
                  <Input
                    ref={textInputYear}
                    placeholder="YYYY"
                    variant="unstyled"
                    keyboardType="number-pad"
                    maxLength={4}
                    style={[
                      authStyles.formInput,
                      {
                        textAlign: "center",
                      },
                    ]}
                    placeholderTextColor={PlaceHolderColor}
                    value={userData.yearOfBirth?.toString()}
                    onChangeText={onChangeYearOfBirth}
                    isDisabled={isLoading || isRefetching}
                  />
                </FormControl>
              </View>
            </View>

            {isError && (
              <Text style={authStyles.textError}>
                {error && instanceOfErrorResponseType(error)
                  ? error.message
                  : "Something went wrong"}
              </Text>
            )}

            <Button
              style={authStyles.continueButton}
              onPress={() => refetch()}
              isLoading={isLoading || isRefetching}
              isDisabled={
                userData.yearOfBirth === null ||
                userData.monthOfBirth === null ||
                userData.dayOfBirth === null ||
                userData.yearOfBirth === undefined ||
                userData.monthOfBirth === undefined ||
                userData.dayOfBirth === undefined ||
                userData.yearOfBirth.toString().length !== 4 ||
                userData.monthOfBirth.toString().length !== 2 ||
                userData.dayOfBirth.toString().length !== 2 ||
                isLoading ||
                isRefetching
              }
            >
              <Text style={authStyles.textCompleteAndContinue}>Continue</Text>
            </Button>
          </View>
        </View>
      </Box>
    </Container>
  );
};

export default AuthInsertDateOfBirth;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
  },
});
