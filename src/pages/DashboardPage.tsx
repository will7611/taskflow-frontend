import { useEffect, useState } from 'react';

import { ProjectForm } from '@/components/projects/ProjectForm';
import { ProjectItem } from '@/components/projects/ProjectItem';

import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskSkeleton } from '@/components/tasks/TaskSkeleton';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';

import type { Project } from '@/services/project.service';
import type { Task } from '@/services/task.service';

import {
  AlertCircle,
  CheckCircle2,
  CheckSquare,
  Clock,
  FolderKanban,
  Inbox,
  ListTodo,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  /*
   * ============================================================
   * PROYECTOS
   * ============================================================
   */

  const {
    projects,
    isLoading: projectsLoading,
    error: projectsError,
    fetchProjects,
    addProject,
    editProject,
    removeProject,
  } = useProjects();

  const [selectedProjectId, setSelectedProjectId] =
    useState<string | null>(null);

  const selectedProject =
    projects.find(
      (project) => project.id === selectedProjectId
    ) ?? null;

  /*
   * Seleccionar automáticamente el primer proyecto.
   */
  useEffect(() => {
    if (projects.length === 0) {
      setSelectedProjectId(null);
      return;
    }

    const selectedProjectStillExists =
      selectedProjectId &&
      projects.some(
        (project) => project.id === selectedProjectId
      );

    if (!selectedProjectStillExists) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  /*
   * ============================================================
   * TAREAS
   * ============================================================
   */

  const {
    tasks,
    isLoading: tasksLoading,
    error: tasksError,
    fetchTasks,
    addTask,
    toggleTask,
    editTask,
    removeTask,
  } = useTasks(
    selectedProjectId ?? undefined
  );

  /*
   * ============================================================
   * MODALES
   * ============================================================
   */

  const [isCreateProjectOpen, setIsCreateProjectOpen] =
    useState(false);

  const [projectToEdit, setProjectToEdit] =
    useState<Project | null>(null);

  const [isCreateTaskOpen, setIsCreateTaskOpen] =
    useState(false);

  const [taskToEdit, setTaskToEdit] =
    useState<Task | null>(null);

  /*
   * ============================================================
   * MÉTRICAS
   * ============================================================
   */

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks =
    totalTasks - completedTasks;

  /*
   * ============================================================
   * PROYECTOS
   * ============================================================
   */

  const handleSelectProject = (
    project: Project
  ) => {
    setSelectedProjectId(project.id);
  };

  const handleCreateProject = async (
    data: {
      name: string;
      description: string;
    }
  ) => {
    const newProject = await addProject(data);

    setSelectedProjectId(newProject.id);
  };

  const handleEditProject = async (
    data: {
      name: string;
      description: string;
    }
  ) => {
    if (!projectToEdit) {
      return;
    }

    await editProject(
      projectToEdit.id,
      {
        name: data.name,
        description: data.description,
      }
    );

    setProjectToEdit(null);
  };

  const handleDeleteProject = async (
    project: Project
  ) => {
    const confirmed = window.confirm(
      `¿Deseas eliminar el proyecto "${project.name}"?`
    );

    if (!confirmed) {
      return;
    }

    await removeProject(project.id);

    if (selectedProjectId === project.id) {
      const remainingProjects =
        projects.filter(
          (item) => item.id !== project.id
        );

      setSelectedProjectId(
        remainingProjects[0]?.id ?? null
      );
    }
  };

  /*
   * ============================================================
   * ACTUALIZAR
   * ============================================================
   */

  const handleRefresh = async () => {
    await fetchProjects();

    if (selectedProjectId) {
      await fetchTasks();
    }
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
              <CheckSquare className="h-5 w-5" />
            </div>

            <span className="text-xl font-bold text-white">
              Task
              <span className="text-indigo-400">
                Flow
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-200">
                {user?.name || 'Usuario'}
              </p>

              <p className="text-xs text-slate-400">
                {user?.email}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-1.5 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />

              <span className="hidden sm:inline">
                Cerrar Sesión
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* ======================================================
          MAIN
      ======================================================= */}

      <main className="container mx-auto px-4 py-8 sm:px-8">

        {/* ====================================================
            CABECERA
        ===================================================== */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Panel de Proyectos y Tareas
            </h1>

            <p className="text-sm text-slate-400">
              Organiza tus proyectos y administra
              sus tareas desde un solo lugar.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={
                projectsLoading ||
                tasksLoading
              }
              className="gap-2 border-slate-800 text-slate-300 hover:bg-slate-900"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  projectsLoading ||
                  tasksLoading
                    ? 'animate-spin'
                    : ''
                }`}
              />

              Actualizar
            </Button>

            <Button
              onClick={() =>
                setIsCreateProjectOpen(true)
              }
              className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />

              Nuevo Proyecto
            </Button>
          </div>
        </div>

        {/* ====================================================
            PROYECTOS
        ===================================================== */}

        <section className="mb-8">

          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <FolderKanban className="h-5 w-5 text-indigo-400" />

                Mis Proyectos
              </h2>

              <p className="text-sm text-slate-400">
                Selecciona un proyecto para administrar
                sus tareas.
              </p>
            </div>

            <span className="text-sm text-slate-500">
              {projects.length} proyecto
              {projects.length !== 1
                ? 's'
                : ''}
            </span>
          </div>

          {/* LOADING */}

          {projectsLoading && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map(
                (_, index) => (
                  <Card
                    key={index}
                    className="border-slate-800 bg-slate-900/60"
                  >
                    <CardContent className="p-5">
                      <Skeleton className="h-5 w-40" />

                      <Skeleton className="mt-3 h-4 w-full" />

                      <Skeleton className="mt-2 h-4 w-3/4" />
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          )}

          {/* ERROR */}

          {!projectsLoading &&
            projectsError && (
              <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-rose-500" />

                  <div>
                    <h3 className="font-semibold text-rose-300">
                      Error al cargar proyectos
                    </h3>

                    <p className="text-sm text-rose-400/80">
                      {projectsError}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchProjects}
                  className="mt-4 border-rose-800 text-rose-300 hover:bg-rose-950"
                >
                  Reintentar
                </Button>
              </div>
            )}

          {/* SIN PROYECTOS */}

          {!projectsLoading &&
            !projectsError &&
            projects.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 py-12 text-center">
                <FolderKanban className="mx-auto h-10 w-10 text-slate-500" />

                <h3 className="mt-4 font-semibold text-slate-200">
                  No tienes proyectos
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Crea tu primer proyecto para
                  comenzar a administrar tareas.
                </p>

                <Button
                  onClick={() =>
                    setIsCreateProjectOpen(true)
                  }
                  className="mt-4 gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
                >
                  <Plus className="h-4 w-4" />

                  Crear proyecto
                </Button>
              </div>
            )}

          {/* LISTA */}

          {!projectsLoading &&
            !projectsError &&
            projects.length > 0 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map(
                  (project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      selected={
                        project.id ===
                        selectedProjectId
                      }
                      onSelect={
                        handleSelectProject
                      }
                      onEdit={
                        setProjectToEdit
                      }
                      onDelete={
                        handleDeleteProject
                      }
                    />
                  )
                )}
              </div>
            )}
        </section>

        {/* ====================================================
            PROYECTO SELECCIONADO
        ===================================================== */}

        {selectedProject && (
          <section>

            {/* CABECERA */}

            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <p className="text-xs font-medium tracking-wider text-indigo-400 uppercase">
                  Proyecto seleccionado
                </p>

                <h2 className="mt-1 text-2xl font-bold text-white">
                  {selectedProject.name}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {selectedProject.description ||
                    'Sin descripción'}
                </p>
              </div>

              <div className="flex gap-2">

                <Button
                  variant="outline"
                  onClick={() =>
                    setProjectToEdit(
                      selectedProject
                    )
                  }
                  className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Pencil className="h-4 w-4" />

                  Editar
                </Button>

                <Button
                  onClick={() =>
                    setIsCreateTaskOpen(true)
                  }
                  className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
                >
                  <Plus className="h-4 w-4" />

                  Nueva Tarea
                </Button>
              </div>
            </div>

            {/* ==================================================
                MÉTRICAS
            =================================================== */}

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

              <Card className="border-slate-800 bg-slate-900/60">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-400">
                    <ListTodo className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                      Total Tareas
                    </p>

                    {tasksLoading ? (
                      <Skeleton className="mt-1 h-8 w-12" />
                    ) : (
                      <p className="text-2xl font-bold text-slate-100">
                        {totalTasks}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/60">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                      Completadas
                    </p>

                    {tasksLoading ? (
                      <Skeleton className="mt-1 h-8 w-12" />
                    ) : (
                      <p className="text-2xl font-bold text-emerald-400">
                        {completedTasks}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/60">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-lg bg-amber-500/10 p-3 text-amber-400">
                    <Clock className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                      Pendientes
                    </p>

                    {tasksLoading ? (
                      <Skeleton className="mt-1 h-8 w-12" />
                    ) : (
                      <p className="text-2xl font-bold text-amber-400">
                        {pendingTasks}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* ==================================================
                TAREAS
            =================================================== */}

            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Tareas
                </h3>

                <p className="text-sm text-slate-400">
                  Administra las tareas de este proyecto.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchTasks}
                disabled={tasksLoading}
                className="gap-2 border-slate-800 text-slate-300 hover:bg-slate-900"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    tasksLoading
                      ? 'animate-spin'
                      : ''
                  }`}
                />

                Actualizar
              </Button>
            </div>

            {/* LOADING TAREAS */}

            {tasksLoading && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map(
                  (_, index) => (
                    <TaskSkeleton
                      key={index}
                    />
                  )
                )}
              </div>
            )}

            {/* ERROR TAREAS */}

            {!tasksLoading &&
              tasksError && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-rose-900/50 bg-rose-950/20 p-8 text-center">
                  <AlertCircle className="h-10 w-10 text-rose-500" />

                  <h3 className="mt-3 text-lg font-semibold text-rose-300">
                    Error al cargar tareas
                  </h3>

                  <p className="mt-1 max-w-md text-sm text-rose-400/80">
                    {tasksError}
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchTasks}
                    className="mt-4 border-rose-800 text-rose-300 hover:bg-rose-950"
                  >
                    Reintentar
                  </Button>
                </div>
              )}

            {/* SIN TAREAS */}

            {!tasksLoading &&
              !tasksError &&
              tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 py-16 text-center">
                  <div className="rounded-full bg-slate-800/80 p-4 text-slate-400">
                    <Inbox className="h-8 w-8" />
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-slate-200">
                    No hay tareas
                  </h3>

                  <p className="mt-1 max-w-sm text-sm text-slate-400">
                    Este proyecto todavía no tiene
                    tareas registradas.
                  </p>

                  <Button
                    onClick={() =>
                      setIsCreateTaskOpen(true)
                    }
                    className="mt-4 gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    <Plus className="h-4 w-4" />

                    Crear primera tarea
                  </Button>
                </div>
              )}

            {/* LISTA DE TAREAS */}

            {!tasksLoading &&
              !tasksError &&
              tasks.length > 0 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={removeTask}
                      onEdit={setTaskToEdit}
                    />
                  ))}
                </div>
              )}
          </section>
        )}
      </main>

      {/* ======================================================
          MODAL CREAR PROYECTO
      ======================================================= */}

      <ProjectForm
        open={isCreateProjectOpen}
        onOpenChange={
          setIsCreateProjectOpen
        }
        onSubmit={handleCreateProject}
      />

      {/* ======================================================
          MODAL EDITAR PROYECTO
      ======================================================= */}

      <ProjectForm
        open={Boolean(projectToEdit)}
        onOpenChange={(open) => {
          if (!open) {
            setProjectToEdit(null);
          }
        }}
        initialData={projectToEdit}
        onSubmit={handleEditProject}
      />

      {/* ======================================================
          MODAL CREAR TAREA
      ======================================================= */}

      <TaskForm
        open={isCreateTaskOpen}
        onOpenChange={
          setIsCreateTaskOpen
        }
        onSubmit={async (data) => {
          await addTask(data);
          setIsCreateTaskOpen(false);
        }}
      />

      {/* ======================================================
          MODAL EDITAR TAREA
      ======================================================= */}

      <TaskForm
        open={Boolean(taskToEdit)}
        onOpenChange={(open) => {
          if (!open) {
            setTaskToEdit(null);
          }
        }}
        initialData={taskToEdit}
        onSubmit={async (data) => {
          if (!taskToEdit) {
            return;
          }

          await editTask(
            taskToEdit.id,
            data
          );

          setTaskToEdit(null);
        }}
      />
    </div>
  );
}