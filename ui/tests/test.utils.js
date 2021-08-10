import React from "react";
import { render } from "@testing-library/react";
import { LoginProvider } from "../context/login-context";

const AllTheProviders = ({ children, ...props }) => {
  return <LoginProvider value={{ ...props }}>{children}</LoginProvider>;
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
