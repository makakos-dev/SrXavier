export const formatToDateTime = (date?: Date) => {
  const [day, month, year] = Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    month: '2-digit',
    year: 'numeric',
    day: '2-digit',
  })
    .format(new Date(date || new Date()))
    .split('/');

  return [year, day, month].join('-');
};

export const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    minute: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    year: 'numeric',
    day: 'numeric',
    month: 'long',
  }).format(new Date(date));
};

export const formatDateShort = (date: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    year: 'numeric',
    day: 'numeric',
    month: 'long',
  }).format(new Date(date));
};

export const formatDateGetWeekAndDay = (date: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date(date));
};

export const formatDateGetDay = (date: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: 'long',
  }).format(new Date(date));
};

export const formatDateGetHour = (date?: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    minute: 'numeric',
    hour: 'numeric',
  }).format(new Date(date || new Date()));
};

export const formatDateGetWeekday = (date: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
  }).format(new Date(date));
};

export const formatDateGetDayNumber = (date: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
  }).format(new Date(date));
};

export const formatDateGetMonthNumber = (date: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    month: '2-digit',
  }).format(new Date(date));
};

export const formatDateGetCurrentYearAndMonthName = (month: number) => {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: 'long',
  }).format(new Date(new Date().getFullYear(), month, new Date().getDate()));
};

export const formatDateGetDayAndYear = (date: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    day: 'numeric',
    month: 'long',
  }).format(new Date(date));
};

export const isNotWithinThirtyDaysRange = (date: Date) => {
  return !(
    new Date(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)) >= new Date() &&
    date <= new Date(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 30))
  );
};
