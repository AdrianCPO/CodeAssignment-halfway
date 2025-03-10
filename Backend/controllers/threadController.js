//Här samlar du all logik som hanterar själva API-anropen, som att ta emot request-data, anropa modeller och returnera svar till klienten.
//Exempel: blogController.js som innehåller funktionerna för att hantera blogginlägg (som att hämta, skapa, uppdatera och ta bort bloggar).
// /controllers/blogController.js
import {
  getAllThreads,
  getThreadById,
  createThread,
  updateThread,
  deleteThread,
  searchThreads,
  getThreadSortedByActivity,
  getThreadSortedByComments,
} from "../models/threadModel.js";

export const getThreads = (req, res) => {
  const { sortBy, searchTerm } = req.query;
  console.log("Sorting by:", sortBy);
  console.log("Search term:", searchTerm);

  try {
    let threads;

    if (searchTerm) {
      console.log("Searching with search term:", searchTerm);
      threads = searchThreads(searchTerm);
    } else if (sortBy === "activity") {
      console.log("Sorting by activity");
      threads = getThreadSortedByActivity();
    } else if (sortBy === "comments") {
      console.log("Sorting by comments");
      threads = getThreadSortedByComments();
    } else {
      console.log("Fetching all threads");
      threads = getAllThreads();
    }

    console.log("Returning threads:", threads);
    res.json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({
      message: "An error occurred while fetching threads",
      error: error.message,
    });
  }
};

export const getThreadByIdController = (req, res) => {
  const threadId = req.params.threadId;

  if (isNaN(threadId)) {
    return res.status(400).json({ message: "Invalid ID format" }); // Kontrollera om id är ogiltigt
  }

  try {
    const thread = getThreadById(threadId); // Rätt anrop av modellens funktion
    if (thread) {
      res.json(thread); // Skicka tråden om den finns
    } else {
      res.status(404).json({ message: "Thread not found" }); // Om tråden inte finns
    }
  } catch (error) {
    console.error("Error fetching thread:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the thread" });
  }
};

export const newThread = (req, res) => {
  const {
    thread_title,
    thread_content,
    thread_author,
    thread_timestamp,
    thread_status,
  } = req.body;

  try {
    createThread(
      thread_title,
      thread_content,
      thread_author,
      thread_timestamp,
      thread_status
    );
    res.status(201).json({ message: "Thread created successfully" });
  } catch (error) {
    console.error("Error creating thread:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred while creating the thread" });
  }
};

export const editThread = (req, res) => {
  const threadId = req.params.threadId;
  const {
    thread_title,
    thread_content,
    thread_author,
    thread_timestamp,
    thread_status,
  } = req.body;

  try {
    updateThread(
      threadId,
      thread_title,
      thread_content,
      thread_author,
      thread_timestamp,
      thread_status
    );
    const updatedThread = getThreadById(threadId);
    if (updatedThread) {
      res.json(updatedThread);
    } else {
      res.status(404).json({ message: "Thread not found" });
    }
  } catch (error) {
    console.error("Error updating thread:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred while updating the thread" });
  }
};

export const deleteThreadById = async (req, res) => {
  try {
    const result = await deleteThread(req.params.threadId); // Kör deleteThread

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    // Hämta de uppdaterade trådarna efter radering
    const threads = await getAllThreads();
    res.json(threads); // Returnera alla trådar som är kvar efter raderingen
  } catch (error) {
    console.error("Error deleting thread:", error.message);
    res.status(500).json({
      message: "An error occurred while deleting the thread",
      error: error.message,
    });
  }
};
