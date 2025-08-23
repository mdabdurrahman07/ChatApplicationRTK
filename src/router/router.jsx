import { createBrowserRouter } from "react-router-dom";
import Root from "../pages/Root";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Conversation from "../pages/Conversation";
import Inbox from "../pages/Inbox";
import { PrivateRoute } from "../components/PrivateRoute/PrivateRoute.jsx";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/inbox",
        element: (
          <PrivateRoute>
            <Conversation />
          </PrivateRoute>
        ),
      },
      {
        path: "/inbox/:id",
        element: (
          <PrivateRoute>
            <Inbox />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
