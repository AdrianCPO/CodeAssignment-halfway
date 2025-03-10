import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { App } from "./components/App";
import { DeleteThreadView } from "./views/DeleteThreadView";
import { EditThreadView } from "./views/EditThreadView";
import { AddThreadView } from "./views/AddThreadView";
import { ThreadView } from "./views/ThreadView";
import { ThreadDetailView } from "./views/ThreadDetailView";
import { AddCommentView } from "./views/AddCommentView";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} path="/">
      <Route
        element={
          <section>
            <h1>404</h1>
          </section>
        }
        path="*"
      />
      <Route path="/threads" element={<ThreadView />} index />
      <Route path="/threads/:threadId" element={<ThreadDetailView />} />
      <Route path="/new-thread" element={<AddThreadView />} />
      <Route path="/new-comment/:threadId" element={<AddCommentView />} />
      <Route path="/edit-thread" element={<EditThreadView />} />
      <Route path="/delete-thread" element={<DeleteThreadView />} />
    </Route>
  )
);
