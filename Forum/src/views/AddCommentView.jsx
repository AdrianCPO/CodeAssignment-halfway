import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCommentContext } from "../CommentContextProvider"; 
import { CommentInput } from "../components/commentInput";

export const AddCommentView = () => {
  const { threadId } = useParams(); // Hämta threadId från URL
  const { comments, setComments } = useCommentContext(); // Hämtar kommentarerna från context (om du har det)
  const [comment, setComment] = useState(""); // För själva kommentaren
  const [author, setAuthor] = useState(""); // För författaren

  // Hämta existerande kommentarer för denna tråd när sidan laddas (om det behövs)
  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(
        `http://localhost:3000/api/comments/${threadId}` // Använd threadId i URL:en för att få rätt kommentarer
      );
      if (response.ok) {
        const fetchedComments = await response.json();
        setComments(fetchedComments); // Uppdatera kommentarlistan i context
      } else {
        console.error("Failed to fetch comments, or no comments exist");
      }
    };

    fetchComments();
  }, [threadId, setComments]);

  const handleSubmit = async e => {
    e.preventDefault(); // Hindra omladdning av sidan vid submit

    const commentTimestamp = new Date().toLocaleString();

    const commentData = {
      comment_content: comment,
      comment_author: author,
      comment_timestamp: commentTimestamp,
      // Inkludera threadId här för att koppla kommentaren till rätt tråd
    };

    // Skicka den nya kommentaren till API:et och använd korrekt URL för att skapa en kommentar i rätt tråd
    const response = await fetch(
      `http://localhost:3000/api/comments/${threadId}/new-comment`, // Använd rätt URL med threadId
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      }
    );

    if (response.ok) {
      const addedComment = await response.json();
      setComments([...comments, addedComment]); // Uppdatera kommentarlistan
      setComment(""); // Rensa kommentarsfältet
      setAuthor(""); // Rensa författarens namn
    } else {
      console.error("Failed to add comment");
    }
  };

  return (
    <section className="new-comment-view-container">
      <h1>Lägg till kommentar</h1>

      <CommentInput
        value={comment}
        onChange={setComment}
        onSubmit={handleSubmit} // Ingen behov av onClick här
      />
      <input
        type="text"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        placeholder="Your name"
      />
    </section>
  );
};
