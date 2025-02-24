import "./MealCard.css";
import MealData from "../../type/MealData";
import Chip from "../Chip/Chip";
//Prop
type MealCardProp = {
  meal: MealData;
};

function MealCard(props: MealCardProp) {
  //Const
  const meal: MealData = props.meal;

  //Render
  return (
    <div className="mealcard flexrow gap20">
      <img className="mealphoto" src={meal.photo} alt="food image" />
      <div className="mealinfo">
        <div>
          {meal.date} - {meal.time} - {meal.mealtype}
        </div>
        <div>
          <h1 className="mealtitle">{meal.title}</h1>
        </div>

        <div className="action-container">
          <button>Edit</button>
          <button>Show details</button>
        </div>
      </div>
    </div>
  );
}

export default MealCard;
