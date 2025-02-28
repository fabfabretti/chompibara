import "./History.css";

import MealCard from "../../components/mealcard/MealCard";
import Loadingspinner from "../../components/Loadingspinner/Loadingspinner";

import MealData from "../../type/MealData";
import { MacroData } from "../../components/MacroDonutChart/MacroDonutChart";
import { useEffect, useMemo, useState } from "react";
import { SupabaseManager } from "../../components/supabaseManager";
import MacroDonutChart from "../../components/MacroDonutChart/MacroDonutChart";

function History() {
  //States
  const [meals, setMeals] = useState<MealData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [viewDate, setViewDate] = useState(new Date());

  //DB manager
  const supabaseManager: SupabaseManager = SupabaseManager.getInstance();

  // Compute daily stats
  const [dailyStat, setDailyStat] = useState<MacroData | null>(null);

  // Effects (load meals)
  useEffect(() => {
    setIsLoading(true);
    supabaseManager.getAllDailyMeals(viewDate).then((meals) => setMeals(meals));
    setIsLoading(false);
  }, [viewDate]);

  // Date changes
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
    <div className="dashboard-container page flex-row flex-between flex-start">
      <div className="stat-container flex-col ">
        <h1>Daily info</h1>
        <div>
          Today's stats
          {meals ? <MacroDonutChart meals={meals} /> : "aaaaaaaaaaaa"}
        </div>
      </div>
      <div className="history-container flex-col flex-center">
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
    </div>
  );
}

export default History;
