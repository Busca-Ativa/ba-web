// Tipos para os dados de login
export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
  };
}

// Tipos para os dados de registro
export interface RegisterData {
  email: string;
  name: string;
  last_name: string;
  id_institution: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  data: {
    id: string;
    email: string;
    name: string;
    last_name: string;
  };
}
