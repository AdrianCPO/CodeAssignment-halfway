import { useState, useEffect } from "react";
import { ThreadInput } from "../components/ThreadInput";
import { updateThread } from "../components/updateThread"; // Om du inte använder den här i detta fall, kan den tas bort.
import { updateSingleThread } from "../components/updateSingleThread";

export const EditThreadView = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  const [status, setStatus] = useState("");
  const [threadId, setThreadId] = useState("");
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    // Ladda alla trådar från servern vid första renderingen
    const fetchThreads = async () => {
      const data = await updateThread(); // Hämtar alla trådar från servern
      setThreads(data);
    };
    fetchThreads();
  }, []);

  const handleUpdate = async e => {
    e.preventDefault();

    const updatedThread = {
      thread_title: title,
      thread_content: content,
      thread_author: author,
      thread_timestamp: timestamp,
      thread_status: status,
    };

    // Skicka uppdateringen till servern
    const updatedThreadResponse = await updateSingleThread(
      threadId,
      updatedThread
    );

    if (updatedThreadResponse) {
      // Uppdatera den specifika tråden i den lokala listan med den uppdaterade tråden
      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.thread_id === updatedThreadResponse.thread_id
            ? updatedThreadResponse
            : thread
        )
      );
    } else {
      console.error("Failed to update thread");
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
        <ThreadInput
          label="Datum"
          value={timestamp}
          onChange={setTimestamp}
          placeholder="Ange datum"
        />
        <ThreadInput
          label="Status"
          value={status}
          onChange={setStatus}
          showStatusSelect={true}
        />

        <button type="submit" className="btn">
          Uppdatera
        </button>
      </form>
    </div>
  );
};
