import { apiFetch, type ApiResponse } from './api';

export interface Project {
  id: string;
  name: string;
  description: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectDTO {
  name: string;
  description: string;
}

export interface UpdateProjectDTO {
  name: string;
  description: string;
  status?: string;
}

/**
 * Obtener todos los proyectos del usuario autenticado
 *
 * Backend:
 * GET /projects
 */
export async function getProjectsRequest(): Promise<ApiResponse<Project[]>> {
  return apiFetch<Project[]>('/projects');
}

/**
 * Obtener un proyecto por ID
 *
 * Backend:
 * GET /projects/:id
 */
export async function getProjectRequest(
  id: string
): Promise<ApiResponse<Project>> {
  return apiFetch<Project>(`/projects/${id}`);
}

/**
 * Crear proyecto
 *
 * Backend:
 * POST /projects
 */
export async function createProjectRequest(
  data: CreateProjectDTO
): Promise<ApiResponse<Project>> {
  return apiFetch<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Actualizar proyecto
 *
 * Backend:
 * PUT /projects/:id
 */
export async function updateProjectRequest(
  id: string,
  data: UpdateProjectDTO
): Promise<ApiResponse<Project>> {
  return apiFetch<Project>(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Eliminar proyecto
 *
 * Backend:
 * DELETE /projects/:id
 */
export async function deleteProjectRequest(
  id: string
): Promise<ApiResponse<null>> {
  return apiFetch<null>(`/projects/${id}`, {
    method: 'DELETE',
  });
}