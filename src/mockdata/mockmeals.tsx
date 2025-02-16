import MealData from "../type/MealData.tsx";

const mockData: MealData = {
  id: 1,
  photo: "",
  title: "Piatto di pasta alla carbonara",
  datetime: "11-11-11",
  tags: [],
  comment: "Keep up!",
  mark: 10,
  mealtype: "Cena",
  ingredients: [
    {
      id: 1,
      name: "Spaghetti",
      quantity: "80g",
      protein: "3g",
      carb: "40g",
      fat: "0g",
    },
    {
      id: 2,
      name: "Egg",
      quantity: "20g",
      protein: "10g",
      carb: "0g",
      fat: "5g",
    },
  ],
};

export default mockData;
