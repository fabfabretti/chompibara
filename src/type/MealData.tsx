type MealData = {
  id: number;
  photo?: string;
  title: string;
  datetime: string;
  tags: Array<string>;
  comment: string;
  mark: number;
  mealtype?: string;
  ingredients: Array<{
    id: number;
    name: string;
    quantity?: string;
    protein?: string;
    carb?: string;
    fat?: string;
  }>;
};

export default MealData;
