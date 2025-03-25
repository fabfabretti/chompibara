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
  const [exerciseUpdated, setExerciseUpdated] = useState(false);

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
  }, [viewDate, exerciseUpdated]);

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
    <div className="history-container">
      {/**Dashboard on left pane */}
      <div className="left-pane">
        <DailyDashboard meals={meals} exercises={exercises} />
      </div>

      {/**Right pane */}
      <div className="right-pane">
        {/** History header */}
        <div className="flex-col flex-center">
          <div className="year">{viewDate.getFullYear()}</div>
          <div
            className="flex-row flex-center gap20"
            style={{ justifyContent: "space-around" }}
          >
            {/** Back one day button */}
            <button className="primary" onClick={goToYesterday}>
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
            <button className="primary" onClick={goToTomorrow}>
              <h1>&gt;</h1>
            </button>
          </div>
        </div>

        <div
          className="dailyrecords-container flex-col gap20"
          style={{ padding: "20px" }}
        >
          {/** Meals */}
          {areMealsLoading ? (
            <div className="flex-col flex-center">
              <Loadingspinner />
            </div>
          ) : (
            <div className="flex-col gap20">
              <h2>Meal records</h2>
              {meals.length == 0 ? (
                <p style={{ color: "var(--greyed-out)", textAlign: "center" }}>
                  No meals recorded on this day
                </p>
              ) : (
                meals.map((meal) => (
                  <MealCard
                    meal={meal}
                    setUpdated={setMealsUpdated}
                    key={"meal" + meal.time + meal.id}
                  />
                ))
              )}
            </div>
          )}

          {/**Exercises */}
          {areExercisesLoading ? (
            <div className="flex-col flex-center">
              <Loadingspinner />
            </div>
          ) : (
            <div className="exercises-container flex-col gap20">
              <h2>Daily activities</h2>
              <div
                className="flex-row gap20 flex-center"
                style={{ flexFlow: "wrap" }}
              >
                {exercises.length == 0 ? (
                  <p style={{ color: "var(--greyed-out)" }}>
                    No exercises recorded on this day
                  </p>
                ) : (
                  exercises.map((exercise) => (
                    <ExerciseCard
                      exercise={exercise}
                      setUpdated={setExerciseUpdated}
                      key={"exercise" + exercise.time + exercise.id}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
