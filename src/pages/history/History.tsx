import "./History.css";

import MealCard from "../../components/mealcard/MealCard";
import Loadingspinner from "../../components/Loadingspinner/Loadingspinner";

import MealData from "../../type/MealData";

import { useEffect, useState } from "react";
import { SupabaseManager } from "../../components/supabaseManager";

function History() {
  //States
  const [meals, setMeals] = useState<MealData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //DB manager
  const supabaseManager: SupabaseManager = SupabaseManager.getInstance();

  // Effects (load meals)
  useEffect(() => {
    supabaseManager.getAllMeals().then((meals) => setMeals(meals));
    setIsLoading(false);
  }, []);

  // Render
  return (
    <div>
      {
        /* Meals */
        isLoading ? (
          <div style={{ height: "90vh" }} className="flex-col flex-center">
            <Loadingspinner />
          </div>
        ) : (
          <div className="mealhistory">
            {meals.map((meal) => (
              <MealCard meal={meal} key={"meal" + meal.id} />
            ))}
          </div>
        )
      }
    </div>
  );
}

export default History;
