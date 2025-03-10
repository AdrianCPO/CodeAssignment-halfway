import { useState } from "react";
import { useThreadContext } from "../ThreadContextProvider";
import { ThreadInput } from "../components/ThreadInput";
import { updateThread } from "../components/updateThread";

export const AddThreadView = () => {
  const [threadTitle, setThreadTitle] = useState("");
  const [threadContent, setThreadContent] = useState("");
  const [threadAuthor, setThreadAuthor] = useState("");
  const [threadStatus, setThreadStatus] = useState("open"); // default status
  const { setThreads } = useThreadContext(); // Hämtar setThreads från context

  const handleSubmit = async e => {
    e.preventDefault();
    const threadTimestamp = new Date().toLocaleString();

    const newThread = {
      thread_title: threadTitle,
      thread_content: threadContent,
      thread_author: threadAuthor,
      thread_timestamp: threadTimestamp,
      thread_status: threadStatus,
    };

    // Skicka den nya tråden till API:et
    const response = await fetch(
      "http://localhost:3000/api/threads/new-thread",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newThread),
      }
    );

    if (response.ok) {
      const addedThread = await response.json();
      const updatedThreads = await updateThread(); // Hämta alla trådar igen
      setThreads(updatedThreads); // Uppdatera trådlistan i context
    } else {
      console.error("Det gick inte att skapa tråden.");
    }
  };

  return (
    <section className="container new-thread-container">
      <h1>Skapa Ny Tråd</h1>

      <form onSubmit={handleSubmit} className="new-thread-form">
        <ThreadInput
          label="Titel"
          value={threadTitle}
          onChange={setThreadTitle}
          placeholder="Ange trådens titel"
        />
        <ThreadInput
          label="Innehåll"
          value={threadContent}
          onChange={setThreadContent}
          placeholder="Ange trådens innehåll"
          isTextArea={true}
        />
        <ThreadInput
          label="Författare"
          value={threadAuthor}
          onChange={setThreadAuthor}
          placeholder="Ange ditt namn"
        />
        <ThreadInput
          label="Status"
          value={threadStatus}
          onChange={setThreadStatus}
          showStatusSelect={true}
        />

        <button type="submit" className="btn">
          Skapa Tråd
        </button>
      </form>
    </section>
  );
};
