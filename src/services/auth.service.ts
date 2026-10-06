import {
  apiFetch,
  type ApiResponse,
  type LoginResponseData,
  type RegisterResponseData,
} from './api';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

/**
 * Registrar un nuevo usuario.
 *
 * Endpoint:
 * POST /auth/register
 */
export async function registerRequest(
  credentials: RegisterDTO
): Promise<ApiResponse<RegisterResponseData>> {
  return apiFetch<RegisterResponseData>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Iniciar sesión.
 *
 * Endpoint:
 * POST /auth/login
 *
 * Retorna:
 * {
 *   token,
 *   user
 * }
 */
export async function loginRequest(
  credentials: LoginDTO
): Promise<ApiResponse<LoginResponseData>> {
  return apiFetch<LoginResponseData>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * NOTA:
 * El backend actual no tiene implementado:
 *
 * GET /auth/me
 *
 * Por eso no se incluye getMeRequest() aquí.
 */