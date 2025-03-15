// EditCommentViewContainer.jsx
import { useState, useEffect } from "react";
import {
  fetchCommentsByThreadId,
  updateComment,
} from "../api/apiServiceComments";
import { fetchThreads } from "../api/apiService";
import { CommentForm } from "../components/CommentForm";

export const EditCommentViewContainer = () => {
  const [threads, setThreads] = useState([]);
  const [threadId, setThreadId] = useState("");
  const [comments, setComments] = useState([]);
  const [commentId, setCommentId] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [author, setAuthor] = useState("");
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const loadThreads = async () => {
      try {
        const data = await fetchThreads();
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
        const data = await fetchCommentsByThreadId(threadId);
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
    setFormError(null);

    if (!threadId || !commentId) {
      setFormError("Vänligen välj både tråd och kommentar.");
      return;
    }
    if (!commentContent.trim() || !author.trim()) {
      setFormError("Kommentarens innehåll och författare måste fyllas i.");
      return;
    }

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
      alert("Kommentar uppdaterad!");
    } catch (error) {
      console.error("Fel vid uppdatering av kommentar:", error);
      setFormError("Det gick inte att uppdatera kommentaren.");
    }
  };

  return (
    <div className="container edit-comment-container">
      <h1>Redigera Kommentar</h1>
      <CommentForm
        threads={threads}
        threadId={threadId}
        comments={comments}
        commentId={commentId}
        commentContent={commentContent}
        author={author}
        formError={formError}
        onThreadSelectChange={handleThreadSelectChange}
        onCommentSelectChange={handleCommentSelectChange}
        onContentChange={setCommentContent}
        onAuthorChange={setAuthor}
        onSubmit={handleUpdate}
      />
    </div>
  );
};
