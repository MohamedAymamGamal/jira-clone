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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TableProperties } from "lucide-react";
import { Timer } from "lucide-react";
import { ChartNoAxesColumn } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
              <p className="text-gray-600">manage your projects and tesks</p>
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
        {boards.length == 0 ? (
          <div>no boards</div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {boards.map((board) => (
              
              <Link href={`/boards/${board.id}`} key={board.id}>
                <Card className="cursor-pointer hover:shadow-lg transistion-shadow group">
                  <CardHeader className="pb-3  ">
                    <div className="flex items-center justify-between">
                      <div className={`w-4 h-4 ${board.color} rounded`} />
                      <Badge className="text-xs" variant={"secondary"}>
                        {" "}
                        new
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg mb-2 gropup-hover:text-blue-600 transition-colors">
                      {board.title}
                    </CardTitle>
                    <CardDescription className="text-sm mb-4">
                      {board.description}
                    </CardDescription>
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center text-xs text-gray-500 space-y-1 sm:space-y-0 ">
                      <span>
                        Created {""}
                        {new Date(board.created_at).toDateString()}
                      </span>
                    </div>
                    <div>
                      <span>
                        Updated {""}
                        {new Date(board.updated_at).toDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            <Card className="cursor-pointer border-dashed border-2 border-gray-300 hover:shadow-lg transistion-shadow group">
              <CardContent className="p-4 sm:p-6 flex-col items-center justify-center h-full min-h-[200px]">
                <Plus className="h-10 w-10 rounded-lg bg-gray-200 group-hover:text-blue-600 flex mb-2 items-center bg-blue justify-center " />
                <p className="text-sm sm:text-base text-gray group-hover:text-blue-600 flex items-center justify-center transition-colors ">
                  create new board
                </p> 
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            {boards.map((board, key) => (
              // eslint-disable-next-line react/jsx-key
              <div key={key} className={key > 0 ? "mt-4" : ""}>
                <Link href={`/boards/${board.id}`}>
                  <Card className="cursor-pointer hover:shadow-lg transistion-shadow group">
                    <CardHeader className="pb-3  ">
                      <div className="flex items-center justify-between">
                        <div className={`w-4 h-4 ${board.color} rounded`} />
                        <Badge className="text-xs" variant={"secondary"}>
                          {" "}
                          new
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <CardTitle className="text-base sm:text-lg mb-2 gropup-hover:text-blue-600 transition-colors">
                        {board.title}
                      </CardTitle>
                      <CardDescription className="text-sm mb-4">
                        {board.description}
                      </CardDescription>
                      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center text-xs text-gray-500 space-y-1 sm:space-y-0 ">
                        <span>
                          Created {""}
                          {new Date(board.created_at).toDateString()}
                        </span>
                      </div>
                      <div>
                        <span>
                          Updated {""}
                          {new Date(board.updated_at).toDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
            <Card className=" mt-4 cursor-pointer border-dashed border-2 border-gray-300 hover:shadow-lg transistion-shadow group">
              <CardContent className="p-4 sm:p-6 flex-col items-center justify-center h-full min-h-[200px]">
                <Plus className="h-10 w-10 rounded-lg bg-gray-200 group-hover:text-blue-600 flex mb-2 items-center bg-blue justify-center " />
                <p className="text-sm sm:text-base text-gray group-hover:text-blue-600 flex items-center justify-center transition-colors ">
                  create new board
                </p>
              </CardContent>
            </Card>
          </div>
        )}
        <div>
          <Link href="/table">table</Link>
        </div>
      </main>
    </div>
  );
};

export default page;