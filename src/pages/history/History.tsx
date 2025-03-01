import "./History.css";

import { useEffect, useMemo, useState } from "react";

import MealCard from "../../components/mealcard/MealCard";
import Loadingspinner from "../../components/Loadingspinner/Loadingspinner";
import MacroDonutChart2 from "../../components/MacroDonutChart/MacroDonutChart2";
import MacroProgressRing from "../../components/MacroProgressRing/MacroProgressRing";

import MealData from "../../type/MealData";
import { defaultProfile } from "../profile/Profile";

import { SupabaseManager } from "../../components/supabaseManager";

function History() {
  //States
  const [meals, setMeals] = useState<MealData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(defaultProfile);
  const [viewDate, setViewDate] = useState(new Date());

  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFats, setTotalFats] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  //DB manager
  const supabaseManager: SupabaseManager = SupabaseManager.getInstance();

  // Effects - load meals
  useEffect(() => {
    setIsLoading(true);
    supabaseManager.getAllDailyMeals(viewDate).then((meals) => setMeals(meals));
    setIsLoading(false);
  }, [viewDate]);

  //Load profile
  useEffect(() => {
    supabaseManager.getProfile().then((profile) => setProfile(profile));
  }, []);

  // Compute total macros
  useEffect(() => {
    const carbs = meals.reduce((sum, meal) => sum + (meal.carbos || 0), 0);
    const fats = meals.reduce((sum, meal) => sum + (meal.fats || 0), 0);
    const protein = meals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
    const calories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);

    setTotalCarbs(carbs);
    setTotalFats(fats);
    setTotalProtein(protein);
    setTotalCalories(calories);
  }, [meals]);

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
    <div className="dashboard-container  flex-col flex-center">
      <div className="stat-container flex-col ">
        <h1>Daily info</h1>
        <div className="flex-column">
          Today's stats
          <MacroDonutChart2 meals={meals} height={200} />
          <div className="macros flex-row flex-center">
            <MacroProgressRing
              label="Protein"
              target={profile.targetprotein}
              value={totalProtein}
            />{" "}
            <MacroProgressRing
              label="Fats"
              target={profile.targetfat}
              value={totalFats}
            />{" "}
            <MacroProgressRing
              label="Carbs"
              target={profile.targetcarbo}
              value={totalCarbs}
            />
          </div>
        </div>
      </div>
      <div className="history-container page flex-col flex-center">
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
