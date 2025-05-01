import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    updateProfile,
    User,
    UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from '@/types/user';
import { PriestProfile } from '@/types/priest';

// Register a new user
export const registerUser = async (
    email: string,
    password: string,
    displayName: string,
    isPriest: boolean = false
): Promise<UserCredential> => {
    try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Update display name
        await updateProfile(userCredential.user, {
            displayName,
        });

        // Create profile in Firestore
        await createUserProfile(userCredential.user, displayName, isPriest);

        return userCredential;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

// Create a user profile in Firestore
export const createUserProfile = async (
    user: User,
    displayName: string,
    isPriest: boolean = false
): Promise<void> => {
    const userRef = doc(db, 'users', user.uid);

    const baseProfile: Omit<UserProfile, 'id'> = {
        email: user.email || '',
        displayName,
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        profileImageUrl: user.photoURL || '',
    };

    if (isPriest) {
        const priestProfile: Omit<PriestProfile, 'id'> = {
            ...baseProfile,
            isPriest: true,
            biography: '',
            services: [],
            languages: [],
            experience: 0,
            rating: 0,
            reviewCount: 0,
            availability: {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: [],
            },
            baseRate: 0,
            additionalRates: {},
            verified: false,
            specializations: [],
        };

        await setDoc(userRef, priestProfile);
    } else {
        await setDoc(userRef, baseProfile);
    }
};

// Sign in a user
export const signIn = async (
    email: string,
    password: string
): Promise<UserCredential> => {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
};

// Sign out a user
export const signOut = async (): Promise<void> => {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};

// Get user profile from Firestore
export const getUserProfile = async (userId: string): Promise<UserProfile | PriestProfile | null> => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            return {
                id: userDoc.id,
                ...userData,
                createdAt: userData.createdAt?.toDate() || new Date(),
                updatedAt: userData.updatedAt?.toDate() || new Date(),
            } as UserProfile | PriestProfile;
        }

        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
};

// Update user profile
export const updateUserProfile = async (
    userId: string,
    profileData: Partial<UserProfile>
): Promise<void> => {
    try {
        const userRef = doc(db, 'users', userId);

        await updateDoc(userRef, {
            ...profileData,
            updatedAt: new Date(),
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
};