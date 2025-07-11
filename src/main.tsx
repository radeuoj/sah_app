import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import GamePage from "./pages/GamePage";
import { createBrowserRouter, RouterProvider } from "react-router";
import TestPage from "./pages/TestPage";

const router = createBrowserRouter([
    {
        path: "/",
        Component: GamePage,
        errorElement: <div>404 Not Found</div>,
    },
    {
        path: "/test",
        Component: TestPage,
    },
])

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
