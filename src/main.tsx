import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import GamePage from "./pages/GamePage";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
    {
        path: "/",
        Component: GamePage,
        errorElement: <div>404 Not Found</div>,
    },
])

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
