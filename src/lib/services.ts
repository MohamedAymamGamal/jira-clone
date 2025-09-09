import { createSupabaseClient } from "@/lib/supabase/client ";
import { get } from "http";

const supabase = createSupabaseClient();

export const boardService = {
  async getBoards(userId: string) {
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


   async createBoard(userId: string) {
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
};
