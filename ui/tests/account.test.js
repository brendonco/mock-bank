import { screen, render, waitFor } from "@testing-library/react";
import { LoginProvider } from "../context/login-context";
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

const setup = async () => {
  const providerProps = {
    value: {
      state: {
        authenticated: true,
        account: [
          {
            name: "alice",
            balance: 0,
            id: 1,
          },
        ],
      },
      disptach: () => {},
    },
  };

  customRender(
    <>
      <LoginPage />
      <AccountProvider>
        <AccountPage />
      </AccountProvider>
    </>,
    { providerProps }
  );

  await userEvent.type(screen.getByLabelText(/username/i), "alice");
};

test("AccountPage - should have welcome message", async () => {
  setup();

  userEvent.click(screen.getByText(/login/i));

  await waitFor(() => {
    expect(
      screen.getByRole("heading", { name: "Hello, alice!" })
    ).toBeInTheDocument();
  });
});
