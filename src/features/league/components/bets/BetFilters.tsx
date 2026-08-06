import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';

type FilterType = 'ALL' | 'ACCEPTED' | 'WON' | 'LOST' | 'VOIDED';

interface BetFiltersProps {
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  startDate: string;
  setStartDate: (d: string) => void;
  endDate: string;
  setEndDate: (d: string) => void;
  setPage: (p: number) => void;
}

export const BetFilters = ({
  filter,
  setFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setPage
}: BetFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
        <Button 
          variant={filter === 'ALL' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => { setFilter('ALL'); setPage(1); }}
        >
          Todas
        </Button>
        <Button 
          variant={filter === 'ACCEPTED' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => { setFilter('ACCEPTED'); setPage(1); }}
        >
          Pendientes
        </Button>
        <Button 
          variant={filter === 'WON' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => { setFilter('WON'); setPage(1); }}
        >
          Ganadas
        </Button>
        <Button 
          variant={filter === 'LOST' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => { setFilter('LOST'); setPage(1); }}
        >
          Perdidas
        </Button>
        <Button 
          variant={filter === 'VOIDED' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => { setFilter('VOIDED'); setPage(1); }}
        >
          Anuladas
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 bg-neutral-100 dark:bg-neutral-900 px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800">
          <DatePicker 
            date={startDate ? new Date(startDate + "T00:00:00") : undefined}
            setDate={(d) => { 
              if (d) {
                const adjusted = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
                setStartDate(adjusted.toISOString().split('T')[0]); 
              } else {
                setStartDate('');
              }
              setPage(1); 
            }}
            placeholder="Fecha inicio"
          />
          <span className="text-neutral-400">-</span>
          <DatePicker 
            date={endDate ? new Date(endDate + "T00:00:00") : undefined}
            setDate={(d) => { 
              if (d) {
                const adjusted = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
                setEndDate(adjusted.toISOString().split('T')[0]); 
              } else {
                setEndDate('');
              }
              setPage(1); 
            }}
            placeholder="Fecha fin"
          />
        </div>
      </div>
    </div>
  );
};
