import React, { createContext, useContext, useState, useEffect } from "react";

interface Idea {
  id: string;
  title: string;
  description: string;
  problem: string;
  mvpFeatures: string[];
  [key: string]: any;
}

interface IdeaContextType {
  activeIdea: Idea | null;
  setActiveIdea: (idea: Idea | null) => void;
  executedIdeaIds: string[];
  setExecutedIdeaIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const IdeaContext = createContext<IdeaContextType | undefined>(undefined);

export function IdeaProvider({ children }: { children: React.ReactNode }) {
  const [activeIdea, setActiveIdeaState] = useState<Idea | null>(() => {
    const saved = localStorage.getItem("moneyforge_active_idea");
    return saved ? JSON.parse(saved) : null;
  });

  const [executedIdeaIds, setExecutedIdeaIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("moneyforge_executed_ids");
    return saved ? JSON.parse(saved) : [];
  });

  const setActiveIdea = (idea: Idea | null) => {
    setActiveIdeaState(idea);
    if (idea) {
      localStorage.setItem("moneyforge_active_idea", JSON.stringify(idea));
    } else {
      localStorage.removeItem("moneyforge_active_idea");
    }
  };

  useEffect(() => {
    localStorage.setItem("moneyforge_executed_ids", JSON.stringify(executedIdeaIds));
  }, [executedIdeaIds]);

  return (
    <IdeaContext.Provider value={{ activeIdea, setActiveIdea, executedIdeaIds, setExecutedIdeaIds }}>
      {children}
    </IdeaContext.Provider>
  );
}

export function useIdea() {
  const context = useContext(IdeaContext);
  if (context === undefined) {
    throw new Error("useIdea must be used within an IdeaProvider");
  }
  return context;
}
