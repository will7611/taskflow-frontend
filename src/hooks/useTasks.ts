import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import {
  getTasksRequest,
  createTaskRequest,
  updateTaskRequest,
  completeTaskRequest,
  deleteTaskRequest,
  pendingTaskRequest,
  type Task,
  type CreateTaskDTO,
  type UpdateTaskDTO,
} from '@/services/task.service';

/*
 * La API puede devolver las tareas directamente como array
 * o dentro de un objeto paginado.
 *
 * Esta función normaliza ambas posibilidades para que
 * el resto de la aplicación siempre trabaje con Task[].
 */
function normalizeTasks(data: unknown): Task[] {
  if (Array.isArray(data)) {
    return data as Task[];
  }

  if (
    data &&
    typeof data === 'object'
  ) {
    const response = data as Record<string, unknown>;

    if (Array.isArray(response.tasks)) {
      return response.tasks as Task[];
    }

    if (Array.isArray(response.rows)) {
      return response.rows as Task[];
    }

    if (Array.isArray(response.data)) {
      return response.data as Task[];
    }

    if (Array.isArray(response.items)) {
      return response.items as Task[];
    }

    if (Array.isArray(response.results)) {
      return response.results as Task[];
    }
  }

  console.warn(
    '[useTasks] Formato de respuesta no reconocido:',
    data
  );

  return [];
}

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] =
    useState<boolean>(false);
  const [error, setError] =
    useState<string | null>(null);

  /*
   * ============================================================
   * OBTENER TAREAS
   * ============================================================
   */

  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      setTasks([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response =
        await getTasksRequest(projectId);

      const normalizedTasks =
        normalizeTasks(response.data);

      setTasks(normalizedTasks);

      console.log(
        '[useTasks] Tareas obtenidas:',
        normalizedTasks
      );
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al cargar las tareas';

      setError(msg);
      setTasks([]);

      toast.error(msg);

      console.error(
        '[useTasks] Error al obtener tareas:',
        err
      );
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  /*
   * ============================================================
   * CARGA INICIAL
   * ============================================================
   */

  useEffect(() => {
    let ignore = false;

    if (!projectId) {
      setTasks([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const loadInitialTasks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getTasksRequest(projectId);

        const normalizedTasks =
          normalizeTasks(response.data);

        if (!ignore) {
          setTasks(normalizedTasks);

          console.log(
            '[useTasks] Tareas cargadas:',
            normalizedTasks
          );
        }
      } catch (err) {
        if (!ignore) {
          const msg =
            err instanceof Error
              ? err.message
              : 'Error al cargar las tareas';

          setError(msg);
          setTasks([]);

          console.error(
            '[useTasks] Error en carga inicial:',
            err
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadInitialTasks();

    return () => {
      ignore = true;
    };
  }, [projectId]);

  /*
   * ============================================================
   * CREAR TAREA
   * ============================================================
   */

  const addTask = async (
    data: CreateTaskDTO
  ) => {
    if (!projectId) {
      const errorMessage =
        'No hay un proyecto seleccionado';

      toast.error(errorMessage);

      throw new Error(errorMessage);
    }

    try {
      const response =
        await createTaskRequest(
          projectId,
          data
        );

      setTasks((prev) => [
        response.data,
        ...prev,
      ]);

      toast.success(
        'Tarea creada con éxito'
      );

      return response.data;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al crear la tarea';

      toast.error(msg);

      throw err;
    }
  };

  /*
   * ============================================================
   * CAMBIAR ESTADO
   * ============================================================
   */

  const toggleTask = async (
    id: string
  ) => {
    if (!projectId) {
      toast.error(
        'No hay un proyecto seleccionado'
      );

      return;
    }

    try {
      const currentTask =
        tasks.find(
          (task) => task.id === id
        );

      if (!currentTask) {
        throw new Error(
          'Tarea no encontrada'
        );
      }

      const response =
        currentTask.completed
          ? await pendingTaskRequest(
              projectId,
              id
            )
          : await completeTaskRequest(
              projectId,
              id
            );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? response.data
            : task
        )
      );

      if (response.data.completed) {
        toast.success(
          '¡Tarea completada!'
        );
      } else {
        toast.info(
          'Tarea marcada como pendiente'
        );
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al cambiar el estado de la tarea';

      toast.error(msg);

      console.error(
        '[useTasks] Error al cambiar estado:',
        err
      );
    }
  };

  /*
   * ============================================================
   * EDITAR TAREA
   * ============================================================
   */

  const editTask = async (
    id: string,
    data: UpdateTaskDTO
  ) => {
    if (!projectId) {
      const errorMessage =
        'No hay un proyecto seleccionado';

      toast.error(errorMessage);

      throw new Error(errorMessage);
    }

    try {
      const response =
        await updateTaskRequest(
          projectId,
          id,
          data
        );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? response.data
            : task
        )
      );

      toast.success(
        'Tarea actualizada correctamente'
      );

      return response.data;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al actualizar la tarea';

      toast.error(msg);

      throw err;
    }
  };

  /*
   * ============================================================
   * ELIMINAR TAREA
   * ============================================================
   */

  const removeTask = async (
    id: string
  ) => {
    if (!projectId) {
      const errorMessage =
        'No hay un proyecto seleccionado';

      toast.error(errorMessage);

      throw new Error(errorMessage);
    }

    try {
      await deleteTaskRequest(
        projectId,
        id
      );

      setTasks((prev) =>
        prev.filter(
          (task) => task.id !== id
        )
      );

      toast.success(
        'Tarea eliminada del sistema'
      );
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al eliminar la tarea';

      toast.error(msg);

      throw err;
    }
  };

  /*
   * ============================================================
   * RETORNO
   * ============================================================
   */

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    toggleTask,
    editTask,
    removeTask,
  };
}