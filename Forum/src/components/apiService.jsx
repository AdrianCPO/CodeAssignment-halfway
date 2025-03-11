export const fetchThreads = async (sortBy, searchTerm) => {
  try {
    let url = `http://localhost:3000/api/threads?sortBy=${sortBy}`;
    if (searchTerm) url += `&searchTerm=${searchTerm}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch threads");

    return await response.json();
  } catch (error) {
    console.error("Error fetching threads:", error);
    throw error;
  }
};

export const fetchThreadById = async threadId => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/threads/${threadId}`
    );
    if (!response.ok) throw new Error("Thread not found");
    return await response.json();
  } catch (error) {
    console.error("Error fetching thread:", error);
    throw error;
  }
};

export const createThread = async newThread => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/threads/new-thread",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newThread),
      }
    );
    if (!response.ok) throw new Error("Failed to create thread");
    return await response.json();
  } catch (error) {
    console.error("Error creating thread:", error);
    throw error;
  }
};
export const updateThread = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/threads");
    if (!response.ok) {
      throw new Error("Failed to fetch threads");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return []; // Returnera en tom array om något går fel
  }
};
export const updateThreadById = async (threadId, updatedThread) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/threads/edit-thread/${threadId}`, // Se till att din backend stödjer denna route
      {
        method: "PUT", // Eller "PATCH" om du vill uppdatera endast vissa fält
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedThread),
      }
    );
    if (!response.ok) throw new Error("Failed to update thread");
    return await response.json();
  } catch (error) {
    console.error("Error updating thread:", error);
    throw error;
  }
};

export const deleteThread = async threadId => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/threads/delete-thread/${threadId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Failed to delete thread");
  } catch (error) {
    console.error("Error deleting thread:", error);
    throw error;
  }
};
