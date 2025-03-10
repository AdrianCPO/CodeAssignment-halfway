import { useState, useEffect } from "react";
import { ThreadInput } from "../components/ThreadInput";
import { updateThread } from "../components/updateThread";

export const EditThreadView = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  const [status, setStatus] = useState("");
  const [id, setId] = useState("");
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const fetchThreads = async () => {
      const data = await updateThread(); // Använd updateThread för att hämta trådar
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
      thread_id: id,
    };

    await fetch(`http://localhost:3000/api/threads/edit-thread/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedThread),
    });

    // Uppdatera trådlistan efter uppdatering
    const updatedThreads = await updateThread();
    setThreads(updatedThreads);
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
      setId(selectedThread.thread_id);
    }
  };

  return (
    <div>
      <form onSubmit={handleUpdate}>
        <select value={id} onChange={handleSelectChange}>
          <option value="">Välj en tråd</option>
          {threads.map(thread => (
            <option key={thread.thread_id} value={thread.thread_id}>
              {thread.thread_title}
            </option>
          ))}
        </select>
        <ThreadInput
          label="Title"
          value={title}
          onChange={setTitle}
          placeholder="Enter thread title"
        />
        <ThreadInput
          label="Content"
          value={content}
          onChange={setContent}
          placeholder="Enter thread content"
          isTextArea={true}
        />
        <ThreadInput
          label="Author"
          value={author}
          onChange={setAuthor}
          placeholder="Enter author name"
        />
        <ThreadInput
          label="Timestamp"
          value={timestamp}
          onChange={setTimestamp}
          placeholder="Enter timestamp"
        />
        <ThreadInput
          label="Status"
          value={status}
          onChange={setStatus}
          showStatusSelect={true}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};
