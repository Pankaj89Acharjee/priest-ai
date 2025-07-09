'use client';

import React, { useEffect } from 'react';
import { z } from "zod";
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth';
import Link from 'next/link';
import { useLoginStore } from '@/lib/store/loginStore';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '@/components/FormField';
import { Form } from '@/components/ui/form';

const loginFormSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long')
});

type LoginFormData = z.infer<typeof loginFormSchema>;

const LoginPage = () => {
  const router = useRouter();
  const { isLoading, setLoading } = useLoginStore();
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Reset form when component unmounts
  useEffect(() => {
    return () => form.reset();
  }, [form]);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    try {
      const userCredential = await signIn(data.email, data.password);
      router.push(`/dashboard/${userCredential.user.uid}`);
    } catch (err: any) {
      // Handle Firebase specific errors
      let errorMessage = 'Failed to sign in';

      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
      }
      form.setError('email', { message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl text-gray-900 dark:text-slate-50 font-semibold">
            Sign in to your account
          </h2>
        </div>
        <Form {...form}>
          <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                label="Email address"
                type="email"
                placeholder="Enter your email"
              />
              <div className="relative">
                <FormField
                  control={form.control}
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-8 text-gray-500 dark:text-gray-400 focus:outline-none"
                >
                  {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-indigo-500 hover:text-indigo-600">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="text-sm text-center">
              <Link href="/auth/register" className="font-medium text-indigo-500 hover:text-indigo-600">
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
