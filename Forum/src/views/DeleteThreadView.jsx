import { useState, useEffect } from "react";
import { updateThread } from "../components/updateThread";

export const DeleteThreadView = () => {
  const [threads, setThreads] = useState([]);

  const handleDelete = async threadId => {
    // Ta bort tråden från backend
    const response = await fetch(
      `http://localhost:3000/api/threads/delete-thread/${threadId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      console.log(`Thread with ID ${threadId} deleted successfully`);

      // Uppdatera trådlistan genom att filtrera bort den borttagna tråden
      setThreads(prevThreads =>
        prevThreads.filter(thread => thread.thread_id !== threadId)
      );
    } else {
      console.error("Failed to delete thread");
    }
  };

  useEffect(() => {
    const fetchThreads = async () => {
      const data = await updateThread(); // Använd updateThread för att hämta trådar
      setThreads(data);
    };
    fetchThreads();
  }, []);

  return (
    <div className="container delete-thread-container">
      <h1>Ta bort Tråd</h1>

      {threads.length === 0 ? (
        <p className="info-text">Inga trådar att visa.</p>
      ) : (
        threads.map(thread => (
          <div key={thread.thread_id} className="thread-card">
            <h2>{thread.thread_title}</h2>
            <p>{thread.thread_content}</p>
            <button
              className="btn danger"
              onClick={() => handleDelete(thread.thread_id)}
            >
              Ta bort
            </button>
          </div>
        ))
      )}
    </div>
  );
};
