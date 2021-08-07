const formatAmount = (amount) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  const value = formatter.format(amount);

  return value;
};

export default formatAmount;
