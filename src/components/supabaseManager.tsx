import {
  createClient,
  PostgrestError,
  SupabaseClient,
} from "@supabase/supabase-js";
import MealData from "../type/MealData";
import { defaultProfile, ProfileDBType } from "../pages/profile/Profile";
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

  // Meal functions

  async getAllMeals(): Promise<MealData[]> {
    const { data, error } = await this.supabase.from("MealDataDB").select("*");
    if (error) this.throwError("getAllMeals", error);
    return data ?? [];
  }

  // Profile functions

  async getProfile(): Promise<ProfileDBType> {
    const { data, error } = await supabase.from("ProfileDB").select("*");
    if (error) this.throwError("getProfile", error);
    return data?.[0] ?? defaultProfile;
  }

  async setProfile(profile: ProfileDBType): Promise<boolean> {
    if (!profile.id) {
      console.error("Missing ID!");
      return false;
    }
    const { error } = await supabase
      .from("ProfileDB") // Nome della tabella
      .update({
        height: profile.height,
        age: profile.age,
        name: profile.name,
        surname: profile.surname,
        targetcarbo: profile.targetcarbo,
        targetfat: profile.targetfat,
        targetprotein: profile.targetprotein,
        weight: profile.weight,
        targetcalories: profile.targetcalories,
      })
      .eq("id", profile.id); // Condizione per aggiornare il record corretto
    if (error) {
      this.throwError("setProfile", error);
      return false;
    }
    return true;
  }

  //Error handling

  private throwError(operation: string, error: PostgrestError) {
    console.error(operation + error);
    alert("Errore nella funzione " + operation + ": " + error);
  }
}

export default supabase;
