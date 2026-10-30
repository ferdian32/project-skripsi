import { useState } from "react";
import { GlobalProvider } from "./GlobalProvider";

export const GlobalContext = ({ children }) => {
  const [activeCloseIcon, setActiveCloseIcon] = useState(false);
  const [article, setArticle] = useState([]);
  return (
    <GlobalProvider
      value={{ activeCloseIcon, setActiveCloseIcon, article, setArticle }}
    >
      {children}
    </GlobalProvider>
  );
};
