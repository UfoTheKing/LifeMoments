export interface User {
  id: number;
  username: string;

  dateOfBirth: {
    it: string; // DD/MM/YYYY
    en: string; // YYYY-MM-DD
  };

  biography: string | null;

  isVerified: boolean;
}

export interface FriendshipStatus {
  isFriend: boolean;

  incomingRequest: boolean;
  outgoingRequest: boolean;
}
