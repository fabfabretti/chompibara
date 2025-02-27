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

  const [viewDate, setViewDate] = useState(new Date());

  //DB manager
  const supabaseManager: SupabaseManager = SupabaseManager.getInstance();

  // Effects (load meals)
  useEffect(() => {
    setIsLoading(true);
    supabaseManager.getAllDailyMeals(viewDate).then((meals) => setMeals(meals));
    setIsLoading(false);
  }, [viewDate]);

  const goToYesterday = () => {
    setViewDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };
  const goToTomorrow = () => {
    setViewDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  // lunedì 11.15

  // Render
  return (
    <div className="flex-col flex-center">
      <div className="flex-col flex-center">
        <div className="year">{viewDate.getFullYear()}</div>
        <div className="flex-row flex-center gap20">
          <button onClick={goToYesterday}>
            <h1>&lt;</h1>
          </button>
          <h1 className="date-header flex-col">
            <div className="main-date">
              {viewDate.toLocaleDateString("en-US", { weekday: "long" })},{" "}
              {viewDate.getDate()}{" "}
              {viewDate.toLocaleDateString("en-US", { month: "long" })}
            </div>
          </h1>
          <button onClick={goToTomorrow}>
            <h1>&gt;</h1>
          </button>
        </div>
      </div>
      {
        /* Meals */
        isLoading ? (
          <div style={{ height: "90vh" }} className="flex-col flex-center">
            <Loadingspinner />
          </div>
        ) : (
          <div className="mealhistory">
            {meals.length == 0
              ? "No data recorded on this day"
              : meals.map((meal) => (
                  <MealCard meal={meal} key={"meal" + meal.id} />
                ))}
          </div>
        )
      }
    </div>
  );
}

export default History;
