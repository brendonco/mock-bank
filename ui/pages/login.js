import * as React from "react";
import { useLogin } from "../context/login-context";
import { loginSuccessful, createAccount } from "../actions/actionCreators";
import { Input, Button } from "@supabase/ui";
import {
  fetchByAccount,
  postCreateAccount,
} from "../actions/asyncActionCreators";

function LoginPage() {
  const {
    state: { authenticated },
    dispatch,
  } = useLogin();
  const [username, setUsername] = React.useState(null);

  if (authenticated) {
    return <div>Welcome back {username} </div>;
  }

  async function loginUser() {
    const user = await fetchByAccount({ name: username });

    if (user.length === 0) {
      // Create new account
      const newUser = {
        name: username,
        balance: 0,
      };

      const userCreated = await postCreateAccount(newUser);

      dispatch(createAccount(userCreated));

      dispatch(loginSuccessful([userCreated]));
    } else {
      dispatch(loginSuccessful(user));
    }
  }

  return (
    <>
      <Input label="Username" onChange={(e) => setUsername(e.target.value)} />
      <Button onClick={loginUser}>Login</Button>
    </>
  );
}

export { LoginPage };
