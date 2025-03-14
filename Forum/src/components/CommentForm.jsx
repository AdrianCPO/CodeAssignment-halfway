// CommentForm.jsx
import { ErrorMessage } from "./ErrorMessage";

export const CommentForm = ({
  threads,
  threadId,
  comments,
  commentId,
  commentContent,
  author,
  formError,
  onThreadSelectChange,
  onCommentSelectChange,
  onContentChange,
  onAuthorChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="edit-comment-form">
      <label htmlFor="thread-select">Välj en tråd:</label>
      <select
        id="thread-select"
        className="thread-select"
        value={threadId}
        onChange={onThreadSelectChange}
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
            onChange={onCommentSelectChange}
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
        onChange={e => onContentChange(e.target.value)}
        placeholder="Redigera kommentar"
      />
      <input
        className="input-field"
        type="text"
        value={author}
        onChange={e => onAuthorChange(e.target.value)}
        placeholder="Författare"
      />
      <ErrorMessage message={formError} />
      <button type="submit" className="btn">
        Uppdatera kommentar
      </button>
    </form>
  );
};
