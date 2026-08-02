export function ModifyData(data, filterKey, sortKey) {
  const today = new Date();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();
  const thisDay = today.getDate();

  return data.filter((entry) => {
    const entryDate = new Date(entry[sortKey]); // Access the field dynamically

    // Handle custom date range case
    if (Array.isArray(filterKey) && filterKey[0] === "Custom date range") {
      const { from, to } = filterKey[1]; // Get the custom date range

      // Validate that from and to are valid date strings
      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (isNaN(fromDate) || isNaN(toDate)) {
        console.error("Invalid date range provided");
        return false; // Return false if the dates are invalid
      }

      // Compare entryDate with the range regardless of the order of 'from' and 'to'
      const minDate = fromDate <= toDate ? fromDate : toDate;
      const maxDate = fromDate <= toDate ? toDate : fromDate;

      return entryDate >= minDate && entryDate <= maxDate;
    } else {
      switch (filterKey) {
        case "All": {
          return true; // Include all entries
        }
        case "Today": {
          return (
            entryDate.getFullYear() === thisYear &&
            entryDate.getMonth() === thisMonth &&
            entryDate.getDate() === thisDay
          );
        }
        case "This week": {
          const weekStart = new Date(today); // Start of the week
          weekStart.setDate(thisDay - today.getDay());

          const weekEnd = new Date(weekStart); // End of the week
          weekEnd.setDate(weekStart.getDate() + 6);

          return entryDate >= weekStart && entryDate <= weekEnd;
        }
        case "This month": {
          return (
            entryDate.getFullYear() === thisYear &&
            entryDate.getMonth() === thisMonth
          );
        }
        case "Last month": {
          const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
          const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
          return (
            entryDate.getFullYear() === lastMonthYear &&
            entryDate.getMonth() === lastMonth
          );
        }
        case "This year": {
          return entryDate.getFullYear() === thisYear;
        }
        case "Last year": {
          return entryDate.getFullYear() === thisYear - 1;
        }
        default: {
          return false; // If the filter key is unknown, exclude the entry
        }
      }
    }
  });
}
