import {
    RouterProvider,
  } from "react-router-dom";
import { router } from "./router/router";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/components/theme/theme.provider";
import { Toaster } from 'sonner';
import { QueryProvider } from "./react-query";
import { UserProvider } from "@/context/user.context";

export  function AppProvider() {
  return (
    <QueryProvider>
    <HelmetProvider>
    <ThemeProvider storageKey='pizza.shop'>
{/*       <Toaster richColors closeButton /> */}
      <Helmet titleTemplate='%s | feedNetwork' />
        <UserProvider>
            <RouterProvider router={router} />
        </UserProvider>
    </ThemeProvider>
  </HelmetProvider>
  <Toaster richColors position="top-right" closeButton />
  </QueryProvider>
  )
}
