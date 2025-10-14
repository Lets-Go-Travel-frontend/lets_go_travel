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