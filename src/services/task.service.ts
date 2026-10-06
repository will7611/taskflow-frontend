import { apiFetch, type ApiResponse } from './api';

// Modelo de datos de una tarea
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: string;
  userId?: string;
  projectId?: string;
}

// Datos para crear una tarea
export interface CreateTaskDTO {
  title: string;
  description?: string;
}

// Datos para actualizar una tarea
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
}

/**
 * Obtener todas las tareas de un proyecto
 *
 * Backend:
 * GET /tasks/:projectId
 */
export async function getTasksRequest(
  projectId: string
): Promise<ApiResponse<Task[]>> {
  return apiFetch<Task[]>(`/tasks/${projectId}`);
}

/**
 * Crear una tarea dentro de un proyecto
 *
 * Backend:
 * POST /tasks/:projectId
 */
export async function createTaskRequest(
  projectId: string,
  taskData: CreateTaskDTO
): Promise<ApiResponse<Task>> {
  return apiFetch<Task>(`/tasks/${projectId}`, {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
}

/**
 * Actualizar una tarea
 *
 * Backend:
 * PATCH /tasks/:projectId
 *
 * El ID de la tarea va dentro del body.
 */
export async function updateTaskRequest(
  projectId: string,
  taskId: string,
  taskData: UpdateTaskDTO
): Promise<ApiResponse<Task>> {
  return apiFetch<Task>(`/tasks/${projectId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      id: taskId,
      ...taskData,
    }),
  });
}

/**
 * Marcar una tarea como completada
 *
 * Backend:
 * PATCH /tasks/:projectId/complete
 */
export async function completeTaskRequest(
  projectId: string,
  taskId: string
): Promise<ApiResponse<Task>> {
  return apiFetch<Task>(`/tasks/${projectId}/complete`, {
    method: 'PATCH',
    body: JSON.stringify({
      id: taskId,
    }),
  });
}

/**
 * Marcar una tarea como pendiente
 *
 * Backend:
 * PATCH /tasks/:projectId/pending
 */
export async function pendingTaskRequest(
  projectId: string,
  taskId: string
): Promise<ApiResponse<Task>> {
  return apiFetch<Task>(`/tasks/${projectId}/pending`, {
    method: 'PATCH',
    body: JSON.stringify({
      id: taskId,
    }),
  });
}

/**
 * Eliminar una tarea
 *
 * Backend:
 * DELETE /tasks/:projectId
 */
export async function deleteTaskRequest(
  projectId: string,
  taskId: string
): Promise<ApiResponse<null>> {
  return apiFetch<null>(`/tasks/${projectId}`, {
    method: 'DELETE',
    body: JSON.stringify({
      id: taskId,
    }),
  });
}