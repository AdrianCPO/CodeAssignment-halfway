export const fetchThreads = async (sortBy, searchTerm) => {
  try {
    {
      /* Skapar URL med sorteringsparameter och eventuellt söktermen */
    }
    let url = `http://localhost:3000/api/threads?sortBy=${sortBy}`;
    if (searchTerm) url += `&searchTerm=${searchTerm}`;

    {
      /* Hämtar trådar från API:t */
    }
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
    {
      /* Hämtar en specifik tråd med dess ID */
    }
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
    {
      /* Skickar en POST-begäran för att skapa en ny tråd */
    }
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
    {
      /* Hämtar alla trådar, troligen för att uppdatera frontend-data */
    }
    const response = await fetch("http://localhost:3000/api/threads");
    if (!response.ok) {
      throw new Error("Failed to fetch threads");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return []; // Returnerar en tom array om något går fel
  }
};

export const updateThreadById = async (threadId, updatedThread) => {
  try {
    {
      /* Skickar en PUT-begäran för att uppdatera en tråd med ett specifikt ID */
    }
    const response = await fetch(
      `http://localhost:3000/api/threads/edit-thread/${threadId}`,
      {
        method: "PUT",
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
    {
      /* Skickar en DELETE-begäran för att radera en tråd */
    }
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
