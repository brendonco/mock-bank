import * as React from "react";
import { useLogin } from "../context/login-context";
import {
  loginSuccessful,
  loginFailed,
  createAccount,
} from "../actions/actionCreators";
import { Input, Button } from "@supabase/ui";
import {
  fetchByAccount,
  postCreateAccount,
} from "../actions/asyncActionCreators";

export const validateLoginRequest = (credentials) => {
  let result = {
    isValid: true,
    usernameValidationMessage: null,
  };

  if (!credentials.username) {
    result.isValid = false;
    result.usernameValidationMessage = "Username is required";
  }

  return result;
};

function LoginPage() {
  const {
    state: { authenticated, usernameValidationMessage, account },
    dispatch,
  } = useLogin();
  const [username, setUsername] = React.useState(null);
  const [accountDetail] = account || [];

  if (authenticated) {
    return <h2>{`Hello, ${accountDetail?.name}!`} </h2>;
  }

  async function loginUser() {
    const validateResult = validateLoginRequest({ username });

    if (!validateResult.isValid) {
      return dispatch(loginFailed(validateResult));
    }

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
      <Input
        id="username"
        name="username"
        label="Username"
        onChange={(e) => setUsername(e.target.value)}
        error={usernameValidationMessage}
      />
      <p>
        <Button onClick={loginUser}>Login</Button>
      </p>
    </>
  );
}

export { LoginPage };
