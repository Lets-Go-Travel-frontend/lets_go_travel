"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyUser,
  forgotPassword,
  refreshToken,
  OperationType,
  registerAgent as apiRegisterAgent,
  RegisterAgentData,
} from "@/lib/api/auth";

// Interfaces para los tipos de respuesta
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    user_type: string;
    email_verified: boolean;
  };
}

interface UserInfo {
  email: string;
  firstName: string;
  lastName: string;
  userId: string;
  userType: string;
  emailVerified: boolean;
  needsVerification?: boolean;
  verifiedAt?: string;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse = await registerUser(data);

      if (response.success) {
        await login({
          email: data.email,
          password: data.password,
        });

        return response;
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    data: {
      email: string;
      password: string;
    },
    onSuccess?: () => void
  ): Promise<ApiResponse<AuthResponse>> => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<AuthResponse> = await loginUser(data);

      if (response.success) {
        const accessToken = response.data?.access_token;
        const userData = response.data?.user;
        const refreshToken = response.data?.refresh_token;

        if (accessToken && userData && refreshToken) {
          sessionStorage.setItem("pending_verification_token", accessToken);
          sessionStorage.setItem("pending_verification_email", data.email);
          sessionStorage.setItem("pending_user_data", JSON.stringify(userData));

          if (!userData.email_verified) {
            router.push(
              `/auth/verify?email=${encodeURIComponent(data.email)}&access_token=${encodeURIComponent(accessToken)}`
            );
          } else {
            const userInfo: UserInfo = {
              email: userData.email,
              firstName: userData.first_name,
              lastName: userData.last_name,
              userId: userData.user_id,
              userType: userData.user_type,
              emailVerified: true,
              needsVerification: false,
            };

            localStorage.setItem("current_user", JSON.stringify(userInfo));
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);

            if (onSuccess) {
              onSuccess();
            }

            router.push("/");
          }
        } else {
          throw new Error("Invalid response data from server");
        }

        return response;
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (err) {
      let errorMessage = "Error de inicio de sesión";

      if (err instanceof Error) {
        if (
          err.message.includes("401") ||
          err.message.includes("Unauthorized") ||
          err.message.includes("invalid") ||
          err.message.includes("credenciales") ||
          err.message.toLowerCase().includes("password") ||
          err.message.toLowerCase().includes("email")
        ) {
          errorMessage = "Usuario o contraseña incorrectos";
        } else if (err.message.includes("429")) {
          errorMessage = "Demasiados intentos. Por favor, espera unos minutos.";
        } else if (err.message.includes("400")) {
          errorMessage = "Datos de inicio de sesión inválidos";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verify = async (data: { access_token: string; email: string; code: string }): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse = await verifyUser({
        access_token: data.access_token,
        email: data.email,
        code: data.code,
        operation_type: OperationType.EMAIL_VERIFICATION,
      });

      if (response.success) {
        const pendingUserData = sessionStorage.getItem("pending_user_data");
        const pendingToken = sessionStorage.getItem("pending_verification_token");

        if (pendingUserData && pendingToken) {
          const userData = JSON.parse(pendingUserData);

          const userInfo: UserInfo = {
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name,
            userId: userData.user_id,
            userType: userData.user_type,
            emailVerified: true,
            needsVerification: false,
            verifiedAt: new Date().toISOString(),
          };

          localStorage.setItem("current_user", JSON.stringify(userInfo));
          localStorage.setItem("access_token", pendingToken);

          sessionStorage.removeItem("pending_verification_token");
          sessionStorage.removeItem("pending_verification_email");
          sessionStorage.removeItem("pending_user_data");
        }

        router.push("/");

        return response;
      } else {
        throw new Error(response.message || "Verification failed");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Verification failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse = await refreshToken({
        email: email,
        operation: OperationType.FORGOT_PASSWORD,
      });

      if (response.success) {
        sessionStorage.setItem("reset_password_email", email);
        return response;
      } else {
        throw new Error(response.message || "Failed to send reset code");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send reset code";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data: { email: string; code: string; new_password: string }): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse = await verifyUser({
        email: data.email,
        code: data.code,
        new_password: data.new_password,
        operation_type: OperationType.FORGOT_PASSWORD,
      });

      if (response.success) {
        sessionStorage.removeItem("reset_password_email");
        sessionStorage.removeItem("reset_code_verified");
        sessionStorage.removeItem("reset_code");
        return response;
      } else {
        throw new Error(response.message || "Failed to reset password");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reset password";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data: { current_password: string; new_password: string }): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      const refreshTokenValue = localStorage.getItem("refresh_token");

      const response: ApiResponse = await refreshToken({
        refresh_token: refreshTokenValue || undefined,
        current_password: data.current_password,
        new_password: data.new_password,
        operation: OperationType.CHANGE_PASSWORD,
      });

      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || "Failed to change password");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to change password";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      const refreshTokenValue = localStorage.getItem("refresh_token");

      const response: ApiResponse = await refreshToken({
        refresh_token: refreshTokenValue || undefined,
        resend_verification: "True",
        operation: OperationType.TOKEN_REFRESH,
      });

      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || "Failed to resend verification code");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to resend verification code";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse = await logoutUser();

      if (response.success) {
        // Logout exitoso
      }
    } catch (err) {
      // Ignorar errores en logout para asegurar limpieza
    } finally {
      localStorage.removeItem("current_user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      sessionStorage.removeItem("pending_verification_token");
      sessionStorage.removeItem("pending_verification_email");
      sessionStorage.removeItem("pending_user_data");

      setLoading(false);

      router.push("/");
      router.refresh();
    }
  };

  const registerAgent = async (data: RegisterAgentData): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse = await apiRegisterAgent(data);
      
      if (response.success) {
        router.push('/auth/login');
        return response;
      } else {
        throw new Error(response.message || 'Agent registration failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Agent registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUser = (): UserInfo | null => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("current_user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  };

  const getAccessToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  };

  const isUserVerified = (): boolean => {
    const user = getCurrentUser();
    return user ? user.emailVerified : false;
  };

  const hasPendingVerification = (): boolean => {
    if (typeof window !== "undefined") {
      return !!sessionStorage.getItem("pending_verification_token");
    }
    return false;
  };

  const getPendingVerificationData = (): { token: string | null; email: string | null; userData: any } => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("pending_verification_token");
      const email = sessionStorage.getItem("pending_verification_email");
      const userData = sessionStorage.getItem("pending_user_data");

      return {
        token,
        email,
        userData: userData ? JSON.parse(userData) : null,
      };
    }
    return { token: null, email: null, userData: null };
  };

  return {
    register,
    login,
    verify,
    logout,
    forgotPassword: requestPasswordReset,
    resetPassword,
    changePassword,
    resendVerification,
    registerAgent,
    getCurrentUser,
    getAccessToken,
    isUserVerified,
    hasPendingVerification,
    getPendingVerificationData,
    requestPasswordReset,
    loading,
    error,
  };
}