import { get, put, post } from "../utils/httpService";

export const fetchByAccount = ({ name }) => get(`accounts?name=${name}`);

export const postTopupAmount = (data) => put(`accounts/${data.id}`, data);

export const postCreateAccount = (data) => post("accounts", data);
