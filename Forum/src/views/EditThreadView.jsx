import { useState, useEffect } from "react";
import { ThreadInput } from "../components/ThreadInput";
import {
  fetchThreads,
  fetchThreadById,
  updateThreadById,
} from "../components/apiService";
import { CategorySelect } from "../components/CategorySelect";

export const EditThreadView = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  const [status, setStatus] = useState("open"); // Standardvärde
  const [threadId, setThreadId] = useState("");
  const [categoryIds, setCategoryIds] = useState([]); // State för valda kategori-ID:n
  const [threads, setThreads] = useState([]);

  // Hämta listan över trådar (utan fullständig data)
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

  // När en tråd väljs hämtar vi fullständig data med fetchThreadById
  const handleSelectChange = async e => {
    const selectedThreadId = e.target.value;
    setThreadId(selectedThreadId);

    if (selectedThreadId) {
      try {
        const selectedThread = await fetchThreadById(selectedThreadId);
        setTitle(selectedThread.thread_title);
        setContent(selectedThread.thread_content);
        setAuthor(selectedThread.thread_author);
        setTimestamp(new Date(selectedThread.thread_timestamp).toISOString());
        setStatus(selectedThread.thread_status);
        // Sätt kategori-arrayen – se till att eventuella strängvärden konverteras till nummer
        const normalizedCategories = selectedThread.category_ids
          ? selectedThread.category_ids.map(id => Number(id))
          : [];
        setCategoryIds(normalizedCategories);
      } catch (error) {
        console.error("Failed to fetch thread details:", error);
      }
    } else {
      // Om inget tråd-ID är valt, nollställ fälten
      setTitle("");
      setContent("");
      setAuthor("");
      setTimestamp(new Date().toISOString());
      setStatus("open");
      setCategoryIds([]);
    }
  };

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
      const updatedThreadResponse = await updateThreadById(
        threadId,
        updatedThread
      );
      if (updatedThreadResponse) {
        alert("Tråden har uppdaterats!");
        // Uppdatera listan över trådar om så önskas
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

        {/* Multi-select för att visa/redigera redan valda kategorier */}
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
