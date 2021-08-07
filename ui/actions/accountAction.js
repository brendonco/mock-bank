import * as types from "./constant";

export const requestAccount = () => ({
  type: types.REQUEST_ACCOUNT,
});

export const receiveAccount = (account) => ({
  type: types.RECEIVE_ACCOUNT,
  account,
});
