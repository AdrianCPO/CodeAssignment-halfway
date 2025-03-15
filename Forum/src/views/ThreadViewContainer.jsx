// ThreadViewContainer.jsx
import { useEffect, useState } from "react";
import { useThreadContext } from "../ThreadContextProvider";
import { fetchThreads, fetchThreadsByCategory } from "../api/apiService";
import { SearchBar } from "../components/SearchBar";
import { SortThreads } from "../components/SortThreads";
import { CategoryFilter } from "../components/CategoryFilter";
import { ThreadList } from "../components/ThreadList";

export const ThreadViewContainer = () => {
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

      <ThreadList threads={threads} loading={loading} error={error} />
    </div>
  );
};
