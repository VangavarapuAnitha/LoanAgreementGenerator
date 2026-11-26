
export const calculateMaturityDate = (startDate, duration, unit) => {
  if (!startDate || !duration || Number(duration) <= 0) {
    return "";
  }

  const date = new Date(`${startDate}T12:00:00`);

  switch (unit) {
    case "days":
      date.setDate(date.getDate() + Number(duration));
      break;

    case "months":
      date.setMonth(date.getMonth() + Number(duration));
      break;

    case "years":
      date.setFullYear(date.getFullYear() + Number(duration));
      break;

    default:
      return "";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
