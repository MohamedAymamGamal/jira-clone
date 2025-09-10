"use client";
import { useUser } from "@clerk/nextjs";
import { boardDataService } from "../services";
import { useState } from "react";
import { Board } from "../supabase/models";

export function useBoards() {
  const { user } = useUser();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  async function createBoard(boardData: {
    title: string;
    description: string;
    color?: string;
  }) {
    if (!user) throw new Error("User not found");
    try {
      const newBoard = await boardDataService.createBoardwithDefaultColumns({
        ...boardData,

        user_id: user.id,
        tile: "",
      });
      setBoards((perv) => [newBoard, ...perv]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }
  return { createBoard, error, boards, loading };
}
