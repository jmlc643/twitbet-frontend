type DateInput = string | Date | null | undefined;

const toDate = (input: DateInput): Date | null => {
  if (!input) return null;
  const date = typeof input === 'string' ? new Date(input) : input;
  return isNaN(date.getTime()) ? null : date;
};

const pad = (value: number) => String(value).padStart(2, '0');

export function formatDateDDMMYYYY(input: DateInput): string {
  const date = toDate(input);
  if (!date) return '';
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function formatTimeHHMM(input: DateInput): string {
  const date = toDate(input);
  if (!date) return '';
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatDateTimeDDMMYYYY(input: DateInput): string {
  const dateStr = formatDateDDMMYYYY(input);
  const timeStr = formatTimeHHMM(input);
  return timeStr ? `${dateStr} ${timeStr}` : dateStr;
}
