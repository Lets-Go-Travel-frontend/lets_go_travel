// lib/api/auth.ts

// Cambiamos la URL para usar el proxy local
const API_BASE_URL = '/api/proxy';

// Interfaces para las requests
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

export interface VerifyData {
  access_token: string;
  email: string;
  code: string;
}

// Interfaces para las responses (basadas en el Swagger)
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

// Función helper para hacer requests
// lib/api/auth.ts

// ... interfaces y constantes igual ...

// Función helper para hacer requests - CORREGIDA
async function apiRequest<T>(
  endpoint: string, 
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: any; // ← Permitimos any aquí
  } = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Convertir body a JSON string si es un objeto
  let body: string | undefined;
  if (options.body && typeof options.body === 'object') {
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
    throw new Error('Error de red desconocido');
  }
}

// REGISTER - Endpoint real (usando apiRequest consistentemente)
export async function registerUser(data: RegisterData): Promise<StandardResponse> {
  const requestBody = {
    email: data.email.trim(),
    password: data.password,
    first_name: data.firstName.trim(),
    last_name: data.lastName.trim(),
    //  Omitir phone temporalmente por bug en el backend
  };


  return apiRequest<StandardResponse>('/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(requestBody), // Omitir requestBody, // Usar apiRequest consistentemente
  });
}

// LOGIN - Endpoint real
export async function loginUser(data: LoginData): Promise<StandardResponse> {
  const requestBody = {
    email: data.email.trim(),
    password: data.password,
  };


  return apiRequest<StandardResponse>('/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(requestBody), // Omitir requestBody,
  });
}

// VERIFY - Nuevo endpoint para verificación
export async function verifyUser(data: VerifyData): Promise<StandardResponse> {
  const requestBody = {
    access_token: data.access_token,
    email: data.email,
    code: data.code,
  };


  return apiRequest<StandardResponse>('/v1/auth/verify', {
    method: 'POST',
    body: JSON.stringify(requestBody), // Omitir requestBody,
  });
}

// LOGOUT - Endpoint real
export async function logoutUser(): Promise<StandardResponse> {
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('access_token');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = token;
  }

  return apiRequest<StandardResponse>('/v1/auth/logout', {
    method: 'POST',
    headers,
  });
}

// REFRESH TOKEN - Endpoint real
export async function refreshToken(): Promise<StandardResponse> {
  return apiRequest<StandardResponse>('/v1/auth/refresh', {
    method: 'POST',
  });
}

// Exportar todo como objeto por si acaso
export default {
  registerUser,
  loginUser,
  verifyUser,
  logoutUser,
  refreshToken
};