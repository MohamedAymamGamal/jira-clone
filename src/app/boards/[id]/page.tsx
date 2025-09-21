"use client";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBoard, useBoards } from "@/lib/hooks/useBoards";
import { ColumnWithTasks } from "@/lib/supabase/models";
import { MoreHorizontal, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

function Column({
  column,
  children,
  onCreateTask,
  onEditColumn,
}: {
  column: ColumnWithTasks;
  children: React.ReactNode;
  onCreateTask: (taskData: any) => Promise<void>;
  onEditColumn: (column: ColumnWithTasks) => void;
}) {
  return (
    <div className="w-full lg:flex-shrink-0 lg:w-80">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* colunms header */}
        <div className="p-3 sm:p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <h3 className="font-semibold text-gray-900 sm:text-base truncate">
                {column.title}
              </h3>
              <Badge className="text-xs flex-shrik-0" variant="secondary">
                {column.tasks.length}
              </Badge>
            </div>
            <Button
              className="flex-shrink-0"
              variant={"ghost"}
              onClick={() => onEditColumn(column)}
            >
              <MoreHorizontal />
            </Button>
          </div>
        </div>
        {/* coloumns content */}
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
}

export default function page() {
  const { id } = useParams<{ id: string }>();
  const { board, updateBoard, columns, createRealTask } = useBoard(id);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setnewTitle] = useState("");
  const [newColor, setNewColor] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  async function handleUpdateBoard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newTitle.trim() || !board) return;
    try {
      await updateBoard(board.id, {
        title: newTitle.trim(),
        color: newColor || board.color,
      });
    } catch (error) {
      setIsEditingTitle(false);
    }

    setIsEditingTitle(false);
  }
  async function createTask(taskData: {
    title: string;
    description: string;
    assignee: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
  }) {
    const targetColumn = columns[0];
    if (!targetColumn) {
      throw new Error("Column not found");
    }
    await createRealTask(targetColumn.id, taskData);
  }
  async function handleCreateTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      assignee: (formData.get("assignee") as string) || undefined,
      dueDate: (formData.get("dueDate") as string) || undefined,
      priority:
        (formData.get("priority") as "low" | "medium" | "high") || "medium",
    };
    if (taskData.title.trim()) {
      await createTask(taskData);
      const trigger = document.querySelector(
        '[data-state="open"]'
      ) as HTMLElement;
      if (trigger) {
        trigger.click();
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        boardTitle={board?.title}
        onEditBoard={() => {
          setIsEditingTitle(true);
          setNewColor(board?.color ?? "");
          setnewTitle(board?.title ?? "");
        }}
        onFilterClick={() => {
          setIsFilterOpen(true);
        }}
        filterCount={0}
      />
      <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto ">
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdateBoard}>
            <div className="space-y-2">
              <Label htmlFor="boardTitle"> board Title</Label>
              <Input
                onChange={(e) => setnewTitle(e.target.value)}
                id="boardTitle"
                placeholder="Board Title"
                value={newTitle}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Board color</Label>

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {[
                  "bg-blue-500",
                  "bg-green-500",
                  "bg-yellow-500",
                  "bg-red-500",
                  "bg-purple-500",
                  "bg-pink-500",
                  "bg-indigo-500",
                  "bg-gray-500",
                  "bg-orange-500",
                  "bg-teal-500",
                  "bg-cyan-500",
                  "bg-emerald-500",
                ].map((color, key) => (
                  <button
                    key={key}
                    className={`w-8 h-8 rounded-full ${color}  ${
                      color === newColor
                        ? "ring-2 ring-offset-2  ring-gray-900"
                        : ""
                    }`}
                    type="button"
                    onClick={() => setNewColor(color)}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsEditingTitle(false)}
              >
                cancel
              </Button>
              <Button type="submit">save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Filter</DialogTitle>
            <p className="text-muted-foreground">filter tasks by status </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex flex-wrap gap-2">
                {["low", "medium", "high"].map((priority, key) => (
                  <Button key={key} variant={"outline"} size={"sm"}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            {/* <div className="space-y-2">
                                    <Label>assignee</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            'low', 'medium', 'high',
                                        ].map((priority, key) => (
                                            <Button key={key} variant={'outline'} size={'sm'}>
                                                {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                            </Button>
                                        ))
                                        }
                                    </div>
                                </div> */}

            <div className="space-y-2">
              <Label>due Date</Label>
              <Input type="date" />
            </div>
            <div className="flex justify-between ">
              <Button type="button" variant={"outline"}>
                clear
              </Button>
              <Button type="button" onClick={() => setIsFilterOpen(false)}>
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <main className="container mx-auto px-2 py-4 sm:py-6">
        {/* stats */}
        <div className="flex flex-col sm:flex-row justify-between  sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="text-sm text-gray-600">
              <span className="font-medium">total tasks</span>
              {columns.reduce((sum, col) => sum + col.tasks.length, 0)}
            </div>
          </div>
          {/* add task dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto" variant="default">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
              <DialogHeader>
                <DialogTitle>create task</DialogTitle>
                <p className="text-muted-foreground">
                  add a new task to the board{" "}
                </p>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleCreateTask}>
                <div className="space-y-4">
                  <Label>task title</Label>
                  <Input id="title" type="text" placeholder="task title" />
                </div>
                <div className="space-y-4">
                  <Label>description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="description"
                    rows={3}
                  />
                </div>
                <div className="space-y-4">
                  <Label>Assignee</Label>
                  <Input
                    id="assignee
                                    "
                    placeholder="who is this task assigned to"
                  />
                </div>
                <div className="space-y-2">
                  <Label>priortity</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="priority" />
                    </SelectTrigger>
                    <div className="flex flex-wrap gap-2">
                      <SelectContent>
                        {["low", "medium", "high"].map((priority, key) => (
                          <SelectItem key={key} value={"priority"}>
                            {priority.charAt(0).toUpperCase() +
                              priority.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </div>
                  </Select>
                </div>
                <div className="space-y-4">
                  <Label>due date</Label>
                  <Input type="date" id="dueDate" name="dueDate" />
                </div>
                <div className="space-y-1 flex justify-between pt-4">
                  <Button type="submit">create task</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* board columns */}
        <div
          className="flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto 
            lg:pb-6 lg:px-2 lg:-mx-2 lg:[&::-webkit-scrollbar]:h-2 
            lg:[&::-webkit-scrollbar-track]:bg-gray-100 
            lg:[&::-webkit-scrollbar-thumb]:bg-gray-300 lg:[&::-webkit-scrollbar-thumb]:rounded-full 
            space-y-4 lg:space-y-0"
        >
          {columns.map((column, key) => (
            <Column
              key={key}
              onCreateTask={createTask}
              column={column}
              onEditColumn={() => {}}
            >
              <div className="space-y-3 ">
                {column.tasks.map((task, key) => (
                  <div>{task.title}</div>
                ))}
              </div>
            </Column>
          ))}
        </div>
      </main>
    </div>
  );
}