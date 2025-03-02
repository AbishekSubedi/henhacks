import { FirebaseError } from 'firebase/app';
import axios, { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export const handleFirebaseError = (error: unknown): ApiError => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/user-not-found':
        return { message: 'User not found. Please check your credentials.', code: error.code };
      case 'auth/wrong-password':
        return { message: 'Invalid password. Please try again.', code: error.code };
      case 'auth/email-already-in-use':
        return {
          message: 'Email is already registered. Please use a different email.',
          code: error.code,
        };
      case 'auth/invalid-email':
        return { message: 'Invalid email format.', code: error.code };
      case 'auth/weak-password':
        return {
          message: 'Password is too weak. Please use a stronger password.',
          code: error.code,
        };
      default:
        return {
          message: 'An authentication error occurred. Please try again.',
          code: error.code,
          details: error.message,
        };
    }
  }
  return { message: 'An unexpected error occurred.' };
};

export const handleAxiosError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return {
      message: axiosError.response?.data?.message || 'An API error occurred.',
      code: axiosError.code,
      details: axiosError.response?.data,
    };
  }
  return { message: 'An unexpected error occurred.' };
};

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof FirebaseError) {
    return handleFirebaseError(error);
  }
  if (axios.isAxiosError(error)) {
    return handleAxiosError(error);
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'An unexpected error occurred.' };
};
