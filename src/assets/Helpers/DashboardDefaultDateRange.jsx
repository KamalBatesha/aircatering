// export default function getDashboardDateRange() {
//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `'${year}-${month}-${day}'`;
//   };

//   const today = new Date();
//   const oneMonthAgo = new Date(today);
//   oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//   return {
//     BegDateDefault: formatDate(oneMonthAgo),
//     EndDateDefault: formatDate(today),
//   };
// }

export default function getDashboardDateRange() {
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // This month calculations
  const firstDayOfThisMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );
  const lastDayOfThisMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  );
  // Last month calculations
  const firstDayOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );
  const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  // This year calculations
  const firstDayOfThisYear = new Date(today.getFullYear(), 0, 1);
  const lastDayOfThisYear = new Date(today.getFullYear(), 11, 31);

  // Last year calculations
  const firstDayOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
  const lastDayOfLastYear = new Date(today.getFullYear() - 1, 11, 31);

  // Week calculations (Sunday as first day of week)
  // This week (Sunday to Saturday)
  const firstDayOfThisWeek = new Date(today);
  firstDayOfThisWeek.setDate(today.getDate() - today.getDay()); // Sunday
  const lastDayOfThisWeek = new Date(firstDayOfThisWeek);
  lastDayOfThisWeek.setDate(firstDayOfThisWeek.getDate() + 6); // Saturday

  // Last week (Sunday to Saturday)
  const firstDayOfLastWeek = new Date(firstDayOfThisWeek);
  firstDayOfLastWeek.setDate(firstDayOfThisWeek.getDate() - 7);
  const lastDayOfLastWeek = new Date(firstDayOfLastWeek);
  lastDayOfLastWeek.setDate(firstDayOfLastWeek.getDate() + 6);

  const twoDaysBeforeToday = new Date(today);
  twoDaysBeforeToday.setDate(today.getDate() - 2);

  const weekBeforeToday = new Date(today);
  weekBeforeToday.setDate(today.getDate() - 7);

  const oneMonthAfterToday = new Date(today);
  oneMonthAfterToday.setMonth(today.getMonth() + 1);

  return {
    BegDateDefault: formatDate(oneMonthAgo),
    EndDateDefault: formatDate(today),
    ThisMonthStart: formatDate(firstDayOfThisMonth),
    ThisMonthEnd: formatDate(lastDayOfThisMonth),
    LastMonthStart: formatDate(firstDayOfLastMonth),
    LastMonthEnd: formatDate(lastDayOfLastMonth),
    ThisYearStart: formatDate(firstDayOfThisYear),
    ThisYearEnd: formatDate(lastDayOfThisYear),
    LastYearStart: formatDate(firstDayOfLastYear),
    LastYearEnd: formatDate(lastDayOfLastYear),
    ThisWeekStart: formatDate(firstDayOfThisWeek),
    ThisWeekEnd: formatDate(lastDayOfThisWeek),
    LastWeekStart: formatDate(firstDayOfLastWeek),
    LastWeekEnd: formatDate(lastDayOfLastWeek),
    Today: formatDate(today),
    twoDaysBeforeToday: formatDate(twoDaysBeforeToday),
    oneMonthAfterToday: formatDate(oneMonthAfterToday),
    weekBeforeToday: formatDate(weekBeforeToday),
  };
}
