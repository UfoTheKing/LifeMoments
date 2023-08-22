import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthDto } from "@/models/dto/Auth";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
/* ------------------------------------------------------ ROOT ------------------------------------------------------ */
export type RootStackParamList = {
  Home: undefined;
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  AuthStack: NativeStackScreenProps<AuthStackParamList> | undefined;

  CreateStory: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

/* ------------------------------------------------------ Auth ------------------------------------------------------ */
/**
 * Flusso Auth:
 * 1. L'utente inserisce lo username
 *    - Se lo username è già presente nel database, l'utente viene reindirizzato alla schermata di verifica dell'OTP
 *   - Se lo username non è presente nel database, l'utente viene reindirizzato alla schermata di inserimento della data di nascita
 * 2. L'utente inserisce la data di nascita
 *   - Se la data di nascita è valida, l'utente viene reindirizzato alla schermata di inserimento del numero di telefono
 *  - Se la data di nascita non è valida, l'utente viene reindirizzato alla schermata di inserimento della data di nascita
 * 3. L'utente inserisce il numero di telefono
 *  - Se il numero di telefono è valido, l'utente viene reindirizzato alla schermata di verifica dell'OTP
 * - Se il numero di telefono non è valido, l'utente viene reindirizzato alla schermata di inserimento del numero di telefono
 * 4. L'utente inserisce il codice di verifica del numero di telefono
 * - Se il codice di verifica è valido, l'utente viene reindirizzato alla schermata di Home: il backend (se il numero di telefono non è presente nel database) crea l'utente e lo reindirizza alla schermata di Home
 * - Se il codice di verifica non è valido, l'utente viene reindirizzato alla schermata di verifica dell'OTP
 *
 */

export type AuthStackParamList = {
  AuthInsertUsername: {
    userData: AuthDto;
  };
  AuthInsertDateOfBirth: {
    userData: AuthDto;
  };
  AuthInsertPhoneNumber: {
    userData: AuthDto;
  };
  AuthInsertOtp: {
    userData: AuthDto;
    subtitle: string;
  };
};

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

/* ------------------------------------------------------ BOTTOM TABS ------------------------------------------------------ */
export type RootTabParamList = {
  TabHomeStack: NavigatorScreenParams<TabHomeParamList> | undefined;
  TabDiscoverStack: NavigatorScreenParams<TabDiscoverParamList> | undefined;
  TabUsersMap: undefined;
};
export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

/* ------------------------------------------------------ HOME STACK ------------------------------------------------------ */
export type TabHomeParamList = {
  Home: undefined;
  News: undefined;
  Notifications: undefined;
};

export type TabHomeScreenProps<Screen extends keyof TabHomeParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<TabHomeParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

/* ------------------------------------------------------ DISCOVER STACK ------------------------------------------------------ */
export type TabDiscoverParamList = {
  Discover: undefined;
};

export type TabDiscoverScreenProps<Screen extends keyof TabDiscoverParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<TabDiscoverParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
