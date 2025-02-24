import mockData from "../../mockdata/mockmeals";
import MealCard from "../../components/mealcard/MealCard";
import "./History.css";
import supabase from "../../components/supabaseManager";
import MealData from "../../type/MealData";
import { useEffect, useState } from "react";
import { SupabaseManager } from "../../components/supabaseManager";
import Loadingspinner from "../../components/Loadingspinner/Loadingspinner";

function History() {
  //States
  const [meals, setMeals] = useState<MealData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //DB manager
  const supabaseManager: SupabaseManager = SupabaseManager.getInstance();

  // Effects (load meals)
  useEffect(() => {
    supabaseManager.getAllMeals().then((meals) => setMeals(meals));

    new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
      setIsLoading(false)
    );
  }, meals);

  // Render
  return (
    <div>
      {
        /* Meals */

        isLoading ? (
          <div style={{ height: "100vh" }} className="flex-col flex-center">
            <Loadingspinner />
          </div>
        ) : (
          <div className="mealhistory">
            {meals.map((meal) => (
              <MealCard meal={meal} />
            ))}
          </div>
        )
      }
    </div>
  );
}

export default History;
