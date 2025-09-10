import { Board, Column } from './supabase/models';
import { createSupabaseClient } from "@/lib/supabase/client ";

const supabase = createSupabaseClient();

export const boardService = {
  async getBoards(userId: string): Promise<Board[]> {
    const {data,error} = await supabase
      .from("boards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
      
      if(error){
        throw new Error(error.message);
      }
      return data || [];
  },


   async createBoard(Board:  Omit<Board, "id" | "created_at" | "updated_at">): Promise<Board> {
    const {data,error} = await supabase
      .from("boards")
      .insert(Board)
      .select("*")
      .single();
      
      if(error){
        throw new Error(error.message);
      }
      return data ;
  },



  
};
export const columnsService = {
  // async getBoards(userId: string): Promise<Board[]> {
  //   const {data,error} = await supabase
  //     .from("boards")
  //     .select("*")
  //     .eq("user_id", userId)
  //     .order("created_at", { ascending: false });
      
  //     if(error){
  //       throw new Error(error.message);
  //     }
  //     return data || [];
  // },



   async createColumns(column:  Omit<Column, "id" | "created_at" >): Promise<Column> {
    const {data,error} = await supabase
      .from("columns")
      .insert(column)
      .select("*")
      .single();
      
      if(error){
        throw new Error(error.message);
      }
      return data ;
  },



  
};

export const boardDataService = {
  
   async createBoardwithDefaultColumns(BoardData: {
      tile:string,
      description?:string,
      color?:string,
      user_id:string

  }) {
    const board = await boardService.createBoard({
      title: BoardData.tile,
      description: BoardData.description || null,
      color: BoardData.color || "bg-blue-500",
      user_id: BoardData.user_id
    });
    const defaultColumns = [
      {title: "To Do",sort_order: 0},
      {title: "in Progress",sort_order: 1},
      {title: "review",sort_order: 2},
      {title: "done",sort_order: 3},
    ];
    await Promise.all(
      defaultColumns.map(async (column) => {columnsService.createColumns({
        ...column, board_id: board.id,
        user_id: ''
      })})
    );
     return board;
  },
 



  
};


