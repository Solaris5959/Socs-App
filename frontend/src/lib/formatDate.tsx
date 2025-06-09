// utils/formatDate.ts

export const formatDate = (isoString: string, locale: string = "en-US") => {
  const date = new Date(isoString);

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTime = (isoString: string, locale: string = "en-US") => {
  const date = new Date(isoString);

  return date.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
