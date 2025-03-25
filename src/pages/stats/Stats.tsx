import { useEffect, useState } from "react";

import { SupabaseManager } from "../../context/SupabaseManager";

import { ProfileData, defaultProfile } from "../../context/types/ProfileTypes";
import { MealData } from "../../context/types/MealTypes";
import { ExerciseData } from "../../context/types/ExerciseTypes";

import MacroDonutChart from "../../components/graphs/MacroDonutChart/MacroDonutChart";
import MacroStackedChart from "../../components/graphs/MacroStackedChart/MacroStackedChart";
import Loadingspinner from "../../components/Loadingspinner/Loadingspinner";
import BurntCaloriesBarChart from "../../components/graphs/BurntCaloriesBarChart.tsx/BurntCaloriesBarChart";

const today = new Date().toISOString().split("T")[0];
const aWeekAgo = new Date(); // Create a new Date object
aWeekAgo.setDate(aWeekAgo.getDate() - 7); // Subtract 7 days

const weekAgo = aWeekAgo.toISOString().split("T")[0];

function Stats() {
  //State
  const [startDay, setStartDay] = useState(weekAgo);
  const [endDay, setEndDay] = useState(today);
  const [meals, setMeals] = useState<MealData[]>([]);
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  const [errorString, setErrorString] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const supabaseManager = SupabaseManager.getInstance();

  // these are the dates sent to the stackcoso component
  const [actualStartDate, setactualStartDate] = useState(weekAgo);
  const [actualEndDate, setactualEndDate] = useState(today);

  //Functions
  const setMealsFromRange = () => {
    // Loads meals and exercises from DB in selected range
    if (new Date(startDay) > new Date(endDay)) {
      setErrorString("Start date cannot be after end date.");
      return;
    }

    setErrorString(""); // Reset errore se le date sono valide
    setIsLoading(true);

    supabaseManager // Load meals
      .getMealsInDateRange(new Date(startDay), new Date(endDay))
      .then((result) => {
        setMeals(result);

        supabaseManager // Load exercises
          .getExercisesInDateRange(new Date(startDay), new Date(endDay))
          .then((result) => {
            setExercises(result);
          });
      });

    setactualEndDate(startDay);
    setactualEndDate(endDay);

    setIsLoading(false);
  };

  //Effects
  useEffect(() => {
    setIsLoading(true);
    //Get profile for target info
    supabaseManager.getProfile().then((profile) => {
      setProfile(profile);
    });

    //Compute graphs
    setMealsFromRange();
  }, []);

  //Render
  return (
    <div className="page ">
      <div></div>
      <h1>Stats</h1>
      <p
        style={{
          marginTop: "-10px",
          marginBottom: "-10px",
          textAlign: "center",
        }}
      >
        Select a start and end date to get an overview of your data!
      </p>

      {/**Content */}
      <div className="flex-col flex-center " style={{ marginTop: "20px" }}>
        {/**Module to select date */}
        <div className="dateselector-container flex-row flex-between flex-center gap20">
          <div className="dateinputs-container flex-row gap20 ">
            {/**Start date */}
            <label>
              Start date:
              <input
                type="date"
                value={startDay}
                onChange={(e) => setStartDay(e.target.value)}
              ></input>
            </label>
            {/**End date */}
            <label>
              End date:
              <input
                type="date"
                value={endDay}
                onChange={(e) => setEndDay(e.target.value)}
              ></input>
            </label>
          </div>

          <button className="primary" onClick={() => setMealsFromRange()}>
            Calculate
          </button>
          {/** Error message */}
          <div style={{ color: "var(--primary-color)" }}>{errorString}</div>
        </div>

        {isLoading ? (
          <Loadingspinner />
        ) : (
          <div
            className="charts-container flex-row flex-wrap  flex-center gap20"
            style={{
              marginTop: "30px",
              width: "90%",
              alignItems: "center",
              flex: "0 1 auto",
            }}
          >
            <div
              className="card-custom flex-col flex-center"
              style={{ minWidth: "200px", maxWidth: "500px" }}
            >
              <h2>Daily macrocalories consumption trend</h2>
              <MacroStackedChart
                meals={meals}
                cumulative={false}
                target={profile.targetcalories}
                startDay={actualStartDate}
                endDay={actualEndDate}
              />
            </div>
            {/**Burnt calories */}
            <div
              className="card-custom flex-col flex-center"
              style={{ minWidth: "200px", maxWidth: "500px" }}
            >
              <h2>Daily burnt calories</h2>
              <BurntCaloriesBarChart
                exercises={exercises}
                startDate={startDay}
                endDate={endDay}
              />
            </div>
            {/**Macrocalories overview (ring thing) */}
            <div
              className="card-custom flex-col flex-center"
              style={{ minWidth: "200px", maxWidth: "500px" }}
            >
              <h2>Macrocalories overview</h2>
              <MacroDonutChart meals={meals} average={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Stats;
