import { create } from 'zustand';
import { z } from 'zod';

// Zod schema for registration form validation
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be less than 50 characters'),
  isPriest: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterState {
  formData: RegisterFormData;
  errors: Partial<Record<keyof RegisterFormData, string>>;
  isLoading: boolean;
  setField: (field: keyof RegisterFormData, value: any) => void;
  setError: (field: keyof RegisterFormData, error: string) => void;
  clearErrors: () => void;
  setLoading: (loading: boolean) => void;
  validateForm: () => boolean;
  resetForm: () => void;
}

const initialFormData: RegisterFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  displayName: '',
  isPriest: false,
};

export const useRegisterStore = create<RegisterState>((set, get) => ({
  formData: initialFormData,
  errors: {},
  isLoading: false,

  setField: (field, value) => {
    set((state) => ({
      formData: { ...state.formData, [field]: value },
      errors: { ...state.errors, [field]: undefined },
    }));
  },

  setError: (field, error) => {
    set((state) => ({
      errors: { ...state.errors, [field]: error },
    }));
  },

  clearErrors: () => {
    set({ errors: {} });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  validateForm: () => {
    try {
      registerSchema.parse(get().formData);
      set({ errors: {} });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        set({ errors: newErrors });
      }
      return false;
    }
  },

  resetForm: () => {
    set({
      formData: initialFormData,
      errors: {},
      isLoading: false,
    });
  },
})); 