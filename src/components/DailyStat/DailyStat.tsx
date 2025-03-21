import { useEffect, useState } from "react";
import MealData from "../../types/MealData";
import MacroDonutChart from "../graphs/MacroDonutChart/MacroDonutChart";
import MacroProgressRing from "../graphs/MacroProgressRing/MacroProgressRing";
import { SupabaseManager } from "../../context/supabaseManager";
import { defaultProfile } from "../../types/defaultProfile";
import MacroStackedChart from "../graphs/MacroStackedChart/MacroStackedChart";

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
        gap: "30px",
      }}
    >
      <div>
        <h2>Daily stats</h2>
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
      <div>
        <h2>Cumulative calories by hour</h2>
        <div>
          <MacroStackedChart
            meals={meals}
            target={profile.targetcalories}
            cumulative={true}
          />
        </div>
      </div>
    </div>
  );
}

export default DailyDashboard;
