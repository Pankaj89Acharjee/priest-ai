'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { getUserProfile } from '@/lib/auth';
import { UserProfile} from '@/types/user';
import { PriestProfile } from '@/types/priest';

const DashboardPage = () => {
    const params = useParams();
    const [userProfile, setUserProfile] = useState<UserProfile | PriestProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Get current user
                const currentUser = auth.currentUser;

                // Verify that the userId in the URL matches the current user
                if (!currentUser || currentUser.uid !== params.userId) {
                    setError('Unauthorized access');
                    return;
                }

                // Fetch user profile
                const profile = await getUserProfile(currentUser.uid);
                setUserProfile(profile);
            } catch (err) {
                setError('Failed to load profile');
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [params.userId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Profile not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold">Profile Information</h2>
                            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm text-gray-500">Display Name</p>
                                    <p className="mt-1">{userProfile.displayName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="mt-1">{userProfile.email}</p>
                                </div>
                            </div>
                        </div>

                        {'isPriest' in userProfile && userProfile.isPriest && (
                            <div className="mt-6">
                                <h2 className="text-lg font-semibold">Priest Information</h2>
                                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-gray-500">Experience</p>
                                        <p className="mt-1">{userProfile.experience} years</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Rating</p>
                                        <p className="mt-1">{userProfile.rating.toFixed(1)} / 5.0</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Reviews</p>
                                        <p className="mt-1">{userProfile.reviewCount} reviews</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;