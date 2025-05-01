// // lib/bookings.ts
// import { 
//     collection, 
//     addDoc, 
//     query, 
//     where, 
//     getDocs, 
//     getDoc, 
//     doc, 
//     updateDoc, 
//     serverTimestamp,
//     Timestamp,
//     orderBy,
//     limit,
//     startAfter,
//     DocumentSnapshot,
//     deleteDoc
//   } from 'firebase/firestore';
//   import { db } from './firebase';
//   import { Booking, BookingStatus, PaymentStatus } from '@/types/booking';
//   import { getPriestsByLocation } from './priests';
  
//   // Create a new booking
//   export const createBooking = async (
//     userId: string,
//     priestId: string,
//     bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'priestId' | 'status' | 'paymentStatus'>
//   ): Promise<string> => {
//     try {
//       const bookingRef = await addDoc(collection(db, 'bookings'), {
//         userId,
//         priestId,
//         ...bookingData,
//         status: 'pending' as BookingStatus,
//         paymentStatus: 'pending' as PaymentStatus,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
      
//       return bookingRef.id;
//     } catch (error) {
//       console.error('Error creating booking:', error);
//       throw error;
//     }
//   };
  
//   // Find and automatically assign a priest
//   export const findAndAssignPriest = async (
//     userId: string,
//     userLatitude: number,
//     userLongitude: number,
//     bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'priestId' | 'status' | 'paymentStatus'>
//   ): Promise<{bookingId: string, priestId: string} | null> => {
//     try {
//       // Get nearby priests (within 10km)
//       const nearbyPriests = await getPriestsByLocation(
//         userLatitude,
//         userLongitude,
//         10
//       );
      
//       if (nearbyPriests.length === 0) {
//         // If no priests within 10km, expand the search to 50km
//         const widePriests = await getPriestsByLocation(
//           userLatitude,
//           userLongitude,
//           50
//         );
        
//         if (widePriests.length === 0) {
//           return null; // No priests available
//         }
        
//         // Check priest availability
//         const availablePriest = findAvailablePriest(widePriests, bookingData.serviceDate, bookingData.startTime, bookingData.endTime);
        
//         if (!availablePriest) {
//           return null; // No priests available
//         }
        
//         // Create booking with the chosen priest
//         const bookingId = await createBooking(userId, availablePriest.id, bookingData);
        
//         return {
//           bookingId,
//           priestId: availablePriest.id
//         };
//       }
      
//       // Check priest availability
//       const availablePriest = findAvailablePriest(nearbyPriests, bookingData.serviceDate, bookingData.startTime, bookingData.endTime);
      
//       if (!availablePriest) {
//         return null; // No priests available
//       }
      
//       // Create booking with the chosen priest
//       const bookingId = await createBooking(userId, availablePriest.id, bookingData);
      
//       return {
//         bookingId,
//         priestId: availablePriest.id
//       };
//     } catch (error) {
//       console.error('Error finding and assigning priest:', error);
//       throw error;
//     }
//   };
  
//   // Helper function to find available priest based on date and time
//   const findAvailablePriest = (
//     priests: any[],
//     serviceDate: Date,
//     startTime: string,
//     endTime: string
//   ) => {
//     // TODO: Implement more sophisticated logic to check priest availability
//     // For now, return the first priest in the list (which is sorted by proximity)
//     return priests.length > 0 ? priests[0] : null;
//   };
  
//   // Get a booking by ID
//   export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
//     try {
//       const bookingRef = doc(db, 'bookings', bookingId);
//       const bookingDoc = await getDoc(bookingRef);
      
//       if (bookingDoc.exists()) {
//         const data = bookingDoc.data();
//         return {
//           id: bookingDoc.id,
//           ...data,
//           serviceDate: data.serviceDate.toDate(),
//           createdAt: data.createdAt.toDate(),
//           updatedAt: data.updatedAt.toDate(),
//         } as Booking;
//       }
      
//       return null;
//     } catch (error) {
//       console.error('Error getting booking by ID:', error);
//       throw error;
//     }
//   };
  
//   // Get user bookings
//   export const getUserBookings = async (
//     userId: string,
//     status?: BookingStatus,
//     limitCount: number = 10,
//     lastDoc?: DocumentSnapshot
//   ): Promise<{
//     bookings: Booking[],
//     lastDoc: DocumentSnapshot | null
//   }> => {
//     try {
//       let bookingsQuery;
      
//       if (status) {
//         bookingsQuery = query(
//           collection(db, 'bookings'),
//           where('userId', '==', userId),
//           where('status', '==', status),
//           orderBy('serviceDate', 'desc'),
//           limit(limitCount)
//         );
//       } else {
//         bookingsQuery = query(
//           collection(db, 'bookings'),
//           where('userId', '==', userId),
//           orderBy('serviceDate', 'desc'),
//           limit(limitCount)
//         );
//       }
      
//       // If we have a last document, start after it for pagination
//       if (lastDoc) {
//         if (status) {
//           bookingsQuery = query(
//             collection(db, 'bookings'),
//             where('userId', '==', userId),
//             where('status', '==', status),
//             orderBy('serviceDate', 'desc'),
//             startAfter(lastDoc),
//             limit(limitCount)
//           );
//         } else {
//           bookingsQuery = query(
//             collection(db, 'bookings'),
//             where('userId', '==', userId),
//             orderBy('serviceDate', 'desc'),
//             startAfter(lastDoc),
//             limit(limitCount)
//           );
//         }
//       }
      
//       const bookingsSnapshot = await getDocs(bookingsQuery);
//       const bookings: Booking[] = [];
      
//       bookingsSnapshot.forEach((doc) => {
//         const data = doc.data();
//         bookings.push({
//           id: doc.id,
//           ...data,
//           serviceDate: data.serviceDate.toDate(),
//           createdAt: data.createdAt.toDate(),
//           updatedAt: data.updatedAt.toDate(),
//         } as Booking);
//       });
      
//       const newLastDoc = bookingsSnapshot.docs.length > 0 
//         ? bookingsSnapshot.docs[bookingsSnapshot.docs.length - 1] 
//         : null;
      
//       return {
//         bookings,
//         lastDoc: newLastDoc
//       };Snapshot.docs.length > 0 
//         ? bookingsSnapshot.docs[bookingsSnapshot.docs.length - 1] 
//         : null;
      
//       return {
//         bookings,
//         lastDoc: newLastDoc
//       };
//     } catch (error) {
//       console.error('Error getting user bookings:', error);
//       throw error;
//     }
//   };
  
//   // Get priest bookings
//   export const getPriestBookings = async (
//     priestId: string,
//     status?: BookingStatus,
//     limitCount: number = 10,
//     lastDoc?: DocumentSnapshot
//   ): Promise<{
//     bookings: Booking[],
//     lastDoc: DocumentSnapshot | null
//   }> => {
//     try {
//       let bookingsQuery;
      
//       if (status) {
//         bookingsQuery = query(
//           collection(db, 'bookings'),
//           where('priestId', '==', priestId),
//           where('status', '==', status),
//           orderBy('serviceDate', 'desc'),
//           limit(limitCount)
//         );
//       } else {
//         bookingsQuery = query(
//           collection(db, 'bookings'),
//           where('priestId', '==', priestId),
//           orderBy('serviceDate', 'desc'),
//           limit(limitCount)
//         );
//       }
      
//       // If we have a last document, start after it for pagination
//       if (lastDoc) {
//         if (status) {
//           bookingsQuery = query(
//             collection(db, 'bookings'),
//             where('priestId', '==', priestId),
//             where('status', '==', status),
//             orderBy('serviceDate', 'desc'),
//             startAfter(lastDoc),
//             limit(limitCount)
//           );
//         } else {
//           bookingsQuery = query(
//             collection(db, 'bookings'),
//             where('priestId', '==', priestId),
//             orderBy('serviceDate', 'desc'),
//             startAfter(lastDoc),
//             limit(limitCount)
//           );
//         }
//       }
      
//       const bookingsSnapshot = await getDocs(bookingsQuery);
//       const bookings: Booking[] = [];
      
//       bookingsSnapshot.forEach((doc) => {
//         const data = doc.data();
//         bookings.push({
//           id: doc.id,
//           ...data,
//           serviceDate: data.serviceDate.toDate(),
//           createdAt: data.createdAt.toDate(),
//           updatedAt: data.updatedAt.toDate(),
//         } as Booking);
//       });
      
//       const newLastDoc = bookings