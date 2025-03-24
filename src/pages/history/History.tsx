import "./History.css";

import { useEffect, useState } from "react";

import { SupabaseManager } from "../../context/SupabaseManager";

import { MealData } from "../../context/types/MealTypes";

import MealCard from "../../components/MealCard/MealCard";
import DailyDashboard from "../../components/DailyStat/DailyStat";
import Loadingspinner from "../../components/Loadingspinner/Loadingspinner";
import { ExerciseData } from "../../context/types/ExerciseTypes";
import ExerciseCard from "../../components/ExerciseCard/ExerciseCard";

function History() {
  //States
  const [meals, setMeals] = useState<MealData[]>([]);
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [areMealsLoading, setAreMealsLoading] = useState(true);
  const [areExercisesLoading, setAreExercisesLoading] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());

  //a meal has been changed
  const [mealsUpdated, setMealsUpdated] = useState(false);

  //DB manager
  const supabaseManager: SupabaseManager = SupabaseManager.getInstance();

  // Effects

  // Load meals effect
  useEffect(() => {
    setAreMealsLoading(true);
    supabaseManager.getAllDailyMeals(viewDate).then((meals) => {
      setMeals(meals.sort(sortByTime));
      setAreMealsLoading(false);
    });
  }, [viewDate, mealsUpdated]);

  // Load exercises effect
  useEffect(() => {
    setAreExercisesLoading(true);
    supabaseManager.getAllDailyExercises(viewDate).then((exercises) => {
      setExercises(exercises.sort(sortByTime));
      setAreExercisesLoading(false);
    });
  }, [viewDate]);

  // Manual sorting of dates for both exercises and meals
  const sortByTime = <T extends { time: string }>(a: T, b: T) => {
    const parseTime = (timeString: string): number => {
      if (!timeString) return 0;
      const [hours, minutes, seconds] = timeString.split(":").map(Number);
      return hours * 3600000 + minutes * 60000 + seconds * 1000;
    };

    return parseTime(a.time) - parseTime(b.time);
  };

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

  // Render
  return (
    <div className="flex-row" style={{ height: "100dvh", marginTop: 60 }}>
      {/**Dashboard on left pane */}
      <DailyDashboard meals={meals} exercises={exercises} />

      {/**Right pane */}
      <div
        className="history-container flex-col flex-start"
        style={{
          padding: "10px",
          alignItems: "center",
          minWidth: "500px",
          width: "100%",
          overflowY: "scroll",
        }}
      >
        {/** History header */}
        <div className="flex-col flex-center">
          <div className="year">{viewDate.getFullYear()}</div>
          <div
            className="flex-row flex-center gap20"
            style={{ minWidth: "500px", justifyContent: "space-around" }}
          >
            {/** Back one day button */}
            <button onClick={goToYesterday}>
              <h1>&lt;</h1>
            </button>

            {/**Current day */}
            <h1 className="date-header flex-col">
              <div className="main-date">
                {viewDate.toLocaleDateString("en-US", { weekday: "long" })},{" "}
                {viewDate.getDate()}{" "}
                {viewDate.toLocaleDateString("en-US", { month: "long" })}
              </div>
            </h1>

            {/**Forwards one day button */}
            <button onClick={goToTomorrow}>
              <h1>&gt;</h1>
            </button>
          </div>
        </div>

        {/** Meals */}
        {areMealsLoading ? (
          <div style={{ height: "90vh" }} className="flex-col flex-center">
            <Loadingspinner />
          </div>
        ) : (
          <div className="mealhistory">
            {meals.length == 0
              ? "No meals recorded on this day"
              : meals.map((meal) => (
                  <MealCard
                    meal={meal}
                    setUpdated={setMealsUpdated}
                    key={"meal" + meal.time + meal.id}
                  />
                ))}
          </div>
        )}

        {/**Exercises */}
        {areExercisesLoading ? (
          <div style={{ height: "90vh" }} className="flex-col flex-center">
            <Loadingspinner />
          </div>
        ) : (
          <div className="exercises-container flex-col gap20">
            <h2>Daily activities</h2>
            <div
              className="flex-row gap20 flex-center"
              style={{ flexFlow: "wrap" }}
            >
              {exercises.length == 0
                ? "No exercises recorded on this day"
                : exercises.map((exercise) => (
                    <ExerciseCard
                      exercise={exercise}
                      key={"exercise" + exercise.time + exercise.id}
                    />
                  ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
