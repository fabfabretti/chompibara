import { useEffect, useState } from "react";
import MealData from "../../type/MealData";
import MacroDonutChart2 from "../MacroDonutChart/MacroDonutChart2";
import MacroProgressRing from "../MacroProgressRing/MacroProgressRing";

import { SupabaseManager } from "../supabaseManager";
import { defaultProfile } from "../../pages/profile/Profile";

type DailyStatProps = {
  meals: Array<MealData>;
};

function DailyStat({ meals }: DailyStatProps) {
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFats, setTotalFats] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [profile, setProfile] = useState(defaultProfile);

  const supabaseManager = SupabaseManager.getInstance();

  // Effects

  // Load profile to get targets
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
          height={200}
          targetCalories={profile.targetcalories}
        />
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
  );
}

export default DailyStat;
