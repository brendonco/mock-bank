import * as React from "react";
import { useLogin } from "../context/login-context";
import { Card, InputNumber, Button, Tabs } from "@supabase/ui";
import { postTopupAmount } from "../actions/asyncActionCreators";
import { updateAccount, logoutSuccessful } from "../actions/actionCreators";
import formatAmount from "../utils/formatAmount";

function AccountPage() {
  const {
    state: { authenticated, account },
    dispatch,
  } = useLogin();
  const [amount, setTopup] = React.useState(0);

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

  function logout() {
    dispatch(logoutSuccessful());
  }

  return (
    <Card title="Account" titleExtra={<Button onClick={logout}>Logout</Button>}>
      <div>Name: {accountDetail?.name}</div>
      <div>Your balance is: {formatAmount(accountDetail?.balance)}</div>
      <Tabs size="large" block>
        <Tabs.Panel id="topup" label="Topup">
          <InputNumber
            label="Amount"
            onChange={(e) => setTopup(e.target.value)}
          />
          <Button onClick={topUp}>Submit</Button>
        </Tabs.Panel>
        <Tabs.Panel id="pay" label="Pay">
          Tab two content
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
}

export { AccountPage };
