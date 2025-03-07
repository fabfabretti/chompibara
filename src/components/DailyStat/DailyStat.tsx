import { useEffect, useState } from "react";
import MealData from "../../type/MealData";
import MacroDonutChart2 from "../MacroDonutChart/MacroDonutChart";
import MacroProgressRing from "../MacroProgressRing/MacroProgressRing";

import { SupabaseManager } from "../supabaseManager";
import { defaultProfile } from "../../pages/profile/Profile";
import MacroStackedChart from "../Graphs/MacroStackedChart/MacroStackedChart";

type DailyDashboardProps = {
  meals: Array<MealData>;
};

function DailyDashboard({ meals }: DailyDashboardProps) {
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFats, setTotalFats] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [profile, setProfile] = useState(defaultProfile);

  const supabaseManager = SupabaseManager.getInstance();

  // Load profile to get targets
  useEffect(() => {
    supabaseManager.getProfile().then((profile) => setProfile(profile));
  }, []);

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
      className="stat-container flex-col "
      style={{
        width: "50%",
        height: "100%",
        maxWidth: "400px",
        color: "var(--on-primary-color)",
      }}
    >
      <h1>Daily stats</h1>
      <div className="flex-col" style={{ gap: "10px", marginTop: "10px" }}>
        <MacroDonutChart2
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
      <h2>Cumulative calories by hour</h2>
      <div>
        <MacroStackedChart
          meals={meals}
          target={profile.targetcalories}
          cumulative={true}
        />
      </div>
    </div>
  );
}

export default DailyDashboard;
