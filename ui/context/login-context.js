import * as React from "react";
import * as ActionTypes from "../actions/constant";

const LoginContext = React.createContext();

function loginReducer(state, action) {
  switch (action.type) {
    case ActionTypes.REQUEST_LOGIN: {
      return state;
    }
    case ActionTypes.REQUEST_LOGIN_SUCCESS: {
      return { authenticated: true, account: action?.account };
    }
    case ActionTypes.REQUEST_LOGOUT_SUCCESS: {
      return { authenticated: false };
    }
    case ActionTypes.REQUEST_LOGIN_FAILURE: {
      return {
        authenticated: false,
        usernameValidationMessage:
          action?.validationResult?.usernameValidationMessage,
      };
    }
    case ActionTypes.UPDATE_ACCOUNT_BALANCE_SUCCESS: {
      return {
        ...state,
        account: [action.account],
      };
    }
    case ActionTypes.CREATE_ACCOUNT_SUCCESS: {
      return {
        ...state,
        account: [action.account],
      };
    }
    default: {
      return state;
    }
  }
}
function LoginProvider({ children }) {
  const [state, dispatch] = React.useReducer(loginReducer, {
    authenticated: false,
  });

  const value = { state, dispatch };
  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
}
function useLogin() {
  const context = React.useContext(LoginContext);
  if (context === undefined) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
}
export { LoginProvider, useLogin, loginReducer, LoginContext };
