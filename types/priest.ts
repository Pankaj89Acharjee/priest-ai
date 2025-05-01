import { UserProfile } from "./user";


export interface PriestProfile extends UserProfile {
    isPriest: true;
    biography: string;
    services: string[];
    languages: string[];
    experience: number; // years
    rating: number;
    reviewCount: number;
    availability: {
        monday: TimeSlot[];
        tuesday: TimeSlot[];
        wednesday: TimeSlot[];
        thursday: TimeSlot[];
        friday: TimeSlot[];
        saturday: TimeSlot[];
        sunday: TimeSlot[];
    };
    baseRate: number; // base rate per hour
    additionalRates: {
        [serviceName: string]: number;
    };
    verified: boolean;
    specializations: string[];
    galleryImages?: string[];
}

export interface TimeSlot {
    start: string; // format: "HH:MM" in 24-hour time
    end: string; // format: "HH:MM" in 24-hour time
}