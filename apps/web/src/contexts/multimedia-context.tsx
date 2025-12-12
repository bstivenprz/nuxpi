import {
  useMultimedia,
  UseMultimedia,
  UseMultimediaOptions,
} from "@/hooks/use-multimedia";
import { createContext, useContext } from "react";

export const MultimediaContext = createContext<UseMultimedia | null>(null);

export function MultimediaContextProvider({
  children,
  options,
}: {
  children: React.ReactNode;
  options?: UseMultimediaOptions;
}) {
  const hook = useMultimedia(options);
  return (
    <MultimediaContext.Provider value={hook}>
      {children}
    </MultimediaContext.Provider>
  );
}

export function useMultimediaContext() {
  const context = useContext(MultimediaContext);
  if (!context) {
    throw new Error(
      "useMultimediaContext must be used within a MultimediaContextProvider"
    );
  }
  return context;
}
