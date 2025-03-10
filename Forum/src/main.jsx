import "./index.css";
import { router } from "./router.jsx";
import { RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { ThreadContextProvider } from "./ThreadContextProvider.jsx";
import { CommentContextProvider } from "./CommentContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <ThreadContextProvider>
    <CommentContextProvider>
      <RouterProvider router={router} />
    </CommentContextProvider>
  </ThreadContextProvider>
);
