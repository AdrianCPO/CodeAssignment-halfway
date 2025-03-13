import { useState, useEffect } from "react";
import {
  fetchCommentsByThreadId,
  updateComment,
} from "../components/apiServiceComments";
import { fetchThreads } from "../components/apiService";

export const EditCommentView = () => {
  const [threadId, setThreadId] = useState("");
  const [commentId, setCommentId] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [author, setAuthor] = useState("");
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  const [threads, setThreads] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const loadThreads = async () => {
      try {
        const data = await fetchThreads(); // Hämta alla trådar
        setThreads(data);
      } catch (error) {
        console.error("Error fetching threads:", error);
      }
    };
    loadThreads();
  }, []);

  useEffect(() => {
    const loadComments = async () => {
      try {
        if (!threadId) return;
        const data = await fetchCommentsByThreadId(threadId); // Hämta kommentarer för vald tråd
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    loadComments();
  }, [threadId]);

  const handleThreadSelectChange = e => {
    setThreadId(e.target.value);
    setComments([]);
    setCommentId("");
  };

  const handleCommentSelectChange = e => {
    const selectedCommentId = e.target.value;
    const selectedComment = comments.find(
      comment => comment.comment_id.toString() === selectedCommentId
    );

    if (selectedComment) {
      setCommentId(selectedComment.comment_id);
      setCommentContent(selectedComment.comment_content);
      setAuthor(selectedComment.comment_author);
      setTimestamp(new Date(selectedComment.comment_timestamp).toISOString());
    }
  };

  const handleUpdate = async e => {
    e.preventDefault();

    const updatedComment = {
      comment_content: commentContent,
      comment_author: author,
      comment_timestamp: timestamp,
    };

    try {
      const updatedCommentResponse = await updateComment(
        commentId,
        updatedComment
      );

      setComments(prevComments =>
        prevComments.map(comment =>
          comment.comment_id === updatedCommentResponse.comment_id
            ? updatedCommentResponse
            : comment
        )
      );

      // Alert när kommentaren har uppdaterats
      alert("Kommentar uppdaterad!");
    } catch (error) {
      console.error("Fel vid uppdatering av kommentar:", error);
    }
  };

  return (
    <div className="container edit-comment-container">
      <h1>Redigera Kommentar</h1>

      <form onSubmit={handleUpdate} className="edit-comment-form">
        <label htmlFor="thread-select">Välj en tråd:</label>
        <select
          id="thread-select"
          className="thread-select"
          value={threadId}
          onChange={handleThreadSelectChange}
        >
          <option value="">Välj en tråd</option>
          {threads.map(thread => (
            <option key={thread.thread_id} value={thread.thread_id}>
              {thread.thread_title}
            </option>
          ))}
        </select>

        {threadId && (
          <>
            <label htmlFor="comment-select">Välj en kommentar:</label>
            <select
              id="comment-select"
              className="comment-select"
              value={commentId}
              onChange={handleCommentSelectChange}
            >
              <option value="">Välj en kommentar</option>
              {comments.map(comment => (
                <option key={comment.comment_id} value={comment.comment_id}>
                  {comment.comment_content.substring(0, 30)}...
                </option>
              ))}
            </select>
          </>
        )}

        <textarea
          className="input-textarea"
          value={commentContent}
          onChange={e => setCommentContent(e.target.value)}
          placeholder="Redigera kommentar"
        />

        <input
          className="input-field"
          type="text"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="Författare"
        />

        <button type="submit" className="btn">
          Uppdatera kommentar
        </button>
      </form>
    </div>
  );
};
