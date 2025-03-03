import "./MealCard.css";
import { useState } from "react";

import MealData from "../../type/MealData";
import { SupabaseManager } from "../supabaseManager";
import MacroDonutChart2 from "../MacroDonutChart/MacroDonutChart2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faClock,
  faCalendar,
  faCookie,
  faTrash,
  faEdit,
  faQuestion,
  faBowlFood,
  faAppleAlt,
  faPizzaSlice,
} from "@fortawesome/free-solid-svg-icons";
import Chip from "../Chip/Chip";

//Props
type MealCardProp = {
  meal: MealData;
};
type MealType = "other" | "breakfast" | "lunch" | "snack" | "dinner";

function MealCard(props: MealCardProp) {
  //States
  const [meal, setMeal] = useState<MealData>(props.meal);
  const [isBeingDeleted, setIsBeingDeleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false); //User is editing the component
  const [isBeingEdited, setIsBeingEdited] = useState(false); // User has clicked "Confirm" after editing
  const [editedMeal, setEditedMeal] = useState(props.meal);
  const [deleted, setDeleted] = useState(false);

  // Icon info
  const getMealIcon = (mealType: string) => {
    const key = mealType.toLowerCase() as MealType;
    return icons[key] || icons.other;
  };
  const icons = {
    other: <FontAwesomeIcon icon={faQuestion} />,
    breakfast: <FontAwesomeIcon icon={faCookie} />,
    lunch: <FontAwesomeIcon icon={faBowlFood} />,
    snack: <FontAwesomeIcon icon={faAppleAlt} />,
    dinner: <FontAwesomeIcon icon={faPizzaSlice} />,
  };

  //DB
  const supabaseManager = SupabaseManager.getInstance();

  // Functions
  const deleteMeal = () => {
    setIsBeingDeleted(true);
    supabaseManager.deleteMeal(meal.id).then((result) => {
      if (result == true) {
        setIsBeingDeleted(false);
        setDeleted(true);
      }
    });
  };

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
    console.log(props.meal.id + " " + isEditing);
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
        {isEditing ? (
          "aaa"
        ) : !meal.photo ? (
          <div
            style={{
              color: "#bbb",
              backgroundColor: "#eee",
              textAlign: "center",
              height: "100%",
            }}
          >
            <div>No image was uploaded</div>
          </div>
        ) : (
          <img
            className="mealphoto"
            src={meal.photo}
            alt={"Food photo for meal " + meal.id}
          />
        )}
      </div>
      <div style={{ minWidth: "90px" }}>
        {isEditing ? (
          "editing"
        ) : (
          <MacroDonutChart2
            meals={[props.meal]}
            height={100}
            legendPosition="bottom"
          />
        )}
      </div>
      <div className="mealinfo">
        <div>
          <h1 className="mealtitle">
            {isEditing ? "editing" : props.meal.title}
          </h1>
        </div>

        {isEditing ? (
          "editing"
        ) : (
          <Chip
            icon={getMealIcon(meal.mealtype)}
            label={meal.mealtype}
            color="var(--primary-color)"
          />
        )}

        <div
          className="flex-col"
          style={{ color: "#12121", fontSize: "0.8em", gap: "5px" }}
        >
          <div>
            <FontAwesomeIcon icon={faCalendar} />{" "}
            {isEditing ? "editing" : meal.date}
          </div>
          <div>
            <FontAwesomeIcon icon={faClock} />{" "}
            {isEditing ? "editing" : meal.time}
          </div>
        </div>
        <div className="action-container">
          <button onClick={toggleEditing}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button disabled={isBeingDeleted} onClick={deleteMeal}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MealCard;
