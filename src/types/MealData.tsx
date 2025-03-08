type MealData = {
  id: number;
  photo?: string;
  title: string;
  date: string;
  time: string;
  mealtype: string;
  calories: number | null;
  carbos: number | null;
  fats: number | null;
  protein: number | null;
};

export default MealData;
