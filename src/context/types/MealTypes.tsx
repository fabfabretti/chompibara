const today = new Date().toISOString().split("T")[0];
const now = new Date().toTimeString().slice(0, 5);

export const defaultMeal: MealData = {
  id: 1,
  photo: undefined,
  title: "",
  mealtype: "Other",
  date: today,
  time: now,
};
export type MealData = {
  id: number;
  photo?: string;
  title: string;
  date: string;
  time: string;
  mealtype: string;
  calories?: number;
  carbos?: number;
  fats?: number;
  protein?: number;
};
