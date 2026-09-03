import { createContext, useContext } from "react";

const DarkModeContext = createContext();

function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode was used outside of a DarkModeProvider");
  }
  return context;
}

export { DarkModeContext, useDarkMode };
