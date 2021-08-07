import * as types from "./constant";

export const requestLogin = (user) => ({
  type: types.REQUEST_LOGIN,
  user,
});

export const loginSuccessful = (account) => ({
  type: types.REQUEST_LOGIN_SUCCESS,
  account,
});

export const loginFailed = (validationResult) => ({
  type: types.REQUEST_LOGIN_FAILURE,
  validationResult,
});

export const logoutSuccessful = () => ({
  type: types.REQUEST_LOGOUT_SUCCESS,
});

export const updateAccount = (account) => ({
  type: types.UPDATE_ACCOUNT_BALANCE_SUCCESS,
  account,
});

export const createAccount = (account) => ({
  type: types.CREATE_ACCOUNT_SUCCESS,
  account,
});

export const failedCreateAccount = (validationResult) => ({
  type: types.CREATE_ACCOUNT_FAILED,
  validationResult,
});
