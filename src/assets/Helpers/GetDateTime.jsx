export default function useDateTime() {
  function getDateOnly(input) {
    if (!input) return "";

    const date = new Date(input);
    if (isNaN(date?.getTime())) return input; // Return original if invalid date

    const year = date.getFullYear();
    const month = String(date?.getMonth() + 1).padStart(2, "0");
    const day = String(date?.getDate()).padStart(2, "0");

    return `${day}-${month}-${year}`;
  }

  function getTimeOnly(inputTime) {
    if (!inputTime) return "";

    try {
      let [, time] = inputTime.split("T");
      time = time?.split(":")?.slice(0, 2)?.join(":");
      return time || "";
    } catch {
      return inputTime; // Return original if parsing fails
    }
  }

  function getLocalDate(input) {
    if (!input) return "";

    const date = new Date(input);
    if (isNaN(date.getTime())) return input;

    date.setHours(date.getHours() + 2);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function getLocalTime(input) {
    if (!input) return "";

    const date = new Date(input);
    if (isNaN(date.getTime())) return input;

    date.setHours(date.getHours() + 2);

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  return { getDateOnly, getTimeOnly, getLocalDate, getLocalTime };
}
