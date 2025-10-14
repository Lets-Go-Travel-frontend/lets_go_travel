// REGISTER

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface RegisterResponse {
  success: boolean;
  data?: {
    user_id: number;
    cognito_user_id: string;
    email: string;
    confirmation_required: boolean;
  };
  error?: {
    code: string;
    message: string;
  };
  message: string;
  timestamp: string;
}

// MOCK API 
export async function registerUser(data: RegisterData): Promise<RegisterResponse> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Validación mock simple
  if (!data.email.includes('@')) {
    throw new Error('Invalid email format');
  }
  
  if (data.password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  // Verificar si el usuario ya existe (en localStorage)
  const existingUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
  const userExists = existingUsers.some((user: any) => user.email === data.email);
  
  if (userExists) {
    throw new Error('User already exists with this email');
  }
  
  // Crear nuevo usuario
  const newUser = {
    id: Date.now(),
    ...data,
    createdAt: new Date().toISOString(),
    searches: [],
    favorites: []
  };

  // Guardar en localStorage
  existingUsers.push(newUser);
  localStorage.setItem('mock_users', JSON.stringify(existingUsers));
  
  // Simular éxito
  return {
    success: true,
    data: {
      user_id: newUser.id,
      cognito_user_id: `mock_${newUser.id}`,
      email: data.email,
      confirmation_required: false
    },
    message: "User registered successfully",
    timestamp: new Date().toISOString()
  };
}

//LOGIN

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  data?: {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  error?: {
    code: string;
    message: string;
  };
  message: string;
  timestamp: string;
}

// Función MOCK para login
export async function loginUser(data: LoginData): Promise<LoginResponse> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Validación básica
  if (!data.email.includes('@')) {
    throw new Error('Invalid email format');
  }
  
  // Buscar usuario en localStorage
  const existingUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
  const user = existingUsers.find((u: any) => u.email === data.email);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Verificar contraseña (en un caso real esto se haría en el backend)
  if (user.password !== data.password) {
    throw new Error('Invalid password');
  }
  
  // Simular éxito
  return {
    success: true,
    data: {
      user_id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName
    },
    message: "Login successful",
    timestamp: new Date().toISOString()
  };
}