export interface UserLocation {
  id: number;
  userId: number;
  latitude: string;
  longitude: string;
  accuracy: string | null;

  createdAt: Date;
}
