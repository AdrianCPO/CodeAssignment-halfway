import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DeleteCommentView } from "./DeleteCommentView"; // Importera DeleteCommentView

export const ThreadDetailView = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState(false); // ✅ Hanterar visning av kommentarer

  // Hämtar trådinformation
  useEffect(() => {
    const fetchThreadDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/threads/${threadId}`
        );
        if (!response.ok) throw new Error("Det gick inte att hämta tråden");
        const data = await response.json();
        setThread(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchThreadDetails();
  }, [threadId]);

  // Hämtar kommentarer för tråden
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/comments/${threadId}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            setComments([]); // Om inga kommentarer hittas, sätt en tom array
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
    fetchComments();
  }, [threadId]);

  // Hantera laddning, fel och inga kommentarer
  if (loading) return <div>Laddar trådinformation...</div>;
  if (error) return <div>Fel: {error}</div>;
  if (!thread) return <div>Tråden kunde inte hittas.</div>;

  return (
    <div className="container">
      <h1>{thread.thread_title}</h1>
      <p>{thread.thread_content}</p>
      <h3>Författare: {thread.thread_author}</h3>
      <p>Publicerad: {thread.thread_timestamp}</p>
      <p>Status: {thread.thread_status}</p>

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
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};
