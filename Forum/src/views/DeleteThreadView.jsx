import { useState, useEffect } from "react";
import { updateThread } from "../components/updateThread";

export const DeleteThreadView = () => {
  const [threads, setThreads] = useState([]);

  const handleDelete = async threadId => {
    await fetch(`http://localhost:3000/api/threads/delete-thread/${threadId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Hämta trådar på nytt efter borttagning
    const updatedThreads = await updateThread();
    setThreads(updatedThreads);
  };

  useEffect(() => {
    const fetchThreads = async () => {
      const data = await updateThread(); // Använd updateThread för att hämta trådar
      setThreads(data);
    };
    fetchThreads();
  }, []);

  return (
    <div>
      {threads.map(thread => (
        <div key={thread.thread_id}>
          <h2>{thread.thread_title}</h2>
          <p>{thread.thread_content}</p>
          <button onClick={() => handleDelete(thread.thread_id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};
