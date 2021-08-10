import * as React from "react";
import { useLogin } from "../context/login-context";
import { Card, Input, InputNumber, Button, Tabs } from "@supabase/ui";
import {
  postTopupAmount,
  fetchByAccount,
  postTransferFund,
} from "../actions/asyncActionCreators";
import { updateAccount, logoutSuccessful } from "../actions/actionCreators";
import formatAmount from "../utils/formatAmount";

function AccountPage() {
  const {
    state: { authenticated, account },
    dispatch,
  } = useLogin();
  const [amount, setTopup] = React.useState(0);
  const [payTo, setPayTo] = React.useState(null);
  const [payToAmount, setPayToAmount] = React.useState(0);
  const [oweTo, setOweTo] = React.useState(null);
  const [transferFundAccount, setTransferFundAccount] = React.useState(null);

  if (!authenticated) return null;

  const [accountDetail] = account;

  async function topUp() {
    const data = {
      ...accountDetail,
      balance: Number(accountDetail.balance) + Number(amount),
    };

    const updatedAmount = await postTopupAmount(data);

    dispatch(updateAccount(updatedAmount));
  }

  async function transferFund() {
    if (!payTo) {
      // required field
    }

    const data = {
      name: payTo,
    };

    const payToAccount = (await fetchByAccount({ name: payTo })) || [];
    const [payToAccountDetail] = payToAccount;

    const { fromResponse, toResponse } = await postTransferFund(
      accountDetail,
      payToAccountDetail,
      payToAmount
    );

    setTransferFundAccount(toResponse);

    if (fromResponse.owe) {
      const owe = fromResponse.owe.find((owe) => owe.id === toResponse.id);
      setOweTo(owe);
    }

    dispatch(updateAccount(fromResponse));
  }

  function logout() {
    setOweTo(null);
    setTransferFundAccount(null);

    dispatch(logoutSuccessful());
  }

  let transferAmount = payToAmount;

  if (oweTo?.amount < payToAmount) {
    transferAmount = payToAmount - oweTo?.amount;
  }

  return (
    <Card title="Account" titleExtra={<Button onClick={logout}>Logout</Button>}>
      <p>Name: {accountDetail?.name}</p>
      <p>Your balance is: {formatAmount(accountDetail?.balance)}</p>
      {accountDetail?.oweFrom &&
        accountDetail?.oweFrom?.map((owe) => (
          <p>{`Owing ${formatAmount(owe.amount)} from ${owe.name}`}</p>
        ))}
      {accountDetail?.owe &&
        accountDetail?.owe?.map((owe) => (
          <p>{`Owing ${formatAmount(owe.amount)} to ${owe.name}`}</p>
        ))}
      <Tabs size="large" block>
        <Tabs.Panel id="topup" label="Topup">
          <InputNumber
            id="topup-amount"
            name="topup-amount"
            aria-label="topup-amount"
            label="Topup Amount"
            onChange={(e) => setTopup(e.target.value)}
          />
          <p>
            <Button onClick={topUp}>Topup</Button>
          </p>
        </Tabs.Panel>
        <Tabs.Panel id="pay" label="Pay">
          <Input
            label="Pay To"
            onChange={(e) => {
              setPayTo(e.target.value);
              setTransferFundAccount(null);
            }}
          />
          <InputNumber
            label="Amount to pay"
            onChange={(e) => {
              setPayToAmount(e.target.value);
              setTransferFundAccount(null);
            }}
          />
          <p>
            <Button onClick={transferFund}>Pay</Button>
          </p>
          {transferFundAccount && (
            <p>{`Transferred ${formatAmount(transferAmount)} to ${payTo}.`}</p>
          )}
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
}

export { AccountPage };
