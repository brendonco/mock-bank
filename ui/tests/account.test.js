import { screen, render, waitFor } from "@testing-library/react";
import { LoginProvider, LoginContext } from "../context/login-context";
import { LoginPage } from "../pages/login";
import { AccountProvider } from "../context/account-context";
import { AccountPage } from "../pages/account";
import userEvent from "@testing-library/user-event";

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <LoginProvider {...providerProps}>{ui}</LoginProvider>,
    renderOptions
  );
};

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

const setup = async () => {
  customRender(<LoginPage />, { providerProps });

  await userEvent.type(screen.getByLabelText(/username/i), "alice");
};

test("AccountPage - should have welcome message", async () => {
  // setup();

  const wrapper = ({ children }) => (
    <LoginProvider {...providerProps}>
      <LoginPage />
      <AccountProvider {...providerProps}>{children}</AccountProvider>
    </LoginProvider>
  );

  render(<AccountPage />, {
    wrapper,
  });

  await userEvent.type(screen.getByLabelText(/username/i), "alice");

  userEvent.click(screen.getByText(/login/i));

  await waitFor(() => {
    expect(
      screen.getByRole("heading", { name: "Hello, alice!" })
    ).toBeInTheDocument();
  });

  render(
    <>
      <AccountPage />
    </>,
    { wrapper: LoginProvider }
  );

  const name = screen.getByText(/Name:/i);
  expect(name).toHaveTextContent("Name:");

  const balance = screen.getByText(/your balance is:/i);
  expect(balance).toHaveTextContent("Your balance is: $NaN");
});
