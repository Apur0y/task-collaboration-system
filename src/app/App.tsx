import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { store } from "./store/store";
import { router } from "./routes";

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="smart-collab-theme">
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </Provider>
  );
}
