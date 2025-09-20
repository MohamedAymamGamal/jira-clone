"use client";
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useBoard, useBoards } from "@/lib/hooks/useBoards";
import { Label } from "@radix-ui/react-label";
import { useParams } from "next/navigation";
import { useState } from "react";


export default function page() {
    const { id } = useParams<{ id: string }>();
    const { board, updateBoard } = useBoard(id);

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitle, setnewTitle] = useState("");
    const [newColor, setNewColor] = useState("");

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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar boardTitle={board?.title}
                onEditBoard={() => {
                    setIsEditingTitle(true);
                    setNewColor(board?.color ?? "");
                    setnewTitle(board?.title ?? "");
                }}
                onFilterClick={() => { }}
                filterCount={0}
            />
            <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle} >

                <DialogContent className="w-[95vw] max-w-[425px] mx-auto ">
                    <DialogHeader>
                        <DialogTitle>Edit Board</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleUpdateBoard} >
                        <div className="space-y-2">
                            <Label htmlFor="boardTitle"> board Title</Label>
                            <Input
                                onChange={(e) => setnewTitle(e.target.value)}
                                id="boardTitle"
                                placeholder="Board Title"
                                value={newTitle}
                                required />
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
                                        className={`w-8 h-8 rounded-full ${color}  ${color === newColor
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
                            <Button variant="outline" type="button" onClick={() => setIsEditingTitle(false)}>cancel</Button>
                            <Button type="submit">save Changes</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function updateBoard(supabase: any, id: string, arg2: { title: string; color: string; }) {
    throw new Error("Function not implemented.");
}
