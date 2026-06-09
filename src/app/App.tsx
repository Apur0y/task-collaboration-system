import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { router } from "./routes";
import { store } from "./components/store/store";
import { login, logout } from "./components/store/authSlice";
import AuthInitializer from "./components/AuthInitializer";

export default function App() {

  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="smart-collab-theme">
        <AuthInitializer>
        <RouterProvider router={router} />
        </AuthInitializer>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </Provider>
  );
}
