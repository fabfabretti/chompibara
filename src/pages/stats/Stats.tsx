import { useEffect, useState } from "react";
import MacroDonutChart from "../../components/graphs/MacroDonutChart/MacroDonutChart";
import MealData from "../../types/MealData";
import { SupabaseManager } from "../../context/supabaseManager";
import MacroStackedChart from "../../components/graphs/MacroStackedChart/MacroStackedChart";
import { defaultProfile } from "../../types/defaultProfile";
import ProfileData from "../../types/ProfileData";

const today = new Date().toISOString().split("T")[0];
const aWeekAgo = new Date(); // Create a new Date object
aWeekAgo.setDate(aWeekAgo.getDate() - 7); // Subtract 7 days

const weekAgo = aWeekAgo.toISOString().split("T")[0];

function Stats() {
  //State
  const [startDay, setStartDay] = useState(weekAgo);
  const [endDay, setEndDay] = useState(today);
  const [meals, setMeals] = useState<MealData[]>([]);
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  const supabaseManager = SupabaseManager.getInstance();

  //Functions
  const setMealsFromRange = () => {
    supabaseManager
      .getMealsInDateRange(new Date(startDay), new Date(endDay))
      .then((result) => setMeals(result));
  };

  //Effects
  useEffect(() => {
    setMealsFromRange();
    supabaseManager.getProfile().then((profile) => {
      setProfile(profile);
    });
  }, []);

  //Render
  return (
    <div className="page">
      <div className="flexrow gap20">
        <label>
          Start date:
          <input
            type="date"
            value={startDay}
            onChange={(e) => setStartDay(e.target.value)}
          ></input>
        </label>
        <label>
          End date:
          <input
            type="date"
            value={endDay}
            onChange={(e) => setEndDay(e.target.value)}
          ></input>
        </label>

        <button onClick={() => setMealsFromRange()}>Calculate</button>
      </div>

      <MacroDonutChart meals={meals} average={true} />
      <MacroStackedChart
        meals={meals}
        cumulative={false}
        target={profile.targetcalories}
      />
    </div>
  );
}

export default Stats;
