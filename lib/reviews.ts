// lib/reviews.ts
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    getDoc, 
    doc, 
    updateDoc, 
    deleteDoc,
    orderBy,
    limit,
    startAfter,
    DocumentSnapshot
  } from 'firebase/firestore';
  import { db } from './firebase';
  import { Review } from '@/types/review';
  import { updateDoc as updateDocument } from 'firebase/firestore';
  
  // Create a new review
  export const createReview = async (
    userId: string,
    priestId: string,
    bookingId: string,
    rating: number,
    comment: string
  ): Promise<string> => {
    try {
      // Check if a review already exists for this booking
      const existingReviewQuery = query(
        collection(db, 'reviews'),
        where('bookingId', '==', bookingId)
      );
      
      const existingReviewSnapshot = await getDocs(existingReviewQuery);
      
      if (!existingReviewSnapshot.empty) {
        throw new Error('A review already exists for this booking');
      }
      
      // Create new review
      const reviewRef = await addDoc(collection(db, 'reviews'), {
        userId,
        priestId,
        bookingId,
        rating,
        comment,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Update the booking with the review ID
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        reviewId: reviewRef.id,
        updatedAt: new Date(),
      });
      
      // Update priest's rating
      await updatePriestRating(priestId);
      
      return reviewRef.id;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  };
  
  // Update a review
  export const updateReview = async (
    reviewId: string,
    rating: number,
    comment: string
  ): Promise<void> => {
    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      const reviewDoc = await getDoc(reviewRef);
      
      if (!reviewDoc.exists()) {
        throw new Error('Review not found');
      }
      
      await updateDoc(reviewRef, {
        rating,
        comment,
        updatedAt: new Date(),
      });
      
      // Update priest's rating
      const priestId = reviewDoc.data().priestId;
      await updatePriestRating(priestId);
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  };
  
  // Delete a review
  export const deleteReview = async (reviewId: string): Promise<void> => {
    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      const reviewDoc = await getDoc(reviewRef);
      
      if (!reviewDoc.exists()) {
        throw new Error('Review not found');
      }
      
      const priestId = reviewDoc.data().priestId;
      const bookingId = reviewDoc.data().bookingId;
      
      // Delete review
      await deleteDoc(reviewRef);
      
      // Update booking to remove review ID
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        reviewId: null,
        updatedAt: new Date(),
      });
      
      // Update priest's rating
      await updatePriestRating(priestId);
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  };
  
  // Get a review by ID
  export const getReviewById = async (reviewId: string): Promise<Review | null> => {
    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      const reviewDoc = await getDoc(reviewRef);
      
      if (reviewDoc.exists()) {
        const data = reviewDoc.data();
        return {
          id: reviewDoc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Review;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting review by ID:', error);
      throw error;
    }
  };
  
  // Get reviews for a priest
  export const getPriestReviews = async (
    priestId: string,
    limitCount: number = 10,
    lastDoc?: DocumentSnapshot
  ): Promise<{
    reviews: Review[],
    lastDoc: DocumentSnapshot | null
  }> => {
    try {
      let reviewsQuery = query(
        collection(db, 'reviews'),
        where('priestId', '==', priestId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      // If we have a last document, start after it for pagination
      if (lastDoc) {
        reviewsQuery = query(
          collection(db, 'reviews'),
          where('priestId', '==', priestId),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(limitCount)
        );
      }
      
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviews: Review[] = [];
      
      reviewsSnapshot.forEach((doc) => {
        const data = doc.data();
        reviews.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Review);
      });
      
      const newLastDoc = reviewsSnapshot.docs.length > 0 
        ? reviewsSnapshot.docs[reviewsSnapshot.docs.length - 1] 
        : null;
      
      return {
        reviews,
        lastDoc: newLastDoc
      };
    } catch (error) {
      console.error('Error getting priest reviews:', error);
      throw error;
    }
  };
  
  // Get reviews by a user
  export const getUserReviews = async (
    userId: string,
    limitCount: number = 10,
    lastDoc?: DocumentSnapshot
  ): Promise<{
    reviews: Review[],
    lastDoc: DocumentSnapshot | null
  }> => {
    try {
      let reviewsQuery = query(
        collection(db, 'reviews'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      // If we have a last document, start after it for pagination
      if (lastDoc) {
        reviewsQuery = query(
          collection(db, 'reviews'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(limitCount)
        );
      }
      
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviews: Review[] = [];
      
      reviewsSnapshot.forEach((doc) => {
        const data = doc.data();
        reviews.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Review);
      });
      
      const newLastDoc = reviewsSnapshot.docs.length > 0 
        ? reviewsSnapshot.docs[reviewsSnapshot.docs.length - 1] 
        : null;
      
      return {
        reviews,
        lastDoc: newLastDoc
      };
    } catch (error) {
      console.error('Error getting user reviews:', error);
      throw error;
    }
  };
  
  // Update priest's rating after a review is added, updated, or deleted
  const updatePriestRating = async (priestId: string): Promise<void> => {
    try {
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('priestId', '==', priestId)
      );
      
      const reviewsSnapshot = await getDocs(reviewsQuery);
      
      if (reviewsSnapshot.empty) {
        // No reviews, set rating to 0
        const priestRef = doc(db, 'users', priestId);
        await updateDocument(priestRef, {
          rating: 0,
          reviewCount: 0,
          updatedAt: new Date(),
        });
        
        return;
      }
      
      let totalRating = 0;
      let reviewCount = 0;
      
      reviewsSnapshot.forEach((doc) => {
        const data = doc.data();
        totalRating += data.rating;
        reviewCount++;
      });
      
      const averageRating = totalRating / reviewCount;
      
      // Update priest's rating
      const priestRef = doc(db, 'users', priestId);
      await updateDocument(priestRef, {
        rating: averageRating,
        reviewCount,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating priest rating:', error);
      throw error;
    }
  };