import { useEffect, useState } from "react";

import { MealData } from "../../context/types/MealTypes";
import { ExerciseData } from "../../context/types/ExerciseTypes";
import { defaultProfile, ProfileData } from "../../context/types/ProfileTypes";

import { SupabaseManager } from "../../context/SupabaseManager";

import MacroDonutChart from "../graphs/MacroDonutChart/MacroDonutChart";
import MacroProgressRing from "../graphs/MacroProgressRing/MacroProgressRing";
import MacroStackedChart from "../graphs/MacroStackedChart/MacroStackedChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faFire,
  faGauge,
} from "@fortawesome/free-solid-svg-icons";
import BurntCaloriesBarChart from "../graphs/BurntCaloriesBarChart.tsx/BurntCaloriesBarChart";

type DailyDashboardProps = {
  meals: Array<MealData>;
  exercises: Array<ExerciseData>;
};

function DailyDashboard({ meals, exercises }: DailyDashboardProps) {
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFats, setTotalFats] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [burned, setBurned] = useState<number>(0);

  const supabaseManager = SupabaseManager.getInstance();

  // Load profile to get targets
  useEffect(() => {
    supabaseManager.getProfile().then((profile) => setProfile(profile));
  }, []);

  // Recompute exercises when exercises changes
  useEffect(() => {
    setBurned(
      exercises.reduce((sum, exercise) => sum + (exercise.calories || 0), 0)
    );
  }, [exercises]);

  // Compute total macros
  useEffect(() => {
    const carbs = meals.reduce((sum, meal) => sum + (meal.carbos || 0), 0);
    const fats = meals.reduce((sum, meal) => sum + (meal.fats || 0), 0);
    const protein = meals.reduce((sum, meal) => sum + (meal.protein || 0), 0);

    setTotalCarbs(carbs);
    setTotalFats(fats);
    setTotalProtein(protein);
  }, [meals]);

  return (
    <div
      className="stat-component flex-col gap20"
      style={{
        color: "var(--on-primary-color)",
        gap: "30px",
        height: "100%",
        padding: "30px",
        backgroundColor: "var(--dark-color)",
      }}
    >
      <div>
        <div className="burned-title flex-row gap20">
          <FontAwesomeIcon
            icon={faGauge}
            size="2x"
            color="var(--primary-color)"
          />
          <h2>Targets</h2>
        </div>{" "}
        <div
          className="macrodonutchart-container flex-col"
          style={{ marginTop: "10px" }}
        >
          <MacroDonutChart
            meals={meals}
            height={150}
            targetCalories={profile.targetcalories}
          />
        </div>
        <div className="macrorings-container">
          <div className="macros flex-row flex-center">
            <MacroProgressRing
              label="Carbs"
              target={profile.targetcarbo}
              value={totalCarbs}
            />
            <MacroProgressRing
              label="Protein"
              target={profile.targetprotein}
              value={totalProtein}
            />
            <MacroProgressRing
              label="Fats"
              target={profile.targetfat}
              value={totalFats}
            />
          </div>
        </div>
      </div>

      {/**Stacked chart */}
      <div>
        <div className="burned-title flex-row gap20">
          <FontAwesomeIcon
            icon={faArrowTrendUp}
            color="var(--primary-color)"
            size="2x"
          />
          <h2>Calorie consumption</h2>
        </div>{" "}
        <div>
          <MacroStackedChart
            meals={meals}
            target={profile.targetcalories}
            cumulative={true}
          />{" "}
        </div>
      </div>

      {/** Burned */}
      <div className="burned-paragraph flex-col ">
        <div className="burned-title flex-row gap20">
          <FontAwesomeIcon
            icon={faFire}
            color="var(--primary-color)"
            size="2x"
          />
          <h2>Exercise</h2>
        </div>

        {exercises.length == 0 ? (
          <p style={{ color: "var(--greyed-out)", textAlign: "center" }}>
            No exercises recorded on this day.
          </p>
        ) : (
          <div className="flex-col gap20" style={{ alignItems: "center" }}>
            {exercises.length > 1 ? (
              <BurntCaloriesBarChart exercises={exercises} />
            ) : null}
            <p>
              {" "}
              {exercises.length}{" "}
              {exercises.length == 1 ? "session" : "sessions"},
              {burned != 0 ? <span> {burned} kcal burnt</span> : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyDashboard;
