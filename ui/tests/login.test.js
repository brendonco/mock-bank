import { screen, render, act, fireEvent } from "@testing-library/react";
import { LoginPage, validateLoginRequest } from "../pages/login";
import { LoginProvider } from "../context/login-context";

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

test("Login validate input and provide error messages", async () => {
  render(
    <LoginProvider>
      <LoginPage />
    </LoginProvider>
  );

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText(/login/i));
  });

  const validateReqest = validateLoginRequest({ username: null });

  expect(
    screen.getByText(validateReqest.usernameValidationMessage)
  ).toBeInTheDocument();
});

// test("should submit when form inputs contain text", async () => {
//   render(
//     <LoginProvider>
//       <LoginPage />
//     </LoginProvider>
//   );

//   const username = "alice";

//   await act(async () => {
//     fireEvent.change(screen.getByLabelText(/username/i), {
//       target: { value: username },
//     });
//   });

//   await act(async () => {
//     fireEvent.click(screen.getByText(/login/i));
//   });

//   const validateReqest = validateLoginRequest({ username: null });

//   expect(
//     screen.getByText(validateReqest.usernameValidationMessage)
//   ).not.toBeInTheDocument();
// });
