// types/review.ts
export interface Review {
    id: string;
    bookingId: string;
    userId: string;
    priestId: string;
    rating: number; // 1-5
    comment: string;
    createdAt: Date;
    updatedAt: Date;
  }