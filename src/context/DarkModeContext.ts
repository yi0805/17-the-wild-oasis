import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";

type DarkModeContextValue = {
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextValue | undefined>(undefined);

function useDarkMode(): DarkModeContextValue {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode was used outside of a DarkModeProvider");
  }
  return context;
}

export { DarkModeContext, useDarkMode };
