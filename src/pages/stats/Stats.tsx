import { useEffect, useState } from "react";

import { SupabaseManager } from "../../context/supabaseManager";

import ProfileData from "../../types/ProfileData";
import { defaultProfile } from "../../types/defaultProfile";
import MealData from "../../types/MealData";

import MacroDonutChart from "../../components/graphs/MacroDonutChart/MacroDonutChart";
import MacroStackedChart from "../../components/graphs/MacroStackedChart/MacroStackedChart";
import Loadingspinner from "../../components/Loadingspinner/Loadingspinner";

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

  const [errorString, setErrorString] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const supabaseManager = SupabaseManager.getInstance();

  //Functions
  const setMealsFromRange = () => {
    if (new Date(startDay) > new Date(endDay)) {
      setErrorString(
        "La data di inizio non può essere successiva alla data di fine."
      );
      return;
    }

    setErrorString(""); // Reset errore se le date sono valide
    setIsLoading(true);

    supabaseManager
      .getMealsInDateRange(new Date(startDay), new Date(endDay))
      .then((result) => {
        setMeals(result);
        setIsLoading(false);
      });
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
    <div className="page">
      <h1>Stats</h1>
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

      {errorString}
      {isLoading ? (
        <Loadingspinner />
      ) : (
        <div className="charts-container flex-col gap20">
          <MacroDonutChart meals={meals} average={true} />
          <MacroStackedChart
            meals={meals}
            cumulative={false}
            target={profile.targetcalories}
          />
        </div>
      )}
    </div>
  );
}

export default Stats;
