import { useState } from "react";
import { useThreadContext } from "../ThreadContextProvider";
import { ThreadInput } from "../components/ThreadInput";
import { fetchThreads, createThread } from "../api/apiService";
import { CategorySelect } from "../components/CategorySelect";
import { ErrorMessage } from "../components/ErrorMessage";

export const AddThreadView = () => {
  const [threadTitle, setThreadTitle] = useState("");
  const [threadContent, setThreadContent] = useState("");
  const [threadAuthor, setThreadAuthor] = useState("");
  const [threadStatus, setThreadStatus] = useState("open");
  const [categoryIds, setCategoryIds] = useState([]);
  const [formError, setFormError] = useState(null);
  const { setThreads } = useThreadContext();

  const handleSubmit = async e => {
    e.preventDefault();
    setFormError(null);

    if (!threadTitle.trim() || !threadContent.trim() || !threadAuthor.trim()) {
      setFormError("Titel, innehåll och författare måste fyllas i.");
      return;
    }

    const threadTimestamp = new Date().toLocaleString();

    const newThread = {
      thread_title: threadTitle,
      thread_content: threadContent,
      thread_author: threadAuthor,
      thread_timestamp: threadTimestamp,
      thread_status: threadStatus,
      category_ids: categoryIds,
    };

    try {
      const addedThread = await createThread(newThread);
      if (addedThread) {
        alert("Tråden har skapats!");
        const updatedThreads = await fetchThreads();
        setThreads(updatedThreads);
        setThreadTitle("");
        setThreadContent("");
        setThreadAuthor("");
      }
    } catch (error) {
      console.error("Det gick inte att skapa tråden:", error);
      setFormError("Något gick fel vid skapandet av tråden.");
    }
  };

  return (
    <section className="container new-thread-container">
      <h1>Skapa Ny Tråd</h1>
      <form onSubmit={handleSubmit} className="new-thread-form">
        <ThreadInput
          label="Titel"
          value={threadTitle}
          onChange={setThreadTitle}
          placeholder="Ange trådens titel"
        />
        <ThreadInput
          label="Innehåll"
          value={threadContent}
          onChange={setThreadContent}
          placeholder="Ange trådens innehåll"
          isTextArea={true}
        />
        <ThreadInput
          label="Författare"
          value={threadAuthor}
          onChange={setThreadAuthor}
          placeholder="Ange ditt namn"
        />

        <ErrorMessage message={formError} />

        <CategorySelect value={categoryIds} onChange={setCategoryIds} />
        <label>Status</label>
        <select
          value={threadStatus}
          onChange={e => setThreadStatus(e.target.value)}
          className="status-select"
        >
          <option value="open">Öppen</option>
          <option value="closed">Stängd</option>
        </select>
        <button type="submit" className="btn">
          Skapa Tråd
        </button>
      </form>
    </section>
  );
};
