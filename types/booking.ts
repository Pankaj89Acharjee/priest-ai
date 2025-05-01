
  
  // types/booking.ts
  export interface Booking {
    id: string;
    userId: string;
    priestId: string;
    serviceName: string;
    serviceDate: Date;
    startTime: string; // format: "HH:MM" in 24-hour time
    endTime: string; // format: "HH:MM" in 24-hour time
    location: {
      address: string;
      city: string;
      state: string;
      zipCode: string;
      latitude?: number;
      longitude?: number;
    };
    specialRequirements?: string;
    totalAmount: number;
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
    reviewId?: string;
  }
  
  export type BookingStatus = 
    | 'pending' 
    | 'confirmed' 
    | 'in-progress' 
    | 'completed' 
    | 'cancelled';
  
  export type PaymentStatus = 
    | 'pending' 
    | 'processing'
    | 'completed' 
    | 'failed' 
    | 'refunded';
  
  
  
