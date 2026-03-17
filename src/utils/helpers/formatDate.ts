export function formatDate(date: Date) {
  // Ensure the date is a Date object
  if (!(date instanceof Date)) {
    throw new Error("Invalid date");
  }

  // Extract month, day, and year
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();
  const year = date.getFullYear();

  // Pad month and day with leading zeros if needed
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;

  // Construct the formatted date string
  return `${formattedMonth}/${formattedDay}/${year}`;
}

export function formatTime(date: Date) {
  // Ensure the date is a Date object
  if (!(date instanceof Date)) {
    throw new Error("Invalid date");
  }

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format minutes to always be two digits
  const minutesStr = minutes < 10 ? "0" + minutes : minutes.toString();

  // Construct the final formatted time string
  const formattedTime = `${hours}:${minutesStr} ${ampm}`;

  return formattedTime;
}

export function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th"; // Handles 11th, 12th, 13th, etc.
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function formatDateString(date: Date): string {
  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear().toString();

  return `${day} ${month} ${year}`;
}

export function formatDateTimeString(date: Date): string {
  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear().toString();

  // Format time
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${day} ${month} ${year}, ${formattedHours}:${formattedMinutes} ${ampm}`;
}

export const getRelativeTime = (dateString: string): string => {
  const inputDate = new Date(dateString);
  const currentDate = new Date();
  const diffInMs = currentDate.getTime() - inputDate.getTime();

  // Define time units and their corresponding labels
  const timeUnits = [
    {
      label: "year",
      value: Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365)),
    }, // Approximate
    {
      label: "month",
      value: Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30)),
    }, // Approximate
    { label: "week", value: Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7)) },
    { label: "day", value: Math.floor(diffInMs / (1000 * 60 * 60 * 24)) },
    { label: "hour", value: Math.floor(diffInMs / (1000 * 60 * 60)) },
    { label: "minute", value: Math.floor(diffInMs / (1000 * 60)) },
    { label: "second", value: Math.floor(diffInMs / 1000) },
  ];

  // Find the first non-zero time unit
  const unit = timeUnits.find((u) => u.value > 0);

  if (unit) {
    const { label, value } = unit;
    return value === 1 ? `1 ${label} ago` : `${value} ${label}s ago`;
  }

  return "just now";
};

export default getRelativeTime;
