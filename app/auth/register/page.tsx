'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/auth';
import Link from 'next/link';
import { useRegisterStore } from '@/lib/store/registerStore';

const RegisterPage = () => {
  const router = useRouter();
  const {
    formData,
    errors,
    isLoading,
    setField,
    setLoading,
    validateForm,
    resetForm,
  } = useRegisterStore();

  // Reset form when component unmounts
  useEffect(() => {
    return () => resetForm();
  }, [resetForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setField(name as keyof typeof formData, type === 'checkbox' ? checked : value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await registerUser(
        formData.email,
        formData.password,
        formData.displayName,
        formData.isPriest
      );
      router.push('/auth/login');
    } catch (err: any) {
      // Handle Firebase specific errors
      const errorMessage = err.code === 'auth/email-already-in-use'
        ? 'This email is already registered'
        : err.message || 'Failed to register';
      useRegisterStore.getState().setError('email', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="displayName" className="sr-only">Display Name</label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.displayName ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Display Name"
                value={formData.displayName}
                onChange={handleChange}
              />
              {errors.displayName && (
                <p className="mt-1 text-sm text-red-600">{errors.displayName}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="isPriest"
              name="isPriest"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={formData.isPriest}
              onChange={handleChange}
            />
            <label htmlFor="isPriest" className="ml-2 block text-sm text-gray-900">
              Register as a Priest
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;