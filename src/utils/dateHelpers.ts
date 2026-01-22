export const DAY_MS = 24 * 60 * 60 * 1000;

export const parseDate = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatShortDate = (value: string) =>
  new Date(value).toLocaleDateString("pt-PT", { day: "2-digit", month: "short" });

export const formatCountdown = (date: Date) => {
  const diff = Math.ceil((date.getTime() - Date.now()) / DAY_MS);
  if (diff < 0) return "Expirado";
  if (diff === 0) return "Expira hoje";
  if (diff === 1) return "Expira amanhã";
  return `Expira em ${diff} dias`;
};

export const getCurrentTime = (): string =>
  new Date().toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });
