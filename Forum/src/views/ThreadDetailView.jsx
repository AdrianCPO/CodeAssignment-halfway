import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const ThreadDetailView = () => {
  const { threadId } = useParams(); // Få threadId från URL
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  // Hämta trådinformation
  useEffect(() => {
    if (!threadId) return;

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

  // Hämta kommentarer för tråden
  useEffect(() => {
    if (!threadId) return;

    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/comments/${threadId}`
        );
        if (response.ok) {
          const data = await response.json();
          setComments(data); // Om inga kommentarer finns, sätt kommentarer till tom array
        } else {
          setComments([]); // Sätt till tom array om ingen kommentar finns eller om svar inte är OK
        }
      } catch (error) {
        setComments([]); // Om det uppstår ett fel, sätt kommentarer till tom array
      }
    };

    fetchComments();
  }, [threadId]);

  // Hantera laddning och fel
  if (loading) {
    return <div>Laddar trådinformation...</div>;
  }

  if (error) {
    return <div>Fel: {error}</div>;
  }

  if (!thread) {
    return <div>Tråden kunde inte hittas.</div>;
  }

  return (
    <div className="thread-detail-view">
      <h1>{thread.thread_title}</h1>
      <p>{thread.thread_content}</p>
      <p>Författare: {thread.thread_author}</p>
      <p>Publicerad: {thread.thread_timestamp}</p>
      <p>Status: {thread.thread_status}</p>

      {/* Antal kommentarer */}
      <p>Antal kommentarer: {comments.length}</p>

      {/* Knapp för att visa kommentarer */}
      <button onClick={() => setShowComments(prevState => !prevState)}>
        {showComments ? "Dölj kommentarer" : "Visa kommentarer"}
      </button>

      {/* Visa kommentarer om showComments är true */}
      {showComments && (
        <div className="comments-section">
          {comments.length === 0 ? (
            <p>
              Inga kommentarer än.
            </p> /* Detta meddelande visas om inga kommentarer finns */
          ) : (
            comments.map(comment => (
              <div key={comment.comment_id} className="comment">
                <p>
                  <strong>{comment.comment_author}</strong>:{" "}
                  {comment.comment_content}
                </p>
                <p>Publicerad: {comment.comment_timestamp}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
