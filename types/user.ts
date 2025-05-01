// types/user.ts
export interface UserProfile {
    id: string;
    email: string;
    displayName: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    createdAt: Date;
    updatedAt: Date;
    location?: {
      latitude: number;
      longitude: number;
    };
    profileImageUrl?: string;
  }