export interface User {
  cv: string;
  job: string;
  name: string;
  photo: string | null;
}

export interface Role {
  role: string;
  descRole: string;
  default: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  roles: Role[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}
