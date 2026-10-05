export type UserRole =
  | "Admin"
  | "Doctor"
  | "Receptionist"
  | "Patient";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: UserRole;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
}