import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type {
  CreateProjectDTO,
  Project,
  UpdateProjectDTO,
} from '@/services/project.service';

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: CreateProjectDTO | UpdateProjectDTO
  ) => Promise<unknown>;
  initialData?: Project | null;
}

export function ProjectForm({
  open,
  onOpenChange,
  onSubmit,
  initialData = null,
}: ProjectFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name ?? '');
      setDescription(initialData.description ?? '');
    } else {
      setName('');
      setDescription('');
    }
  }, [initialData, open]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        ...(isEditing && initialData?.status
          ? { status: initialData.status }
          : {}),
      });

      setName('');
      setDescription('');
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="border-slate-800 bg-slate-900 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditing
              ? 'Editar proyecto'
              : 'Nuevo proyecto'}
          </DialogTitle>

          <DialogDescription className="text-slate-400">
            {isEditing
              ? 'Actualiza la información del proyecto.'
              : 'Crea un proyecto para organizar tus tareas.'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor="project-name"
              className="text-sm font-medium text-slate-200"
            >
              Nombre
            </label>

            <Input
              id="project-name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Ej. Sistema de ventas"
              disabled={isSubmitting}
              required
              className="border-slate-700 bg-slate-950 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-description"
              className="text-sm font-medium text-slate-200"
            >
              Descripción
            </label>

            <textarea
              id="project-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe brevemente el proyecto..."
              disabled={isSubmitting}
              rows={4}
              className="flex w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="bg-indigo-600 text-white hover:bg-indigo-500"
            >
              {isSubmitting
                ? 'Guardando...'
                : isEditing
                  ? 'Guardar cambios'
                  : 'Crear proyecto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}