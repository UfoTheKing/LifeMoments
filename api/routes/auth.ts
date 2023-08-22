import { Country } from "@/models/resources/Country";
import client from "../client";
import { AuthDto } from "@/models/dto/Auth";
import { ILoginResponse } from "@/models/auth/Auth";
import { getDeviceUuid } from "@/business/secure-store/DeviceUuid";

const API_PATH = "/auth";

export const AuthValidateUsername = async (
  username: string
): Promise<{
  message: string;
  otpSent: boolean;
}> => {
  try {
    const { data } = await client.get(
      `${API_PATH}/validate_username?username=${username}`
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const AuthSignUpLogIn = async (
  data: AuthDto
): Promise<ILoginResponse> => {
  try {
    const { data: response } = await client.post(
      `${API_PATH}/signup_login`,
      data
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const AuthLogInAuthToken = async (
  authToken: string
): Promise<ILoginResponse> => {
  try {
    const deviceUuid = await getDeviceUuid();

    const { data: response } = await client.post(
      `${API_PATH}/login_auth_token`,
      {
        authToken,
      },
      {
        headers: {
          DeviceUuid: deviceUuid,
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const AuthSendOtp = async (
  phoneNumber: string
): Promise<{
  message: string;
}> => {
  try {
    const { data } = await client.post(`${API_PATH}/send_otp`, {
      phoneNumber,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const AuthValidateDateOfBirth = async (
  yearOfBirth: number,
  monthOfBirth: number,
  dayOfBirth: number
): Promise<{
  message: string;
}> => {
  try {
    const { data } = await client.get(
      `${API_PATH}/validate_date_of_birth?yearOfBirth=${yearOfBirth}&monthOfBirth=${monthOfBirth}&dayOfBirth=${dayOfBirth}`
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const AuthGetCountryByIp = async (): Promise<{
  country: Country;
}> => {
  try {
    const { data } = await client.get(`${API_PATH}/get_country_by_ip`);

    return data;
  } catch (error) {
    throw error;
  }
};
