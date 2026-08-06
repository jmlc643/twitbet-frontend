export const mapMatchStatus = (status: string): string => {
  const map: Record<string, string> = {
    'SCHEDULED': 'Programado',
    'LIVE': 'En Vivo',
    'IN_PROGRESS': 'En Progreso',
    'FINISHED': 'Finalizado',
    'COMPLETED': 'Completado',
    'VOIDED': 'Anulado',
    'DELAYED': 'Retrasado',
  };
  return map[status.toUpperCase()] || status;
};

export const mapMarketStatus = (status: string): string => {
  const map: Record<string, string> = {
    'OPEN': 'Abierto',
    'SUSPENDED': 'Suspendido',
    'CLOSED': 'Cerrado',
    'SETTLED': 'Resuelto',
    'CANCELLED': 'Cancelado',
  };
  return map[status.toUpperCase()] || status;
};

export const getStatusColor = (status: string): string => {
  const normalized = status.toUpperCase();
  if (['LIVE', 'IN_PROGRESS', 'OPEN'].includes(normalized)) {
    return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
  }
  if (['FINISHED', 'COMPLETED', 'CLOSED', 'SETTLED'].includes(normalized)) {
    return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400';
  }
  if (['CANCELLED', 'SUSPENDED', 'DELAYED'].includes(normalized)) {
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
  }
  return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400';
};
