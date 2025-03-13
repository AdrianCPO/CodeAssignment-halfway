import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCommentContext } from "../CommentContextProvider";
import { CommentInput } from "../components/commentInput";
import {
  fetchCommentsByThreadId,
  createComment,
} from "../components/apiServiceComments";

export const AddCommentView = () => {
  const { threadId } = useParams(); // Hämta threadId från URL
  const { comments, setComments } = useCommentContext(); // Hämtar kommentarerna från context
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetchedComments = await fetchCommentsByThreadId(threadId);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };
    loadComments();
  }, [threadId, setComments]);

  const handleSubmit = async e => {
    e.preventDefault();
    const commentTimestamp = new Date().toISOString();

    const commentData = {
      comment_content: comment,
      comment_author: author,
      comment_timestamp: commentTimestamp,
    };

    try {
      const addedComment = await createComment(threadId, commentData);
      setComments([...comments, addedComment]);
      // Visa en alert när kommentaren har skapats
      alert("Kommentaren har skapats!");
      setComment("");
      setAuthor("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <section className="container new-comment-container">
      <h1>Lägg till Kommentar</h1>

      <form onSubmit={handleSubmit} className="new-comment-form">
        <CommentInput
          value={comment}
          onChange={setComment}
          onSubmit={handleSubmit}
        />

        <input
          className="input-field"
          type="text"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="Ditt namn"
        />

        <button type="submit" className="btn">
          Lägg till Kommentar
        </button>
      </form>
    </section>
  );
};
