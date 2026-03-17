export const getReportDateRangeOptions = (): {
  label: string;
  value: [Date, Date];
}[] => {
  const today = new Date();
  const todayStartDate = () => {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0); // Ensure time is 00:00:00
    return date;
  };

  const calculateDate = (daysOffset: number): Date => {
    const date = new Date(today);
    date.setDate(date.getDate() + daysOffset);
    date.setHours(0, 0, 0, 0); // Ensure time is 00:00:00
    return date;
  };

  const options: { label: string; value: [Date, Date] }[] = [
    {
      label: "All",
      value: [new Date(0), today],
    },
    {
      label: "Today",
      value: [todayStartDate(), today], // Start and end date are the same
    },
    {
      label: "Last 7 Days",
      value: [calculateDate(-7), today], // Last 7 days
    },
    {
      label: "Last 15 Days",
      value: [calculateDate(-15), today], // Last 15 days
    },
    {
      label: "Last 30 Days",
      value: [calculateDate(-30), today],
    },
    {
      label: "Last 90 Days",
      value: [calculateDate(-90), today], // Last 90 days
    },
  ];

  return options;
};
