import React, { useReducer } from "react";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { LoginContext, loginReducer } from "../context/login-context";
import { LoginPage } from "../pages/login";
import { AccountPage } from "../pages/account";
import { render } from "../tests/test.utils";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
    };
  },
  withRouter: (component) => {
    component.defaultProps = {
      ...component.defaultProps,
      router: { pathname: "/" },
    };
    return component;
  },
}));

const providerProps = {
  authenticated: true,
  account: [
    {
      name: "alice",
      balance: 0,
      id: 1,
    },
  ],
};

test("AccountPage - should have welcome message and user information", async () => {
  const Wrapper = () => {
    const [state, dispatch] = useReducer(loginReducer, providerProps);
    const value = { state, dispatch };

    return (
      <LoginContext.Provider value={value}>
        <LoginPage />
        <AccountPage />
      </LoginContext.Provider>
    );
  };

  render(<Wrapper />);

  await waitFor(() => {
    expect(
      screen.getByRole("heading", { name: "Hello, alice!" })
    ).toBeInTheDocument();

    const name = screen.getByText(/Name:/i);
    expect(name).toHaveTextContent("Name: alice");

    const balance = screen.getByText(/your balance is:/i);
    expect(balance).toHaveTextContent("Your balance is: $0.00");

    const inputTopupAmount = screen.getByRole("spinbutton", {
      name: /topup amount/i,
    });

    fireEvent.change(inputTopupAmount, { target: { value: 100 } });

    expect(inputTopupAmount.value).toBe("100");
  });
});

test("AccountPage - should be able to switch tab", async () => {
  const Wrapper = () => {
    const [state, dispatch] = useReducer(loginReducer, providerProps);
    const value = { state, dispatch };

    return (
      <LoginContext.Provider value={value}>
        <LoginPage />
        <AccountPage />
      </LoginContext.Provider>
    );
  };

  render(<Wrapper />);

  await waitFor(() => {
    const tab = screen.getByRole("tab", {
      name: /pay/i,
    });

    fireEvent.click(tab);
  });

  await waitFor(() => {
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "bob" } });

    expect(input.value).toBe("bob");

    const inputAmountToPay = screen.getByRole("spinbutton");

    fireEvent.change(inputAmountToPay, { target: { value: 90 } });

    expect(inputAmountToPay.value).toBe("90");

    const button = screen.getByRole("button", {
      name: /pay/i,
    });

    fireEvent.click(button);

    const balance = screen.getByText(/your balance is:/i);
    expect(balance).toHaveTextContent("Your balance is: $0.00");
  });
});
