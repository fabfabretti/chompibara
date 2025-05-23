import {
  createClient,
  PostgrestError,
  SupabaseClient,
} from "@supabase/supabase-js";

import { MealData } from "./types/MealTypes";

import { ProfileData, defaultProfile } from "./types/ProfileTypes";

import { ExerciseData } from "./types/ExerciseTypes";
// Database access
const DBurl = import.meta.env.VITE_SUPABASE_URL;
const DBkey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(DBurl, DBkey);

const mealDB = "MealDataDB";
const mealImgStorage = "meal-images";
const exerciseDB = "ExerciseDB";
const profileDB = "ProfileDB";

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
  async createMeal(meal: MealData, file?: File): Promise<MealData | null> {
    //#1: upload file
    let uploadMealFileResult = "";
    if (file) {
      uploadMealFileResult = await this.uploadMealFile(file);

      if (uploadMealFileResult === "") {
        this.throwError(
          "createMeal",
          undefined,
          "As file upload failed, will not proceed with meal creation."
        );
        return null;
      }
    }

    // #2: upload meal
    const { data, error } = await this.supabase
      .from(mealDB)
      .insert([
        {
          title: meal.title,
          photo: uploadMealFileResult,
          mealtype: meal.mealtype,
          date: meal.date,
          time: meal.time,
          calories: meal.calories,
          fats: meal.fats,
          carbos: meal.carbos,
          protein: meal.protein,
        },
      ])
      .select("*")
      .single();

    if (error) {
      this.throwError("createMeal", error);
      return null;
    }

    return data ?? null;
  }

  async getAllMeals(): Promise<MealData[]> {
    const { data, error } = await this.supabase
      .from(mealDB)
      .select("*")
      .order("time", { ascending: true });
    if (error) this.throwError("getAllMeals", error);
    return data ?? [];
  }

  async getAllDailyMeals(date: Date): Promise<MealData[]> {
    const formattedDate = date.toISOString().split("T")[0]; // Convert Date in "YYYY-MM-DD"

    const { data, error } = await this.supabase
      .from(mealDB)
      .select("*")
      .eq("date", formattedDate); // Filtra per data

    if (error) this.throwError("getAllDailyMeals", error);
    return data ?? [];
  }

  async getMealsInDateRange(
    dateStart: Date,
    dateEnd: Date
  ): Promise<MealData[]> {
    const formattedStartDate = dateStart.toISOString().split("T")[0]; // Convert Date in "YYYY-MM-DD"
    const formattedEndDate = dateEnd.toISOString().split("T")[0]; // Convert Date in "YYYY-MM-DD"

    const { data, error } = await this.supabase
      .from(mealDB)
      .select("*")
      .gte("date", formattedStartDate) // date >= formattedStartDate
      .lte("date", formattedEndDate); // date <= formattedEndDate

    if (error) this.throwError("getMealsInDateRange", error);
    return data ?? [];
  }

  async updateMeal(meal: MealData): Promise<boolean> {
    const { error, count } = await supabase
      .from(mealDB)
      .update(meal, { count: "exact" })
      .eq("id", meal.id);

    if (error) {
      this.throwError("updateMeal", error);
      return false;
    }
    if (count === 0) {
      this.throwError(
        "updateMeal",
        undefined,
        "The meal you're trying to update doesn't exist anymore."
      );
      return false;
    }

    return true;
  }

  async deleteMeal(id: number): Promise<boolean> {
    const { error, count } = await supabase
      .from(mealDB)
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) {
      this.throwError("deleteMeal", error);
      return false;
    }
    if (count === 0) {
      this.throwError(
        "deleteMeal",
        undefined,
        "The meal you're trying to delete doesn't exist anymore."
      );
      return false;
    }

    return true;
  }

  uploadMealFile = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `uploads/${timestamp}.${fileExtension}`;

    const { data, error } = await supabase.storage
      .from(mealImgStorage)
      .upload(fileName, file);

    if (error) {
      this.throwError("uploadMealFile", undefined, error.name + error.message);
      return "";
    }

    //URL retrieval
    const publicUrl = supabase.storage
      .from(mealImgStorage)
      .getPublicUrl(data.path).data.publicUrl;
    if (!publicUrl) {
      this.throwError(
        "uploadMealFile",
        undefined,
        "Error retrieving public URL"
      );
      return "";
    }
    return publicUrl;
  };

  // Profile functions

  async getProfile(): Promise<ProfileData> {
    const { data, error } = await supabase.from(profileDB).select("*");
    if (error) this.throwError("getProfile", error);
    return data?.[0] ?? defaultProfile;
  }

  async setProfile(profile: ProfileData): Promise<boolean> {
    if (!profile.id) {
      console.error("Missing ID!");
      return false;
    }
    const { error } = await supabase
      .from(profileDB) // Nome della tabella
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

  // Exercise functions
  async createExercise(exercise: ExerciseData) {
    // #2: upload meal
    const { data, error } = await this.supabase
      .from(exerciseDB)
      .insert([
        {
          name: exercise.name,
          date: exercise.date,
          time: exercise.time,
          calories: exercise.calories,
          duration: exercise.duration,
          type: exercise.type,
        },
      ])
      .select("id") // Recupera l'ID del pasto creato
      .single();

    if (error) {
      this.throwError("createExercise", error);
      return null;
    }

    return data?.id ?? null;
  }

  async updateExercise(exercise: ExerciseData): Promise<boolean> {
    const { error, count } = await supabase
      .from(exerciseDB)
      .update(exercise, { count: "exact" })
      .eq("id", exercise.id);

    if (error) {
      this.throwError("updateExercise", error);
      return false;
    }
    if (count === 0) {
      this.throwError(
        "updateExercise",
        undefined,
        "The exercise you're trying to update doesn't exist anymore."
      );
      return false;
    }

    return true;
  }

  async deleteExercise(id: number): Promise<boolean> {
    const { error, count } = await supabase
      .from(exerciseDB)
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) {
      this.throwError("deleteExercise", error);
      return false;
    }
    if (count === 0) {
      this.throwError(
        "deleteExercise",
        undefined,
        "The exercise you're trying to delete doesn't exist anymore."
      );
      return false;
    }

    return true;
  }

  async getAllDailyExercises(date: Date): Promise<ExerciseData[]> {
    const formattedDate = date.toISOString().split("T")[0];

    const { data, error } = await this.supabase
      .from(exerciseDB)
      .select("*")
      .eq("date", formattedDate); // Filtra per data

    if (error) this.throwError("getAllDailyExercises", error);
    return data ?? [];
  }

  async getExercisesInDateRange(
    dateStart: Date,
    dateEnd: Date
  ): Promise<ExerciseData[]> {
    const formattedStartDate = dateStart.toISOString().split("T")[0]; // Convert Date in "YYYY-MM-DD"
    const formattedEndDate = dateEnd.toISOString().split("T")[0]; // Convert Date in "YYYY-MM-DD"

    const { data, error } = await this.supabase
      .from(exerciseDB)
      .select("*")
      .gte("date", formattedStartDate) // date >= formattedStartDate
      .lte("date", formattedEndDate); // date <= formattedEndDate

    if (error) this.throwError("getExercisesInDateRange", error);
    return data ?? [];
  }
  //Error handling
  private throwError(
    operation: string,
    error?: PostgrestError,
    details?: string
  ) {
    console.error(
      "Errore nella funzione " +
        operation +
        ": " +
        (error ? error.message : "") +
        (details ? details : "")
    );
    alert(
      "Errore nella funzione " +
        operation +
        ": " +
        (error ? error.message : "") +
        (details ? details : "")
    );
  }
}

export default supabase;
