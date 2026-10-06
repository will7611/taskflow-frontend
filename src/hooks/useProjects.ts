import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import {
  getProjectsRequest,
  createProjectRequest,
  updateProjectRequest,
  deleteProjectRequest,
  type Project,
  type CreateProjectDTO,
  type UpdateProjectDTO,
} from '@/services/project.service';

/**
 * Hook para gestionar los proyectos del usuario autenticado.
 */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtener todos los proyectos del usuario.
   */
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getProjectsRequest();

      setProjects(response.data);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al cargar los proyectos';

      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Cargar proyectos automáticamente al montar el componente.
   */
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  /**
   * Crear un proyecto.
   */
  const addProject = async (data: CreateProjectDTO) => {
    try {
      const response = await createProjectRequest(data);

      setProjects((prev) => [
        response.data,
        ...prev,
      ]);

      toast.success('Proyecto creado correctamente');

      return response.data;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al crear el proyecto';

      toast.error(msg);
      throw err;
    }
  };

  /**
   * Actualizar un proyecto.
   */
  const editProject = async (
    id: string,
    data: UpdateProjectDTO
  ) => {
    try {
      const response = await updateProjectRequest(id, data);

      setProjects((prev) =>
        prev.map((project) =>
          project.id === id
            ? response.data
            : project
        )
      );

      toast.success('Proyecto actualizado correctamente');

      return response.data;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al actualizar el proyecto';

      toast.error(msg);
      throw err;
    }
  };

  /**
   * Eliminar un proyecto.
   */
  const removeProject = async (id: string) => {
    try {
      await deleteProjectRequest(id);

      setProjects((prev) =>
        prev.filter((project) => project.id !== id)
      );

      toast.success('Proyecto eliminado correctamente');
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al eliminar el proyecto';

      toast.error(msg);
      throw err;
    }
  };

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    addProject,
    editProject,
    removeProject,
  };
}