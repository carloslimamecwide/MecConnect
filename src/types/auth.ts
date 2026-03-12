export interface User {
  cv: string;
  nome: string;
  data_nasc?: string;
  prof_email: string;
  pers_email?: string;
  pers_phone?: string;
  prof_phone?: string;
  bi?: string;
  data_val_bi?: string;
  country?: string;
  address?: string;
  location?: string;
  city?: string;
  cod_postal?: string;
  nationality?: string;
  district?: string;
  fcy?: string;
  job?: string;
  desc_job?: string;
  accessHolidays?: boolean;
  accessAwayOn?: boolean;
  photo?: string | null;
}

// export type User = AuthMeResponse;

// export interface BackendLoginResponse {
//   cv: string;
//   nome: string;
//   prof_email: string;
//   bi: string;
//   country: string;
//   address: string;
//   location: string;
//   city: string;
//   nationality: string;
//   district: string;
//   job: string;
//   desc_job: string;
//   photo: string | null;
//   token: string;
//   accessHolidays?: boolean;
//   accessAwayOn?: boolean;
// }

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
