import { useState, useEffect } from "react";
import { fetchThreads, deleteThread } from "../api/apiService";

export const DeleteThreadView = () => {
  const [threads, setThreads] = useState([]);

  const handleDelete = async threadId => {
    try {
      await deleteThread(threadId);

      setThreads(prevThreads =>
        prevThreads.filter(thread => thread.thread_id !== threadId)
      );

      alert("Tråden har tagits bort!");
    } catch (error) {
      console.error("Failed to delete thread", error);
    }
  };

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
