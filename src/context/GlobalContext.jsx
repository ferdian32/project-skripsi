import { useState } from "react";
import { GlobalProvider } from "./GlobalProvider";

export const GlobalContext = ({ children }) => {
  const [activeCloseIcon, setActiveCloseIcon] = useState(false);
  return (
    <GlobalProvider value={{ activeCloseIcon, setActiveCloseIcon }}>
      {children}
    </GlobalProvider>
  );
};
