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
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Clonar las opciones para no mutar el original
  const processedOptions = { ...options };

  // Si el body es un objeto (y no es BodyInit válido), convertirlo a JSON
  if (processedOptions.body && 
      typeof processedOptions.body === 'object' && 
      !(processedOptions.body instanceof FormData) &&
      !(processedOptions.body instanceof Blob) &&
      !(processedOptions.body instanceof ArrayBuffer) &&
      !(processedOptions.body instanceof URLSearchParams)) {
    
    processedOptions.body = JSON.stringify(processedOptions.body);
  }

  const config = {
    ...processedOptions,
    headers: {
      ...defaultHeaders,
      ...processedOptions.headers,
    },
  };

  try {
    console.log('🔗 Haciendo request a:', url);
    console.log('📤 Body final:', config.body);
    
    const response = await fetch(url, config);
    console.log('📡 Status:', response.status);
    
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
    console.log('✅ Respuesta exitosa:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en apiRequest:', error);
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
    // ❌ Omitir phone temporalmente por bug en el backend
  };

  console.log('📤 Register request body:', requestBody);

  return apiRequest<StandardResponse>('/v1/auth/register', {
    method: 'POST',
    body: requestBody, // Usar apiRequest consistentemente
  });
}

// LOGIN - Endpoint real
export async function loginUser(data: LoginData): Promise<StandardResponse> {
  const requestBody = {
    email: data.email.trim(),
    password: data.password,
  };

  console.log('📤 Login request body:', requestBody);

  return apiRequest<StandardResponse>('/v1/auth/login', {
    method: 'POST',
    body: requestBody,
  });
}

// VERIFY - Nuevo endpoint para verificación
export async function verifyUser(data: VerifyData): Promise<StandardResponse> {
  const requestBody = {
    access_token: data.access_token,
    email: data.email,
    code: data.code,
  };

  console.log('📤 Verify request body:', requestBody);

  return apiRequest<StandardResponse>('/v1/auth/verify', {
    method: 'POST',
    body: requestBody,
  });
}

// LOGOUT - Endpoint real
export async function logoutUser(token?: string): Promise<StandardResponse> {
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