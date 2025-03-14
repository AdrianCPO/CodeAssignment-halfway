import { Link } from "react-router-dom";
import { ThreadInput } from "./ThreadInput";
import { CategorySelect } from "./CategorySelect";
import { ErrorMessage } from "./ErrorMessage";

export const ThreadForm = ({
  threads,
  threadId,
  title,
  content,
  author,
  timestamp,
  status,
  categoryIds,
  formError,
  onThreadSelectChange,
  onTitleChange,
  onContentChange,
  onAuthorChange,
  onTimestampChange,
  onStatusChange,
  onCategoryChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="edit-thread-form">
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
      <ThreadInput
        label="Titel"
        value={title}
        onChange={onTitleChange}
        placeholder="Ange titel"
      />
      <ThreadInput
        label="Innehåll"
        value={content}
        onChange={onContentChange}
        placeholder="Ange innehåll"
        isTextArea={true}
      />
      <ThreadInput
        label="Författare"
        value={author}
        onChange={onAuthorChange}
        placeholder="Ange författarnamn"
      />
      <label>Redigera Kategori(er)</label>
      <CategorySelect value={categoryIds} onChange={onCategoryChange} />
      <ThreadInput
        label="Datum"
        value={timestamp}
        onChange={onTimestampChange}
        placeholder="Ange datum"
      />
      <label>Status</label>
      <select
        value={status}
        onChange={onStatusChange}
        className="status-select"
      >
        <option value="open">Öppen</option>
        <option value="closed">Stängd</option>
      </select>
      <ErrorMessage message={formError} />
      <button type="submit" className="btn">
        Uppdatera
      </button>
    </form>
  );
};
