import { createContext, useState, useContext } from "react";

const CommentContext = createContext();

export const useCommentContext = () => {
  return useContext(CommentContext);
};

export const CommentContextProvider = ({ children }) => {
  const [comments, setComments] = useState([]);

  return (
    <CommentContext.Provider value={{ comments, setComments }}>
      {children}
    </CommentContext.Provider>
  );
};
