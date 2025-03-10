import { createContext, useState, useContext } from "react";

const ThreadContext = createContext();

export const useThreadContext = () => {
  return useContext(ThreadContext);
};

export const ThreadContextProvider = ({ children }) => {
  const [threads, setThreads] = useState([]); // Initialisera som tom array

  return (
    <ThreadContext.Provider value={{ threads, setThreads }}>
      {children}
    </ThreadContext.Provider>
  );
};
