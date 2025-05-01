  // types/service.ts
  export interface Service {
    id: string;
    name: string;
    description: string;
    estimatedDuration: number; // in minutes
    basePrice: number;
    imageUrl?: string;
  }