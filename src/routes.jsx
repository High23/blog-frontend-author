import ErrorPage from "./components/errorpage/errorpage.jsx";
import { CurrentUser, EditCurrentUser } from "./components/user/user.jsx";
import { EditPost, CreatePost } from "./components/post/post.jsx";
import LogIn from "./components/login/login.jsx";
import { LogOut } from "./components/logout/logout.jsx";

const routes = [
    {
        path: "/",
        element: <LogIn></LogIn>,
        errorElement: <ErrorPage></ErrorPage>,
    },
    {
        path: "/logout",
        element: <LogOut></LogOut>,
        errorElement: <ErrorPage></ErrorPage>,
    },
    {
        path: "/user",
        element: <CurrentUser></CurrentUser>,
        errorElement: <ErrorPage></ErrorPage>,
    },
    {
        path: "/user/:userId/edit",
        element: <EditCurrentUser></EditCurrentUser>,
        errorElement: <ErrorPage></ErrorPage>,
    },
    {
        path: "/post/create",
        element: <CreatePost></CreatePost>,
        errorElement: <ErrorPage></ErrorPage>,
    },
    {
        path: "/post/:postId/edit",
        element: <EditPost></EditPost>,
        errorElement: <ErrorPage></ErrorPage>,
    }
]

export default routes;
