
export const calculateInterest = ({
  principal,
  interestRate,
  duration,
  durationUnit,
}) => {
  const P = Number(principal);
  const R = Number(interestRate);
  const D = Number(duration);

  if (
    !Number.isFinite(P) ||
    !Number.isFinite(R) ||
    !Number.isFinite(D) ||
    P <= 0 ||
    R < 0 ||
    D <= 0
  ) {
    return {
      interest: 0,
      totalAmount: 0,
    };
  }

  let timeInYears = 0;

  switch (durationUnit) {
    case "days":
      timeInYears = D / 365;
      break;

    case "months":
      timeInYears = D / 12;
      break;

    case "years":
      timeInYears = D;
      break;

    default:
      return {
        interest: 0,
        totalAmount: 0,
      };
  }

  const interest = (P * R * timeInYears) / 100;

  return {
    interest: Number(interest.toFixed(2)),
    totalAmount: Number((P + interest).toFixed(2)),
  };
};
