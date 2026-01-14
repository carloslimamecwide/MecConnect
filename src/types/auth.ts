export type User = {
  cv: string;
  nome: string;
  email_prof: string;
  ax2: string;
  desc_ax2: string;
  rc: string;
  desc_job?: string;
};

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
}

export interface LoginResponse {
  user: User;
  token: string;
  isAdminUser: boolean;
  isSuperAdminUser: boolean;
}

export interface LoginCredentials {
  user_cv: string;
  password: string;
}
