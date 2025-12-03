export interface User {
  cv: string;
  nome: string;
  prof_email: string;
  bi: string;
  country: string;
  address: string;
  location: string;
  city: string;
  nationality: string;
  district: string;
  job: string;
  desc_job: string;
  photo: string | null;
}

export interface Role {
  role: string;
  descRole: string;
  default: boolean;
}

export interface AccessApp {
  app: string;
  bd: string;
  roles: Role[];
}

export interface BackendLoginResponse {
  cv: string;
  nome: string;
  prof_email: string;
  bi: string;
  country: string;
  address: string;
  location: string;
  city: string;
  nationality: string;
  district: string;
  job: string;
  desc_job: string;
  photo: string | null;
  token: string;
  accessApps: AccessApp[];
}

export interface LoginResponse {
  user: User;
  token: string;
  accessApps: AccessApp[];
}

export interface LoginCredentials {
  user_cv: string;
  password: string;
}
