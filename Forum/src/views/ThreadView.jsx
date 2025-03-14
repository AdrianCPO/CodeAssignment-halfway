import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useThreadContext } from "../ThreadContextProvider";
import { SortThreads } from "../components/SortThreads";
import { SearchBar } from "../components/SearchBar";
import { CategoryFilter } from "../components/CategoryFilter";
import { fetchThreads, fetchThreadsByCategory } from "../api/apiService";

export const ThreadView = () => {
  const { threads, setThreads } = useThreadContext();
  const [sortBy, setSortBy] = useState("activity");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadThreads = async () => {
      setLoading(true);
      setError(null);

      try {
        let data;
        if (selectedCategory) {
          data = await fetchThreadsByCategory(selectedCategory);
        } else {
          data = await fetchThreads(sortBy, searchTerm);
        }

        console.log("Hämtade trådar:", data); // Debugga API-svaret
        setThreads(data);
      } catch (error) {
        console.error("Error fetching threads:", error);
        setError("Kunde inte hämta trådar, försök igen senare.");
      } finally {
        setLoading(false);
      }
    };

    loadThreads();
  }, [sortBy, searchTerm, selectedCategory, setThreads]);

  return (
    <div className="container">
      <h1>Alla Trådar</h1>

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <SortThreads setSortBy={setSortBy} />
      <CategoryFilter onSelectCategory={setSelectedCategory} />

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
            Status:{" "}
            {thread.thread_status === "closed" ? "🔒 Stängd" : "✅ Öppen"}
          </p>
          <p>
            Senaste aktivitet:{" "}
            {thread.last_activity
              ? new Date(thread.last_activity).toLocaleString()
              : "Ingen aktivitet ännu"}
          </p>
          <Link to={`/threads/${thread.thread_id}`} className="btn">
            Visa detaljer
          </Link>
          {thread.thread_status === "open" && (
            <Link to={`/new-comment/${thread.thread_id}`} className="btn">
              Kommentera
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};
