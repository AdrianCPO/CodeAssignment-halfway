import { useState, useEffect } from "react";
import { ThreadInput } from "../components/ThreadInput";
import { fetchThreads, updateThreadById } from "../components/apiService";
import { CategorySelect } from "../components/CategorySelect";

export const EditThreadView = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  const [status, setStatus] = useState("open"); // Standardvärde
  const [threadId, setThreadId] = useState("");
  const [categoryIds, setCategoryIds] = useState([]); // Ny state för flera kategorier
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const loadThreads = async () => {
      try {
        const data = await fetchThreads();
        setThreads(data);
      } catch (error) {
        console.error("Failed to fetch threads", error);
      }
    };
    loadThreads();
  }, []);

  const handleUpdate = async e => {
    e.preventDefault();

    const updatedThread = {
      thread_title: title,
      thread_content: content,
      thread_author: author,
      thread_timestamp: timestamp,
      thread_status: status,
      category_ids: categoryIds, // Skickar med array med kategori-ID:n
    };

    try {
      const updatedThreadResponse = await updateThreadById(threadId, updatedThread);
      if (updatedThreadResponse) {
        // Visa en alert när tråden har uppdaterats
        alert("Tråden har uppdaterats!");

        setThreads(prevThreads =>
          prevThreads.map(thread =>
            thread.thread_id === updatedThreadResponse.thread_id
              ? updatedThreadResponse
              : thread
          )
        );
      }
    } catch (error) {
      console.error("Failed to update thread", error);
    }
  };

  const handleSelectChange = e => {
    const selectedThreadId = e.target.value;
    const selectedThread = threads.find(
      thread => thread.thread_id.toString() === selectedThreadId
    );

    if (selectedThread) {
      setTitle(selectedThread.thread_title);
      setContent(selectedThread.thread_content);
      setAuthor(selectedThread.thread_author);
      setTimestamp(new Date(selectedThread.thread_timestamp).toISOString());
      setStatus(selectedThread.thread_status);
      setThreadId(selectedThread.thread_id);
      // Förutsätter att API:et returnerar en array med kategori-ID:n
      setCategoryIds(selectedThread.category_ids || []);
    }
  };

  return (
    <div className="container edit-thread-container">
      <h1>Redigera Tråd</h1>
      <form onSubmit={handleUpdate} className="edit-thread-form">
        <label htmlFor="thread-select">Välj en tråd:</label>
        <select
          id="thread-select"
          className="thread-select"
          value={threadId}
          onChange={handleSelectChange}
        >
          <option value="">Välj en tråd</option>
          {threads.map(thread => (
            <option key={thread.thread_id} value={thread.thread_id}>
              {thread.thread_title}
            </option>
          ))}
        </select>

        <ThreadInput
          label="Titel"
          value={title}
          onChange={setTitle}
          placeholder="Ange titel"
        />
        <ThreadInput
          label="Innehåll"
          value={content}
          onChange={setContent}
          placeholder="Ange innehåll"
          isTextArea={true}
        />
        <ThreadInput
          label="Författare"
          value={author}
          onChange={setAuthor}
          placeholder="Ange författarnamn"
        />

        {/* Multi-select för att välja flera kategorier */}
        <label>Redigera Kategori(er)</label>
        <CategorySelect value={categoryIds} onChange={setCategoryIds} />

        <ThreadInput
          label="Datum"
          value={timestamp}
          onChange={setTimestamp}
          placeholder="Ange datum"
        />

        <label>Status</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="status-select"
        >
          <option value="open">Öppen</option>
          <option value="closed">Stängd</option>
        </select>

        <button type="submit" className="btn">
          Uppdatera
        </button>
      </form>
    </div>
  );
};
