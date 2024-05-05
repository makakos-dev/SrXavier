export const generateWorkingHourDateRange = (fromDate: Date, toDate: Date, workingHours: number[]) => {
  const date1 = Date.UTC(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const date2 = Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const daysDifference = Math.floor((date2 - date1) / MS_PER_DAY) + 1;

  return Array.from({ length: daysDifference }).reduce<Date[]>((array, _, day) => {
    const currentDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    currentDate.setDate(currentDate.getDate() + day);
    const dates = workingHours.map((_, hour) => {
      return new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        workingHours[hour],
      );
    });
    array.push(...dates);
    return array;
  }, []);
};
