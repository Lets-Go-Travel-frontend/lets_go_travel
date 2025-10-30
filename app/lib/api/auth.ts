const API_BASE_URL = "/api/proxy";

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// export interface VerifyData {
//   access_token?: string;
//   email: string;
//   code: string;
//   operation_type: 'email_verification' | 'forgot_password';
//   new_password?: string;
// }
export enum OperationType {
  EMAIL_VERIFICATION = "email_verification",
  FORGOT_PASSWORD = "forgot_password",
  CHANGE_PASSWORD = "change_password",
  TOKEN_REFRESH = "token_refresh",
}

export type EmailVerificationData = {
  email: string;
  access_token: string;
  code: string;
  operation_type?: OperationType.EMAIL_VERIFICATION;
};

export type ForgotPasswordData = {
  email: string;
  code: string;
  new_password: string;
  operation_type: OperationType.FORGOT_PASSWORD;
};

export type VerifyData = EmailVerificationData | ForgotPasswordData;

export interface RefreshTokenData {
  refresh_token?: string;
  current_password?: string;
  new_password?: string;
  resend_verification?: string;
  email?: string;
  code?: string;
  operation?: OperationType.CHANGE_PASSWORD | OperationType.TOKEN_REFRESH | OperationType.FORGOT_PASSWORD;
}

export interface StandardResponse {
  success: boolean;
  data?: any;
  message?: string;
  timestamp: string;
  correlation_id?: string;
}

export interface ErrorResponse {
  success: boolean;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  correlation_id?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
  } = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  let body: string | undefined;
  if (options.body && typeof options.body === "object") {
    body = JSON.stringify(options.body);
  } else if (options.body) {
    body = options.body;
  }

  const config: RequestInit = {
    method: options.method,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    body: body,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de red desconocido");
  }
}

export async function registerUser(data: RegisterData): Promise<StandardResponse> {
  const requestBody = {
    email: data.email.trim(),
    password: data.password,
    first_name: data.firstName.trim(),
    last_name: data.lastName.trim(),
    phone: data.phone?.trim(),
  };

  return apiRequest<StandardResponse>("/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(requestBody), // Omitir requestBody, // Usar apiRequest consistentemente
    // body: requestBody,
  });
}

export async function loginUser(data: LoginData): Promise<StandardResponse> {
  const requestBody = {
    email: data.email.trim(),
    password: data.password,
  };

  return apiRequest<StandardResponse>("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(requestBody), // Omitir requestBody,
  });
}

export async function verifyUser(data: VerifyData): Promise<StandardResponse> {
  const requestBody: any = {
    email: data.email.trim(),
    code: data.code,
    operation_type: data.operation_type,
  };

  if (data.operation_type === "email_verification") {
    requestBody.access_token = data.access_token;
  } else if (data.operation_type === "forgot_password") {
    requestBody.new_password = data.new_password;
  }

  return apiRequest<StandardResponse>("/v1/auth/verify", {
    method: "POST",
    body: JSON.stringify(requestBody), // Omitir requestBody,
  });
}

export async function forgotPassword(data: ForgotPasswordData): Promise<StandardResponse> {
  const requestBody = {
    email: data.email,
    code: data.code,
    new_password: data.new_password,
    operation_type: data.operation_type,
  };

  return apiRequest<StandardResponse>("/v1/auth/verify", {
    method: "POST",
    body: requestBody,
  });
}

export async function refreshToken(data: RefreshTokenData): Promise<StandardResponse> {
  const requestBody = {
    refresh_token: data.refresh_token,
    current_password: data.current_password,
    new_password: data.new_password,
    resend_verification: data.resend_verification,
    email: data.email,
    code: data.code,
    operation: data.operation,
  };

  return apiRequest<StandardResponse>("/v1/auth/refresh", {
    method: "POST",
    body: requestBody,
  });
}

export async function logoutUser(): Promise<StandardResponse> {
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("access_token");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = token;
  }

  return apiRequest<StandardResponse>("/v1/auth/logout", {
    method: "POST",
    headers,
  });
}

export default {
  registerUser,
  loginUser,
  verifyUser,
  forgotPassword,
  refreshToken,
  logoutUser,
};
