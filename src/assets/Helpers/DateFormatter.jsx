function DateFormatter() {
  function reversed(inputDate) {
    if (!inputDate) return "";
    const [year, month, day] = inputDate.split("-");
    return `${day}-${month}-${year}`;
  }

  function longFormat(input) {
    if (!input) return "";
    let date;

    // Format 1: 'DD-MM-YYYY'
    if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(input)) {
      const [day, month, year] = input.split("-");
      date = new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      );
    }

    // Format 2: 'DD/MM/YYYY'
    else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(input)) {
      const [day, month, year] = input.split("/");
      date = new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      );
    }

    // Format 3: natural date string like 'May 26 2024 12:00AM'
    else {
      const cleanedInput = input.replace(/(\d{1,2}:\d{2})(AM|PM)/i, "$1 $2");
      date = new Date(cleanedInput);
    }

    // Final check
    if (isNaN(date)) return "Invalid date";

    // Desired output: 'Sunday 1, June 2025'
    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    const day = date.getDate(); // numeric day
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();

    return `${weekday} ${day}, ${month} ${year}`;
  }
  return { reversed, longFormat };
}

export default DateFormatter;
