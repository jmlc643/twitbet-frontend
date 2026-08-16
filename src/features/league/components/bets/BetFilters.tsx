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
      <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        {[
          { id: 'ALL', label: 'Todas' },
          { id: 'ACCEPTED', label: 'Pendientes' },
          { id: 'WON', label: 'Ganadas' },
          { id: 'LOST', label: 'Perdidas' },
          { id: 'VOIDED', label: 'Anuladas' }
        ].map(item => {
          const isActive = filter === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setFilter(item.id as FilterType); setPage(1); }}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${
                isActive 
                  ? 'bg-white text-neutral-900 font-bold shadow-sm' 
                  : 'bg-transparent text-neutral-300 border border-neutral-700 hover:bg-neutral-800 font-medium'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-transparent px-3 py-2 sm:py-1.5 rounded-md border border-neutral-700 w-full sm:w-auto">
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
            className="w-full sm:w-[180px] bg-transparent border-none text-neutral-300"
          />
          <span className="text-neutral-500 hidden sm:inline">-</span>
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
            className="w-full sm:w-[180px] bg-transparent border-none text-neutral-300"
          />
        </div>
      </div>
    </div>
  );
};
