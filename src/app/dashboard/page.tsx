"use client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { useBoards } from "@/lib/hooks/useBoards";
const page = () => {
  const { user } = useUser();
  const { createBoard } = useBoards();
  const handleCreateBoard = async () => {
    await createBoard({
      title: "New Board",
      description: "This is a new board",
      color: "bg-blue-500",
    });
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 sm:py-8">
        <div className="mb-6 sm:ms-8">
          <h1 className="text-3xl font-bold sm:text-3xl text-gray-900 mb-2">
            welecome back,{" "}
            {user?.firstName ?? user?.emailAddresses[0].emailAddress} 👋
          </h1>
          <p className="text-lg text-gray-600"> here is your dashboard</p>
          <Button
            className="mt-4 sm:w-auto cursor-pointer "
            onClick={handleCreateBoard}
          >
            <Plus className="mr-2 w-4 h-4 " />
            Create board
          </Button>
        </div>
      </main>
    </div>
  );
};

export default page;
