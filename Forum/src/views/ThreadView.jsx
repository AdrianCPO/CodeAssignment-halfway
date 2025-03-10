// components/ThreadView.js
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useThreadContext } from "../ThreadContextProvider";
import { SortThreads } from "../components/SortThreads";

export const ThreadView = () => {
  const { threads, setThreads } = useThreadContext();
  const [sortBy, setSortBy] = useState("activity"); // Lägg till state för sorteringsparametern

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/threads?sortBy=${sortBy}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch threads");
        }
        const data = await response.json();
        console.log("fetched threads:", data);
        setThreads(data); // Uppdatera trådarna i context
      } catch (error) {
        console.error("error fetching threads:", error);
      }
    };

    fetchThreads();
  }, [sortBy, setThreads]); // Hämta trådar när sortBy ändras

  if (threads.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Alla Trådar</h1>

      {/* Lägg till sorteringskomponenten här */}
      <SortThreads setSortBy={setSortBy} />

      {threads.length === 0 ? (
        <div>Inga trådar tillgängliga.</div>
      ) : (
        threads.map(thread => (
          <div key={thread.thread_id}>
            <h2>{thread.thread_title}</h2>
            <p>{thread.thread_content}</p>
            <Link to={`/threads/${thread.thread_id}`}>Visa detaljer</Link>
            <br />
            <Link to={`/new-comment/${thread.thread_id}`}>Kommentera</Link>
          </div>
        ))
      )}
    </div>
  );
};
