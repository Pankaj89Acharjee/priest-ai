// lib/priests.ts
import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    GeoPoint,
    orderBy,
    limit,
    startAfter,
    DocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { PriestProfile, TimeSlot } from '@/types/priest';
import { getUserProfile } from './auth';

// Get all priests
export const getAllPriests = async (
    limitCount: number = 10,
    lastDoc?: DocumentSnapshot
): Promise<{
    priests: PriestProfile[],
    lastDoc: DocumentSnapshot | null
}> => {
    try {
        let priestsQuery = query(
            collection(db, 'users'),
            where('isPriest', '==', true),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        // If we have a last document, start after it for pagination
        if (lastDoc) {
            priestsQuery = query(
                collection(db, 'users'),
                where('isPriest', '==', true),
                orderBy('createdAt', 'desc'),
                startAfter(lastDoc),
                limit(limitCount)
            );
        }

        const priestsSnapshot = await getDocs(priestsQuery);
        const priests: PriestProfile[] = [];

        priestsSnapshot.forEach((doc) => {
            const data = doc.data();
            priests.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as PriestProfile);
        });

        const newLastDoc = priestsSnapshot.docs.length > 0
            ? priestsSnapshot.docs[priestsSnapshot.docs.length - 1]
            : null;

        return {
            priests,
            lastDoc: newLastDoc
        };
    } catch (error) {
        console.error('Error getting priests:', error);
        throw error;
    }
};

// Get a priest by ID
export const getPriestById = async (priestId: string): Promise<PriestProfile | null> => {
    try {
        const priestProfile = await getUserProfile(priestId) as PriestProfile | null;

        if (priestProfile && priestProfile.isPriest) {
            return priestProfile;
        }

        return null;
    } catch (error) {
        console.error('Error getting priest by ID:', error);
        throw error;
    }
};

// Update priest profile
export const updatePriestProfile = async (
    priestId: string,
    profileData: Partial<PriestProfile>
): Promise<void> => {
    try {
        const priestRef = doc(db, 'users', priestId);

        await updateDoc(priestRef, {
            ...profileData,
            updatedAt: new Date(),
        });
    } catch (error) {
        console.error('Error updating priest profile:', error);
        throw error;
    }
};

// Update priest availability
export const updatePriestAvailability = async (
    priestId: string,
    day: keyof PriestProfile['availability'],
    timeSlots: TimeSlot[]
): Promise<void> => {
    try {
        const priestRef = doc(db, 'users', priestId);

        await updateDoc(priestRef, {
            [`availability.${day}`]: timeSlots,
            updatedAt: new Date(),
        });
    } catch (error) {
        console.error('Error updating priest availability:', error);
        throw error;
    }
};

// Calculate distance between two geo points (in kilometers)
const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Get priests by location (within a radius)
export const getPriestsByLocation = async (
    latitude: number,
    longitude: number,
    radiusInKm: number = 10,
    limitCount: number = 10
): Promise<PriestProfile[]> => {
    try {
        // Get all priests (we'll filter by distance later)
        const priestsQuery = query(
            collection(db, 'users'),
            where('isPriest', '==', true),
        );

        const priestsSnapshot = await getDocs(priestsQuery);
        const nearbyPriests: { priest: PriestProfile, distance: number }[] = [];

        priestsSnapshot.forEach((doc) => {
            const data = doc.data();

            // Skip priests without location data
            if (!data.location?.latitude || !data.location?.longitude) {
                return;
            }

            const distance = calculateDistance(
                latitude,
                longitude,
                data.location.latitude,
                data.location.longitude
            );

            // Only include priests within the specified radius
            if (distance <= radiusInKm) {
                nearbyPriests.push({
                    priest: {
                        id: doc.id,
                        ...data,
                        createdAt: data.createdAt?.toDate() || new Date(),
                        updatedAt: data.updatedAt?.toDate() || new Date(),
                    } as PriestProfile,
                    distance
                });
            }
        });

        // Sort by distance and limit results
        nearbyPriests.sort((a, b) => a.distance - b.distance);

        return nearbyPriests.slice(0, limitCount).map(item => item.priest);
    } catch (error) {
        console.error('Error getting priests by location:', error);
        throw error;
    }
};

// Get priests by service
export const getPriestsByService = async (
    serviceName: string,
    limitCount: number = 10
): Promise<PriestProfile[]> => {
    try {
        const priestsQuery = query(
            collection(db, 'users'),
            where('isPriest', '==', true),
            where('services', 'array-contains', serviceName),
            limit(limitCount)
        );

        const priestsSnapshot = await getDocs(priestsQuery);
        const priests: PriestProfile[] = [];

        priestsSnapshot.forEach((doc) => {
            const data = doc.data();
            priests.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as PriestProfile);
        });

        return priests;
    } catch (error) {
        console.error('Error getting priests by service:', error);
        throw error;
    }
};