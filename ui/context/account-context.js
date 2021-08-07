import * as React from "react";
import * as ActionTypes from "../actions/constant";

const AccountContext = React.createContext();

function accountReducer(state, action) {
  switch (action.type) {
    case ActionTypes.REQUEST_ACCOUNT: {
      return state;
    }
    case ActionTypes.RECEIVE_ACCOUNT: {
      return { account: action.account };
    }
    case ActionTypes.REQUEST_ACCOUNT_FAILURE: {
      return {
        account: null,
      };
    }
    default: {
      return state;
    }
  }
}
function AccountProvider({ children }) {
  const [state, dispatch] = React.useReducer(accountReducer, {
    account: null,
  });
  const value = { state, dispatch };
  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}
function useAccount() {
  const context = React.useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccount must be used within a AccountProvider");
  }
  return context;
}
export { AccountProvider, useAccount };
