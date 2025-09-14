"use client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import {
  Filter,
  Grid3x3,
  List,
  Loader2,
  Plus,
  Rocket,
  Search,
  Trello,
} from "lucide-react";
import { useBoards } from "@/lib/hooks/useBoards";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableProperties } from "lucide-react";
import { Timer } from "lucide-react";
import { ChartNoAxesColumn } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
const page = () => {
  const { user } = useUser();
  const { createBoard, boards, loading, error } = useBoards();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const handleCreateBoard = async () => {
    await createBoard({
      title: "New Board",
      description: "This is a new board",
      color: "bg-blue-500",
    });
  };
  //   if (loading){
  //     return <div>
  //       <Loader2><span>loading .....</span></Loader2>
  //     </div>
  //   }

  //  if (error){
  //     return <div>
  //       <Loader2><span>error loading .....</span></Loader2>
  //     </div>
  //   }

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
        {/* {stats} */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between ">
                <div>
                  <p className="text-sm sm:text-sm font-medium text-gray-600">
                    total boards
                  </p>
                  <p className="text-lg sm:text-lg font-bold text-gray-900">
                    {boards.length}
                  </p>
                </div>

                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center bg-blue justify-center sm:h-12 sm:w-12  ">
                  <Trello className="w-h w-5 sm:h-6 text-blue-600 " />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between ">
                <div>
                  <p className="text-sm sm:text-sm font-medium text-gray-600">
                    recent activity
                  </p>
                  <p className="text-lg sm:text-lg font-bold text-gray-900">
                    {
                      boards.filter((board) => {
                        const updateAt = new Date(board.updated_at);
                        const oneWeekAgo = new Date();
                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                        return updateAt > oneWeekAgo;
                      }).length
                    }
                  </p>
                </div>

                <div className="h-10 w-10 rounded-lg bg-purple-200 flex items-center bg-blue justify-center sm:h-12 sm:w-12  ">
                  <Timer className="w-h w-5 sm:h-6 text-blue-600 " />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between ">
                <div>
                  <p className="text-sm sm:text-sm font-medium text-gray-600">
                    total boards
                  </p>
                  <p className="text-lg sm:text-lg font-bold text-gray-900">
                    {boards.length}
                  </p>
                </div>

                <div className="h-10 w-10 rounded-lg bg-green-200 flex items-center bg-blue justify-center sm:h-12 sm:w-12  ">
                  <ChartNoAxesColumn className="w-h w-5 sm:h-6 text-blue-600 " />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between ">
                <div>
                  <p className="text-sm sm:text-sm font-medium text-gray-600">
                    total boards
                  </p>
                  <p className="text-lg sm:text-lg font-bold text-gray-900">
                    {boards.length}
                  </p>
                </div>

                <div className="h-10 w-10 rounded-lg bg-green-200 flex items-center bg-blue justify-center sm:h-12 sm:w-12  ">
                  <Rocket className="w-h w-5 sm:h-6 text-blue-600 " />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* boards */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0 ">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                your boards
              </h2>
              <p className="text-gray-600">mxanga your projects and tesks</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:space-x-4 px-4 py-2  bg-white border rounded-lg sm:items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0 ">
            <div className="flex items-center rounded-2xl space-x-2  bg-white border ">
              <Button
                className="cursor-pointer"
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 />
              </Button>
              <Button
                className="cursor-pointer"
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Filter />
              Filter
            </Button>
            <Button onClick={handleCreateBoard}>
              <Plus />
              Create Board
            </Button>
          </div>
        </div>
        {/* searchbar */}
        <div className="relative mb-6 sm:mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
          <Input id="search" placeholder="Search" className="pl-10" />
        </div>
        {/* boards Gridlist */}
        {boards.length == 0 ? (<div>no boards</div>) : viewMode === "grid" ?
          (<div>{boards.map((board) => <Link href={`/board/${board.id}`}  >
            <Card>
              <CardHeader>
                <div>
                <div className={``}/>
              </div>
              </CardHeader>
            </Card>

          </Link>)}</div>)
          : (<div></div>)}
        <div>
          <Link href="/table">table</Link>
        </div>
      </main>
    </div>
  );
};

export default page;