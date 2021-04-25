const ONE_DAY_IN_MILLIS = 1000 * 60 * 60 * 24;

export const lastDayOfActivity = (startDate, numberOfWeeks) => {
  const startDateArray = startDate.split('-');
  const startDateInMillis = new Date(startDateArray[0], startDateArray[1] - 1, startDateArray[2]);

  const lastDate = new Date(startDateInMillis.getTime() + ONE_DAY_IN_MILLIS * (numberOfWeeks * 7));

  return `${lastDate.getFullYear()}-${lastDate.getMonth() + 1 > 9 ? lastDate.getMonth() + 1 : '0' + (lastDate.getMonth() + 1)}-${lastDate.getDate()}`;
}

export const getMonthIntervalFromDate = (date) => {
  const firstMonthDay = `${date.getFullYear()}-${date.getMonth() + 1 > 9
      ? date.getMonth() + 1
      : '0' + (date.getMonth() + 1)
    }-01`;
  const lastMonthDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0];

  return [firstMonthDay, lastMonthDay];
};