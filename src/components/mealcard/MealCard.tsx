import "./MealCard.css";
import { useState } from "react";

import MealData from "../../type/MealData";
import Loadingspinner from "../Loadingspinner/Loadingspinner";
import { SupabaseManager } from "../supabaseManager";
import MacroDonutChart2 from "../MacroDonutChart/MacroDonutChart2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faClock,
  faCalendar,
  faCookie,
  faDeleteLeft,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import Chip from "../Chip/Chip";

//Props
type MealCardProp = {
  meal: MealData;
};

function MealCard(props: MealCardProp) {
  //States
  const [meal, setMeal] = useState<MealData>(props.meal);
  const [imageLoading, setImageLoading] = useState(true);
  const [isBeingDeleted, setIsBeingDeleted] = useState(false);
  const [deleted, setDeleted] = useState(false);

  //DB
  const supabaseManager = SupabaseManager.getInstance();

  const deleteMeal = () => {
    setIsBeingDeleted(true);
    supabaseManager.deleteMeal(meal.id).then((result) => {
      if (result == true) {
        setIsBeingDeleted(false);
        setDeleted(true);
      }
    });
  };

  //Render
  return (
    <div
      className={`mealcard flexrow gap20 fadein-card ${
        deleted ? "fade-out" : ""
      }`}
      style={deleted ? { pointerEvents: "none" } : {}}
      onTransitionEnd={(e) => {
        if (deleted) e.currentTarget.style.display = "none";
      }}
    >
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
          <h1 className="mealtitle">{meal.title}</h1>
        </div>
        <Chip
          icon={<FontAwesomeIcon icon={faCookie} />}
          label={meal.mealtype}
          color="var(--primary-color)"
        />
        <div
          className="flex-col"
          style={{ color: "#12121", fontSize: "0.8em", gap: "5px" }}
        >
          <div>
            <FontAwesomeIcon icon={faCalendar} /> {meal.date}
          </div>{" "}
          <div>
            <FontAwesomeIcon icon={faClock} /> {meal.time}
          </div>{" "}
        </div>
        <div className="action-container">
          <button>
            {" "}
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button disabled={isBeingDeleted} onClick={deleteMeal}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
      <MacroDonutChart2
        meals={[props.meal]}
        height={100}
        legendPosition="bottom"
      />
    </div>
  );
}

export default MealCard;
