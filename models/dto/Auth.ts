import { Country } from "../resources/Country";

export interface AuthDto {
  username: string; // Sarà sempre presente
  phoneNumberVerificationCode: string; // Codice di verifica del numero di telefono
  phoneNumber?: string;
  phoneNumberCountry?: Country;
  yearOfBirth?: number | null;
  monthOfBirth?: number | null;
  dayOfBirth?: number | null;
}
