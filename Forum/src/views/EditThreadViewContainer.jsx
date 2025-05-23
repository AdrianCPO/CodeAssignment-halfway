import { useState, useEffect } from "react";
import {
  fetchThreads,
  fetchThreadById,
  updateThreadById,
} from "../api/apiService";
import { ThreadForm } from "../components/ThreadForm";

export const EditThreadViewContainer = () => {
  const [threads, setThreads] = useState([]);
  const [threadId, setThreadId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  const [status, setStatus] = useState("open");
  const [categoryIds, setCategoryIds] = useState([]);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const loadThreads = async () => {
      try {
        const data = await fetchThreads();
        setThreads(data);
      } catch (error) {
        console.error("Failed to fetch threads", error);
      }
    };
    loadThreads();
  }, []);

  const handleThreadSelectChange = async e => {
    const selectedThreadId = e.target.value;
    setThreadId(selectedThreadId);
    setFormError(null);
    if (selectedThreadId) {
      try {
        const selectedThread = await fetchThreadById(selectedThreadId);
        setTitle(selectedThread.thread_title);
        setContent(selectedThread.thread_content);
        setAuthor(selectedThread.thread_author);
        setTimestamp(new Date(selectedThread.thread_timestamp).toISOString());
        setStatus(selectedThread.thread_status);
        const normalizedCategories = selectedThread.category_ids
          ? selectedThread.category_ids.map(id => Number(id))
          : [];
        setCategoryIds(normalizedCategories);
      } catch (error) {
        console.error("Failed to fetch thread details:", error);
        setFormError("Det gick inte att hämta trådens detaljer.");
      }
    } else {
      setTitle("");
      setContent("");
      setAuthor("");
      setTimestamp(new Date().toISOString());
      setStatus("open");
      setCategoryIds([]);
    }
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setFormError(null);

    if (!threadId) {
      setFormError("Vänligen välj en tråd att redigera.");
      return;
    }
    if (!title.trim() || !content.trim() || !author.trim()) {
      setFormError("Titel, innehåll och författare måste fyllas i.");
      return;
    }

    const updatedThread = {
      thread_title: title,
      thread_content: content,
      thread_author: author,
      thread_timestamp: timestamp,
      thread_status: status,
      category_ids: categoryIds,
    };

    try {
      const updatedThreadResponse = await updateThreadById(
        threadId,
        updatedThread
      );
      if (updatedThreadResponse) {
        alert("Tråden har uppdaterats!");
        setThreads(prevThreads =>
          prevThreads.map(thread =>
            thread.thread_id === updatedThreadResponse.thread_id
              ? updatedThreadResponse
              : thread
          )
        );
      }
    } catch (error) {
      console.error("Failed to update thread", error);
      setFormError("Det gick inte att uppdatera tråden.");
    }
  };

  return (
    <div className="container edit-thread-container">
      <h1>Redigera Tråd</h1>
      <ThreadForm
        threads={threads}
        threadId={threadId}
        title={title}
        content={content}
        author={author}
        timestamp={timestamp}
        status={status}
        categoryIds={categoryIds}
        formError={formError}
        onThreadSelectChange={handleThreadSelectChange}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onAuthorChange={setAuthor}
        onTimestampChange={setTimestamp}
        onStatusChange={e => setStatus(e.target.value)}
        onCategoryChange={setCategoryIds}
        onSubmit={handleUpdate}
      />
    </div>
  );
};
