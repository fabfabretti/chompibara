import {
  createClient,
  PostgrestError,
  SupabaseClient,
} from "@supabase/supabase-js";
import MealData from "../type/MealData";
// Database access
const DBurl = import.meta.env.VITE_SUPABASE_URL;
const DBkey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(DBurl, DBkey);

export class SupabaseManager {
  private static instance: SupabaseManager;
  private supabase: SupabaseClient;

  private constructor() {
    this.supabase = supabase;
  }

  static getInstance(): SupabaseManager {
    if (!SupabaseManager.instance) {
      SupabaseManager.instance = new SupabaseManager();
    }
    return SupabaseManager.instance;
  }

  async getAllMeals(): Promise<MealData[]> {
    const { data, error } = await this.supabase.from("MealDataDB").select("*");
    if (error) this.throwError("getAllMeals", error);
    return data ?? [];
  }

  private throwError(operation: string, error: PostgrestError) {
    console.error(operation + error);
    alert("Errore nella funzione " + operation + ": " + error);
  }
}

export default supabase;
