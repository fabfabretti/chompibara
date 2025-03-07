import { useState } from "react";
import InputCustom from "../../components/InputCustom/InputCustom";
import MacroDonutChart from "../../components/MacroDonutChart/MacroDonutChart";
import MealData from "../../type/MealData";
import { SupabaseManager } from "../../components/supabaseManager";
import MacroStackedChart from "../../components/Graphs/MacroStackedChart/MacroStackedChart";

const today = new Date().toISOString().split("T")[0];
const now = new Date().toTimeString().slice(0, 5);

function Stats() {
  //State
  const [startDay, setStartDay] = useState(today);
  const [endDay, setEndDay] = useState(today);
  const [meals, setMeals] = useState<MealData[]>([]);

  //Functions
  const setMealsFromRange = () => {
    const supabaseManager = SupabaseManager.getInstance();

    supabaseManager
      .getMealsInDateRange(new Date(startDay), new Date(endDay))
      .then((result) => setMeals(result));
  };

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
      <MacroStackedChart meals={meals} cumulative={false} />
    </div>
  );
}

export default Stats;
