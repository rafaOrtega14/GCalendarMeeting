type AppointmentDays = {
    day: string,
    date: string
}

export const getNextWeekdays = (startDate: Date): AppointmentDays[] => {
  const daysOfWeek = ["Monday","Tuesday","Wednesday","Thursday", "Friday"];
  const result: AppointmentDays[] = [];

  // Get the next Monday, Wednesday, and Friday
  for (let i = 0; i < 7; i++) {
    const nextDate = addDays(startDate, i);
    const dayName = nextDate.toLocaleString("en-US", { weekday: "long" });
    if (daysOfWeek.includes(dayName)) {
      result.push({day: dayName, date: formatDate(nextDate)});
      if (result.length === 5) {
        break;
      }
    }
  }

  return result;
};

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper function to add days to a date
function addDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}
