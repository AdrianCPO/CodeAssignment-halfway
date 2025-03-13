import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchThreadById } from "../components/apiService";
import { deleteComment } from "../components/apiServiceComments";
import { fetchCategories } from "../components/apiServiceCategories";

export const ThreadDetailView = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [threadCategories, setThreadCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchThreadDetails = async () => {
      try {
        const data = await fetchThreadById(threadId);
        setThread(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchThreadDetails();
  }, [threadId]);

  useEffect(() => {
    const fetchThreadComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/comments/${threadId}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            setComments([]);
          } else {
            throw new Error("Det gick inte att hämta kommentarer");
          }
        } else {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        setError(error.message);
        setComments([]);
      }
    };
    fetchThreadComments();
  }, [threadId]);

  // Ny useEffect: Hämta alla kategorier och filtrera ut de som matchar trådens kategori-ID:n
  useEffect(() => {
    const fetchThreadCategories = async () => {
      if (thread && thread.category_ids && thread.category_ids.length > 0) {
        try {
          const allCategories = await fetchCategories();
          const filteredCategories = allCategories.filter(cat =>
            thread.category_ids.includes(cat.category_id)
          );
          setThreadCategories(filteredCategories);
        } catch (error) {
          console.error("Error fetching categories for thread:", error);
        }
      } else {
        setThreadCategories([]);
      }
    };
    fetchThreadCategories();
  }, [thread]);

  const handleDeleteComment = async commentId => {
    try {
      await deleteComment(commentId);
      setComments(prevComments =>
        prevComments.filter(comment => comment.comment_id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (loading) return <div>Laddar trådinformation...</div>;
  if (error) return <div>Fel: {error}</div>;
  if (!thread) return <div>Tråden kunde inte hittas.</div>;

  return (
    <div className="container">
      <h1>{thread.thread_title}</h1>
      <p>{thread.thread_content}</p>
      <h3>Författare: {thread.thread_author}</h3>
      <p>Publicerad: {thread.thread_timestamp}</p>
      <p>
        Status: {thread.thread_status === "closed" ? "🔒 Stängd" : "✅ Öppen"}
      </p>

      {/* Visa kategori(er) om de finns */}
      {threadCategories.length > 0 && (
        <p>
          Kategorier:{" "}
          {threadCategories.map(cat => cat.category_name).join(", ")}
        </p>
      )}

      <p>Antal kommentarer: {comments.length}</p>

      <button onClick={() => setShowComments(prev => !prev)}>
        {showComments ? "Dölj kommentarer" : "Visa kommentarer"}
      </button>

      {showComments &&
        (comments.length === 0 ? (
          <p>Inga kommentarer har lagts till än.</p>
        ) : (
          <div className="comment-list">
            {comments.map(comment => (
              <div key={comment.comment_id} className="comment-card">
                <p className="comment-author">{comment.comment_author}</p>
                <p>{comment.comment_content}</p>
                <button
                  className="btn danger"
                  onClick={() => handleDeleteComment(comment.comment_id)}
                >
                  Ta bort
                </button>
              </div>
            ))}
          </div>
        ))}

      {/* Visar bara kommentarsformuläret om tråden är öppen */}
      {thread.thread_status === "open" ? (
        <Link to={`/new-comment/${thread.thread_id}`} className="btn">
          Lägg till kommentar
        </Link>
      ) : (
        <p className="comment-locked">
          🔒 Denna tråd är stängd för kommentarer.
        </p>
      )}
    </div>
  );
};
