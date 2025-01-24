import AuthLayout from "@/layout/_auth_layout";
import AppLayout from "@/layout/_layout";
import { SignIn } from "@/page/auth/sign-in/sign-in";
import { SignUp } from "@/page/auth/sign-up/sign-up";
import Home from "@/page/home/home";
import {
    createBrowserRouter
  } from "react-router-dom";
  export const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            {
                path: "sign-in",
                element: <SignIn />,
            },
            {
                path: "sign-up",
                element: <SignUp />,
            },
        ],
    },
    {
        path: "/app",
        element: <AppLayout />,
        children: [
            {
                path: "",
                element: <Home />,
            },
        ],
    },
]);
