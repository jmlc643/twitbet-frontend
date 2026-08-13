import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface MarketAddOptionsProps {
  isAddingOptions: boolean;
  newOptions: { name: string; odds: string }[];
  isPending: boolean;
  onStartAdding: () => void;
  onCancelAdding: () => void;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  onChange: (index: number, field: 'name' | 'odds', value: string) => void;
  onSubmit: () => void;
}

export const MarketAddOptions = ({
  isAddingOptions,
  newOptions,
  isPending,
  onStartAdding,
  onCancelAdding,
  onAddRow,
  onRemoveRow,
  onChange,
  onSubmit
}: MarketAddOptionsProps) => {
  if (!isAddingOptions) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onStartAdding}
        className="text-indigo-600 dark:text-indigo-400"
      >
        <Plus className="w-4 h-4 mr-2" />
        Agregar Opciones
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Nuevas opciones</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddRow}
          className="text-indigo-600 dark:text-indigo-400"
        >
          <Plus className="w-4 h-4 mr-1" /> Agregar fila
        </Button>
      </div>

      <div className="space-y-2">
        {newOptions.map((opt, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              placeholder="Nombre de la opción"
              value={opt.name}
              onChange={(e) => onChange(index, 'name', e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              step="0.01"
              min="1.01"
              placeholder="Cuota"
              value={opt.odds}
              onChange={(e) => onChange(index, 'odds', e.target.value)}
              className="w-24 font-mono"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveRow(index)}
              disabled={newOptions.length === 1}
              className="shrink-0 h-9 w-9 text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancelAdding}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button
          size="sm"
          onClick={onSubmit}
          disabled={isPending || newOptions.length === 0}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isPending ? 'Agregando...' : 'Agregar Opciones'}
        </Button>
      </div>
    </div>
  );
};
