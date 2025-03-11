import { useState, useEffect } from "react";

export const EditCommentView = () => {
  const [commentId, setCommentId] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [author, setAuthor] = useState("");
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  const [comments, setComments] = useState([]);

  // Hämta alla kommentarer vid första renderingen
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/comments");
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, []);

  // Hantera val av kommentar att redigera
  const handleSelectChange = e => {
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

  // Hantera uppdatering av en kommentar
  const handleUpdate = async e => {
    e.preventDefault();

    const updatedComment = {
      comment_content: commentContent,
      comment_author: author,
      comment_timestamp: timestamp,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/comments/edit-comment/${commentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedComment),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      const updatedCommentResponse = await response.json();

      // Uppdatera den specifika kommentaren i listan lokalt
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.comment_id === updatedCommentResponse.comment_id
            ? updatedCommentResponse
            : comment
        )
      );

      alert("Comment updated successfully!");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  return (
    <div className="container edit-comment-container">
      <h1>Redigera Kommentar</h1>

      <form onSubmit={handleUpdate} className="edit-comment-form">
        <label htmlFor="comment-select">Välj en kommentar:</label>
        <select
          id="comment-select"
          className="comment-select"
          value={commentId}
          onChange={handleSelectChange}
        >
          <option value="">Välj en kommentar</option>
          {comments.map(comment => (
            <option key={comment.comment_id} value={comment.comment_id}>
              {comment.comment_content.substring(0, 30)}...
            </option>
          ))}
        </select>

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
