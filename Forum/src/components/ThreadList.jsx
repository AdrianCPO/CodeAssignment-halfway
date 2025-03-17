import { Link } from "react-router-dom";

export const ThreadList = ({ threads, loading, error }) => {
  if (loading) {
    return <p className="loading">Laddar trådar...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!loading && threads.length === 0) {
    return <p>Inga trådar matchade din sökning.</p>;
  }

  return (
    <>
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
    </>
  );
};
