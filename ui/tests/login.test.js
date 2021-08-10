import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { LoginPage, validateLoginRequest } from "../pages/login";
import { LoginProvider } from "../context/login-context";

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

test("renders Login without crashing", () => {
  render(
    <LoginProvider>
      <LoginPage />
    </LoginProvider>
  );
  expect(screen.getByText(/username/i)).toBeInTheDocument();
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});

const setup = async () => {
  const providerProps = {
    value: {
      state: {
        authenticated: true,
        account: [],
      },
      disptach: () => {},
    },
  };

  customRender(<LoginPage />, { providerProps });

  await waitFor(() => {
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText(/login/i));

    const validateReqest = validateLoginRequest({ username: null });

    expect(
      screen.getByText(validateReqest.usernameValidationMessage)
    ).toBeInTheDocument();
  });
};

test("Login validate input and provide error messages", () => {
  setup();
});

const setup2 = async () => {
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

  customRender(<LoginPage />, { providerProps });

  await waitFor(() => {
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "alice" },
    });

    fireEvent.click(screen.getByText(/login/i));
  });

  const validateReqest = validateLoginRequest({ username: null });

  expect(
    await screen.getByText(validateReqest.usernameValidationMessage)
  ).toBeInTheDocument();
};

test("should submit when form inputs contain text", () => {
  setup2();
});
