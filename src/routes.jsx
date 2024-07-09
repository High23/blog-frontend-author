import ErrorPage from "./components/errorpage/errorpage.jsx";
import { CurrentUser } from "./components/user/user.jsx";
import EditPost from "./components/post/post.jsx";

const routes = [
    {
        path: "/",
        element: <CurrentUser></CurrentUser>,
        errorElement: <ErrorPage></ErrorPage>,
    },
    {
        path: "/post/:postId/edit",
        element: <EditPost></EditPost>,
        errorElement: <ErrorPage></ErrorPage>,
    }
]

export default routes;
