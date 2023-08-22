import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AuthStackScreenProps } from "@/types";
import PhoneInput from "react-native-phone-input";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AuthSendOtp, AuthGetCountryByIp } from "@/api/routes/auth";
import { useFocusEffect } from "@react-navigation/native";
import Container from "@/components/Container";
import { Box, Button, useTheme } from "native-base";
import { PlaceHolderColor, authStyles } from "./AuthInsertUsername";
import { ScreenWidth, textColorGray } from "@/constants/Layout";

type Props = {};

const AuthInsertPhoneNumber = ({
  navigation,
  route,
}: AuthStackScreenProps<"AuthInsertPhoneNumber">) => {
  const { userData } = route.params;

  const { colors } = useTheme();

  const queryClient = useQueryClient();

  const phoneInputRef = React.useRef<PhoneInput>(null);

  const { data: initialCountry, refetch: refetchInitialCountry } = useQuery(
    ["Auth", "InitialCountry"],
    () => AuthGetCountryByIp(),
    {
      enabled: false,
    }
  );

  const mutation = useMutation(
    (phoneNumber: string) => AuthSendOtp(phoneNumber),
    {
      onSuccess: (data) => {
        navigation.navigate("AuthInsertOtp", {
          userData: {
            ...userData,
          },
          subtitle: data.message,
        });

        queryClient.invalidateQueries(["Auth", "ValidatePhoneNumber"]);
      },
    }
  );

  React.useEffect(() => {
    if (initialCountry && initialCountry.country) {
      // Se il data.phoneNumberCountry === null, allora vuol dire che l'utente non ha mai inserito un numero di telefono
      // e quindi si può usare il paese iniziale
      if (!userData.phoneNumberCountry) {
        navigation.setParams({
          userData: {
            ...userData,
            phoneNumberCountry: initialCountry.country,
          },
        });
      }
    }
  }, [initialCountry]);

  useFocusEffect(
    React.useCallback(() => {
      refetchInitialCountry();
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
            It's almost there!
          </Text>
          <Text
            style={[
              authStyles.pageSubText,
              {
                color: textColorGray,
              },
            ]}
          >
            Create your account using your phone number
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
            <PhoneInput
              ref={phoneInputRef}
              initialCountry={userData.phoneNumberCountry?.iso}
              textProps={{
                placeholder: "Phone Number...",
                placeholderTextColor: PlaceHolderColor,
              }}
              style={authStyles.formInput}
              onChangePhoneNumber={(phoneNumber) => {
                navigation.setParams({
                  userData: {
                    ...userData,
                    phoneNumber: phoneNumber,
                  },
                });
              }}
              initialValue={userData.phoneNumber}
              disabled={mutation.isLoading}
            />

            <Button
              style={authStyles.continueButton}
              onPress={() => {
                if (!userData.phoneNumber) {
                  return;
                }

                mutation.mutate(userData.phoneNumber);
              }}
              isLoading={mutation.isLoading}
              isDisabled={
                userData.phoneNumber === undefined ||
                userData.phoneNumber === null ||
                userData.phoneNumber.length < 5
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

export default AuthInsertPhoneNumber;

const styles = StyleSheet.create({});
