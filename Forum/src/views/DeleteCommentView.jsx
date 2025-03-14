import { deleteComment } from "../api/apiServiceComments";

export const DeleteCommentView = ({ comments, setComments }) => {
  const handleCommentDelete = async id => {
    try {
      await deleteComment(id);

      // Ta bort kommentaren från listan utan att behöva hämta om alla kommentarer
      setComments(prevComments =>
        prevComments.filter(comment => comment.comment_id !== id)
      );

      // Visa en alert när kommentaren har tagits bort
      alert("Kommentaren har tagits bort!");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="container delete-comment-container">
      <h1>Ta bort Kommentar</h1>

      {comments.length === 0 ? (
        <p className="info-text">Inga kommentarer att visa.</p>
      ) : (
        comments.map(comment => (
          <div key={comment.comment_id} className="comment-card">
            <p className="comment-author">{comment.comment_author}</p>
            <p>{comment.comment_content}</p>
            <button
              className="btn danger"
              onClick={() => handleCommentDelete(comment.comment_id)}
            >
              Ta bort kommentar
            </button>
          </div>
        ))
      )}
    </div>
  );
};
