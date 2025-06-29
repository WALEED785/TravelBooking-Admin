export const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const validatePassword = (password) => password.length >= 6;

export const validateBudgetForm = ({ amount, startDate, endDate }) => {
  if (!amount || isNaN(amount) || amount <= 0) return "Invalid amount";
  if (!startDate || !endDate || new Date(startDate) > new Date(endDate))
    return "Invalid date range";
  return null;
};
