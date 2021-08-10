export const validateAccountRequest = (credentials) => {
  let result = {
    isValid: true,
    payToValidationMessage: null,
    payToAmountValidationMessage: null,
  };

  if (!credentials.payTo) {
    result.isValid = false;
    result.payToValidationMessage = "Pay To is required";
  }

  if (
    credentials?.payTo?.toLowerCase() ===
    credentials?.currentUser?.toLowerCase()
  ) {
    result.isValid = false;
    result.payToValidationMessage = "Pay To cannot send to own account";
  }

  if (!credentials.payToAmount) {
    result.isValid = false;
    result.payToAmountValidationMessage = "Amount to pay is required";
  }

  return result;
};

export const validateAccountTopupRequest = (credentials) => {
  let result = {
    isValid: true,
    topUpValidationMessage: null,
  };

  if (!credentials.topUp) {
    result.isValid = false;
    result.topUpValidationMessage = "Topup amount is required";
  }

  return result;
};
