import { createBrowserRouter } from "react-router-dom";
import { Routes } from "./CONSTANTS";
import HomePage from "../pages/Home";
import RifaListPage from "../pages/rifa/RifaList";
import RifaFormPage from "../pages/rifa/RifaForm";
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import RifaDetailPage from "../pages/rifa/RifaDetail";
import UserListPage from "../pages/user/UserList";

export const routerConfig = createBrowserRouter([
    {
        path: Routes.HOME,
        element: <HomePage />,
    },
    {
        path: Routes.RIFAS.LIST,
        element: <RifaListPage />,
    },
    {
        path: Routes.RIFAS.CREATE,
        element: <RifaFormPage />,
    },
    {
        path: Routes.RIFAS.EDIT,
        element: <RifaFormPage />,
    },
    {
        path: Routes.RIFAS.DETAIL,
        element: <RifaDetailPage />,
    },
    {
        path: Routes.AUTH.LOGIN,
        element: <LoginPage />,
    },
    {
        path: Routes.AUTH.REGISTER,
        element: <RegisterPage />,
    },
    {
        path: Routes.USER.LIST,
        element: <UserListPage />,
    },
    {
        path: '*',
        element: <div>404</div>,
    }
]);