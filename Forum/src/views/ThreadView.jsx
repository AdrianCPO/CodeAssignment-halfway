import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useThreadContext } from "../ThreadContextProvider";
import { SortThreads } from "../components/SortThreads";
import { SearchBar } from "../components/SearchBar";

export const ThreadView = () => {
  const { threads, setThreads } = useThreadContext();
  const [sortBy, setSortBy] = useState("activity");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = searchTerm
          ? `http://localhost:3000/api/threads?sortBy=${sortBy}&searchTerm=${searchTerm}`
          : `http://localhost:3000/api/threads?sortBy=${sortBy}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch threads: ${response.status}`);
        }
        const data = await response.json();
        setThreads(data);
      } catch (error) {
        console.error("Error fetching threads:", error);
        setError("Kunde inte hämta trådar, försök igen senare.");
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [sortBy, searchTerm, setThreads]);

  return (
    <div className="container">
      <h1>Alla Trådar</h1>

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <SortThreads setSortBy={setSortBy} />

      {loading && <p className="loading">Laddar trådar...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && threads.length === 0 && (
        <p>Inga trådar matchade din sökning.</p>
      )}

      {threads.map(thread => (
        <div key={thread.thread_id} className="thread-card">
          <h2>{thread.thread_title}</h2>
          <p>{thread.thread_content}</p>
          <p>Antal kommentarer: {thread.comment_count}</p>
          <p>
            Senaste aktivitet:{" "}
            {thread.last_activity
              ? new Date(thread.last_activity).toLocaleString()
              : "Ingen aktivitet ännu"}
          </p>
          <Link to={`/threads/${thread.thread_id}`} className="btn">
            Visa detaljer
          </Link>
          <Link to={`/new-comment/${thread.thread_id}`} className="btn">
            Kommentera
          </Link>
        </div>
      ))}
    </div>
  );
};
