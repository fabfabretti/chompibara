import mockData from "../../mockdata/mockmeals";
import MealCard from "../../components/mealcard/MealCard";
import "./History.css";
function History() {
  return (
    <div>
      {/* Meals */}

      <div className="mealhistory">
        {mockData.map((mealdata) => (
          <MealCard meal={mealdata} />
        ))}
      </div>
    </div>
  );
}

export default History;
