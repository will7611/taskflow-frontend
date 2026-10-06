import {
  Edit,
  FolderKanban,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import type { Project } from '@/services/project.service';

interface ProjectItemProps {
  project: Project;
  selected: boolean;
  onSelect: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectItem({
  project,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: ProjectItemProps) {
  return (
    <Card
      className={`group cursor-pointer border transition-all ${
        selected
          ? 'border-indigo-500 bg-indigo-500/10'
          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
      }`}
      onClick={() => onSelect(project)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={`rounded-lg p-2 ${
                selected
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <FolderKanban className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate font-semibold text-slate-100">
                {project.name}
              </h3>

              <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                {project.description || 'Sin descripción'}
              </p>
            </div>
          </div>

          <div
            className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
            onClick={(event) => event.stopPropagation()}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onEdit(project)}
              className="h-8 w-8 text-slate-400 hover:bg-slate-800 hover:text-white"
              title="Editar proyecto"
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onDelete(project)}
              className="h-8 w-8 text-slate-400 hover:bg-rose-950 hover:text-rose-400"
              title="Eliminar proyecto"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {selected && (
          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-indigo-400">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            Proyecto seleccionado
          </div>
        )}
      </CardContent>
    </Card>
  );
}