"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePanel } from "@/context/PanelContext";
import { allChats as demoChats } from "@/data/overview";
import { ChatItem } from "@/types/chat";
import { Classroom } from "@/types/classroom";
import { Bot } from "@/types/bot";

interface LeftPanelDataContextType {
  allChats: ChatItem[];
  allClassrooms: Classroom[];
  allBots: Bot[];
  setAllChats: React.Dispatch<React.SetStateAction<ChatItem[]>>;
  setAllClassrooms: React.Dispatch<React.SetStateAction<Classroom[]>>;
  setAllBots: React.Dispatch<React.SetStateAction<Bot[]>>;
  fetchData: () => Promise<void>;
  loading: boolean; // loading state
}

const LeftPanelDataContext = createContext<LeftPanelDataContextType | undefined>(undefined);

export const useLeftPanelData = () => {
  const context = useContext(LeftPanelDataContext);
  if (!context) throw new Error("useLeftPanelData must be used within LeftPanelDataProvider");
  return context;
};

export const LeftPanelDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { activeTab } = usePanel();

  const [allChats, setAllChats] = useState<ChatItem[]>([]);
  const [allClassrooms, setAllClassrooms] = useState<Classroom[]>([]);
  const [allBots, setAllBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // loading state

  // Fetch functions
  const fetchChats = async () => {
    try {
      setLoading(true);
      // Replace with server fetch if needed
      await new Promise((res) => setTimeout(res, 500)); // simulate fetch delay
      setAllChats(demoChats);
    } catch (err) {
      console.error("Failed to fetch chats", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 500)); // simulate fetch delay
      setAllClassrooms([{ id: "1", name: "Math Class" }]);
    } catch (err) {
      console.error("Failed to fetch classrooms", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBots = async () => {
    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 500)); // simulate fetch delay
      setAllBots([{ id: "1", name: "Helper Bot" }]);
    } catch (err) {
      console.error("Failed to fetch bots", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFunctions: Record<string, () => Promise<void>> = {
    chats: fetchChats,
    classroom: fetchClassrooms,
    bots: fetchBots,
  };

  const fetchData = async () => {
    if (fetchFunctions[activeTab]) {
      await fetchFunctions[activeTab]();
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  return (
    <LeftPanelDataContext.Provider
      value={{
        allChats,
        allClassrooms,
        allBots,
        setAllChats,
        setAllClassrooms,
        setAllBots,
        fetchData,
        loading,
      }}
    >
      {children}
    </LeftPanelDataContext.Provider>
  );
};
