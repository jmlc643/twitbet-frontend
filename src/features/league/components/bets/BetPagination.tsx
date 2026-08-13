import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BetPaginationProps {
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
}

export const BetPagination = ({
  meta,
  page,
  setPage,
  limit,
  setLimit,
  isLoading
}: BetPaginationProps) => {
  if (!meta || meta.total === 0) return null;

  const totalPages = Math.ceil(meta.total / limit) || 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-neutral-500 w-full sm:w-auto justify-center sm:justify-start">
        <span>Mostrando</span>
        <span className="font-semibold">{(page - 1) * limit + 1}</span>
        <span>a</span>
        <span className="font-semibold">{Math.min(page * limit, meta.total)}</span>
        <span>de</span>
        <span className="font-semibold">{meta.total}</span>
        <span className="ml-2 hidden sm:inline-block">|</span>
        <div className="flex items-center gap-2 ml-2">
          <span>Filas por página:</span>
          <Select
            value={limit.toString()}
            onValueChange={(val) => {
              setLimit(Number(val));
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={limit.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1 || isLoading}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
        </Button>
        <div className="text-sm font-semibold">
          Página {page} de {totalPages}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || isLoading}
        >
          Siguiente <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
