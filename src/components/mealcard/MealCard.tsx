import "./MealCard.css";
import MealData from "../../type/MealData";
import Loadingspinner from "../Loadingspinner/Loadingspinner";
import { useState } from "react";
//Prop
type MealCardProp = {
  meal: MealData;
};

function MealCard(props: MealCardProp) {
  //Const
  const [meal, setMeal] = useState<MealData>(props.meal);
  const [imageLoading, setImageLoading] = useState(true);

  //Render
  return (
    <div className="mealcard flexrow gap20 fadein-card">
      <div className="image-container">
        {imageLoading ? <Loadingspinner /> : ""}
        <img
          className="mealphoto"
          src={meal.photo}
          alt="food image"
          onLoad={() => setImageLoading(false)}
          style={{ display: imageLoading ? "none" : "block" }} // Nasconde l'immagine finché non è caricata
        />
      </div>

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
