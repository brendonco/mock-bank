import { get, put, post } from "../utils/httpService";

const baseUrl = "accounts";

export const fetchByAccount = ({ name }) => get(`${baseUrl}?name=${name}`);

export const postTopupAmount = (data) => put(`${baseUrl}/${data.id}`, data);

export const postCreateAccount = (data) => post(baseUrl, data);

const updateOwe = (toOwe, to, currentAmount, transferAmount) =>
  toOwe?.map((owe) => {
    if (owe.id === to.id) {
      return {
        ...owe,
        amount:
          currentAmount === 0
            ? Number(owe.amount) - Number(transferAmount)
            : -currentAmount,
      };
    }
    return owe;
  });

const updateGenericOwe = (oweFrom, to, transferAmount) => {
  const owe = oweFrom
    ?.map((owe) => {
      if (owe.id === to.id) {
        const amount =
          Number(transferAmount) < Number(owe.amount)
            ? Number(owe.amount) - Number(transferAmount)
            : Number(transferAmount) - Number(owe.amount);

        if (amount === 0) return null;

        return {
          ...owe,
          amount,
        };
      }
    })
    .filter((owe) => owe != null);

  return owe?.length === 0 ? null : owe;
};

export const postTransferFund = async (from, to, transferAmount) => {
  const currentAmount = Number(from.balance) - Number(transferAmount);
  const transferFund =
    Number(from.balance) < Number(transferAmount)
      ? Number(to.balance) + Number(from.balance)
      : Number(to.balance) + Number(transferAmount);

  let fromResponse = null;
  let oweList = null;

  if (currentAmount < 0 || currentAmount === 0) {
    if (from.owe) {
      oweList = updateOwe(from?.owe, to, currentAmount, transferAmount);

      fromResponse = await put(`${baseUrl}/${from.id}`, {
        ...from,
        balance: 0,
        owe: oweList?.length === 0 ? null : oweList, //oweList,
      });
    } else {
      oweList = [
        {
          id: to.id,
          name: to.name,
          amount: -currentAmount,
        },
      ];

      fromResponse = await put(`${baseUrl}/${from.id}`, {
        ...from,
        balance: 0,
        owe: oweList?.length === 0 ? null : oweList, // oweList,
      });
    }
  } else {
    const oweFromList = updateGenericOwe(from?.oweFrom, to, transferAmount);
    const oweFromExist =
      from?.oweFrom?.findIndex((owe) => owe.id === to.id) > -1;

    const oweToExist = from?.owe?.findIndex((owe) => owe.id === to.id) > -1;

    fromResponse = await put(`${baseUrl}/${from.id}`, {
      ...from,
      balance: oweFromExist ? from.balance : currentAmount,
      oweFrom: from.oweFrom ? oweFromList : null,
      owe: oweToExist
        ? updateGenericOwe(from?.owe, to, transferAmount)
        : from.owe,
    });
  }

  const oweToExist = to?.owe?.findIndex((owe) => owe.id === from.id) > -1;
  const oweToList = updateGenericOwe(to?.owe, from, transferAmount);

  const toResponse = await put(`${baseUrl}/${to.id}`, {
    ...to,
    balance: oweToExist && to.balance === 0 ? to.balance : transferFund,
    owe: to?.owe ? oweToList : to.owe,
    oweFrom: oweList
      ? oweList
          .filter((owe) => owe.id === to.id)
          .map((owe) => ({ ...owe, id: from.id, name: from.name }))
      : null,
  });

  return {
    fromResponse,
    toResponse,
  };
};
