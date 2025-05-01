import { create } from 'zustand';
import { z } from 'zod';

// Zod schema for login form validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginState {
  formData: LoginFormData;
  errors: Partial<Record<keyof LoginFormData, string>>;
  isLoading: boolean;
  setField: (field: keyof LoginFormData, value: string) => void;
  setError: (field: keyof LoginFormData, error: string) => void;
  clearErrors: () => void;
  setLoading: (loading: boolean) => void;
  validateForm: () => boolean;
  resetForm: () => void;
}

const initialFormData: LoginFormData = {
  email: '',
  password: '',
};

export const useLoginStore = create<LoginState>((set, get) => ({
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
      loginSchema.parse(get().formData);
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