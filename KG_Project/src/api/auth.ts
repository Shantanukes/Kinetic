/**
 * Authentication API
 * All authentication-related API calls
 */

import { post, get } from './client';
import { API_ENDPOINTS, TOKEN_KEYS } from './config';

// Types
export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string | number;
    username: string;
    email: string;
    role: string;
    name?: string;
    permissions?: string[];
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// ============================================
// AUTHENTICATION API FUNCTIONS
// ============================================

/**
 * Login user
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    // TODO: Replace with actual API call
    // const response = await post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);

    // Mock response for development
    console.log('🔐 Login attempt:', credentials);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful login
    const mockResponse: LoginResponse = {
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      user: {
        id: 1,
        username: credentials.username,
        email: `${credentials.username}@kinetic.com`,
        role: 'SUPER_ADMIN', // This should come from backend
        name: 'Admin User',
        permissions: ['all'],
      },
    };

    // Store tokens and user data
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, mockResponse.accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, mockResponse.refreshToken);
    localStorage.setItem(TOKEN_KEYS.USER_DATA, JSON.stringify(mockResponse.user));

    return mockResponse;

    // Uncomment when backend is ready:
    // const response = await post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    // localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, response.accessToken);
    // localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, response.refreshToken);
    // localStorage.setItem(TOKEN_KEYS.USER_DATA, JSON.stringify(response.user));
    // return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    // TODO: Uncomment when backend is ready
    // await post(API_ENDPOINTS.AUTH.LOGOUT);

    // Clear local storage
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.USER_DATA);

    console.log('🚪 User logged out');
  } catch (error) {
    console.error('Logout error:', error);
    // Clear tokens even if API call fails
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.USER_DATA);
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (): Promise<{ accessToken: string }> => {
  try {
    const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // TODO: Uncomment when backend is ready
    // const response = await post<{ accessToken: string }>(
    //   API_ENDPOINTS.AUTH.REFRESH,
    //   { refreshToken }
    // );

    // Mock response
    const response = {
      accessToken: 'new_mock_access_token_' + Date.now(),
    };

    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, response.accessToken);

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

/**
 * Verify current token
 */
export const verifyToken = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);

    if (!token) {
      return false;
    }

    // TODO: Uncomment when backend is ready
    // await get(API_ENDPOINTS.AUTH.VERIFY_TOKEN);

    // Mock verification
    return true;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (request: ForgotPasswordRequest): Promise<void> => {
  try {
    // TODO: Uncomment when backend is ready
    // await post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, request);

    console.log('📧 Password reset email sent to:', request.email);
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (request: ResetPasswordRequest): Promise<void> => {
  try {
    // TODO: Uncomment when backend is ready
    // await post(API_ENDPOINTS.AUTH.RESET_PASSWORD, request);

    console.log('🔑 Password reset successful');
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

/**
 * Get current user from storage
 */
export const getCurrentUser = (): LoginResponse['user'] | null => {
  try {
    const userData = localStorage.getItem(TOKEN_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  return !!token;
};
