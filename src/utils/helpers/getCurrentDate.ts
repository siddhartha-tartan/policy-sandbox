export const formatDate = (dateString: string): string => {
  const inputDate: Date = new Date(dateString);

  if (isNaN(inputDate.getTime())) {
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return inputDate.toLocaleDateString(undefined, options);
};
