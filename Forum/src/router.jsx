import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { App } from "./components/App";
import { DeleteThreadView } from "./views/DeleteThreadView";
import { EditThreadViewContainer } from "./views/EditThreadViewContainer";
import { AddThreadView } from "./views/AddThreadView";
import { ThreadDetailView } from "./views/ThreadDetailView";
import { AddCommentView } from "./views/AddCommentView";
import { EditCommentViewContainer } from "./views/EditCommentViewContainer";
import { ThreadViewContainer } from "./views/ThreadViewContainer";

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
      <Route path="/threads" element={<ThreadViewContainer />} index />
      <Route path="/threads/:threadId" element={<ThreadDetailView />} />
      <Route path="/new-thread" element={<AddThreadView />} />
      <Route path="/new-comment/:threadId" element={<AddCommentView />} />
      <Route path="/edit-thread" element={<EditThreadViewContainer />} />
      <Route path="/edit-comment" element={<EditCommentViewContainer />} />
      <Route path="/delete-thread" element={<DeleteThreadView />} />
    </Route>
  )
);
