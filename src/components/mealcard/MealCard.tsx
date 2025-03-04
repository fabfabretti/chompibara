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
import MealTypeSelector from "../inputs/MealTypeSelector/MealTypeSelector";
import Loadingspinner from "../Loadingspinner/Loadingspinner";
import TextInput from "../inputs/TextInput/TextInput";

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
  const [isUpdating, setIsUpdating] = useState(false); // User has clicked "Confirm" after editing
  const [oldMeal, setOldMeal] = useState(props.meal);
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
    if (!isEditing) setOldMeal(meal);
    if (isEditing) saveEditing();
    setIsEditing((prev) => !prev);
  };

  const saveEditing = () => {
    setIsUpdating(true);
    supabaseManager.updateMeal(meal).then(() => setIsUpdating(false));
  };
  const discardEditing = () => {
    setMeal(oldMeal);
    setIsEditing((prev) => !prev);
  };

  //Render
  return (
    <div
      className={`mealcard  ${deleted ? "fade-out" : ""}`}
      style={deleted ? { pointerEvents: "none" } : {}}
      onTransitionEnd={(e) => {
        if (deleted) e.currentTarget.style.display = "none";
      }}
    >
      {isUpdating ? (
        <Loadingspinner />
      ) : (
        <div className="flexrow gap20 fadein-card">
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
              <div
                className="flex-col space-between"
                style={{ justifyContent: "center" }}
              >
                <TextInput
                  meal={meal}
                  setMeal={setMeal}
                  type="number"
                  label="Carbohydrates (g)"
                  fieldName="carbos"
                />

                <TextInput
                  meal={meal}
                  setMeal={setMeal}
                  type="number"
                  label="Fats (g)"
                  fieldName="fats"
                />

                <TextInput
                  meal={meal}
                  setMeal={setMeal}
                  type="number"
                  label="Proteins (g)"
                  fieldName="protein"
                />
              </div>
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
              {isEditing ? (
                <TextInput
                  meal={meal}
                  setMeal={setMeal}
                  type="text"
                  label="Meal Name"
                  fieldName="title"
                  align=""
                />
              ) : (
                <h1 className="mealtitle">{props.meal.title} </h1>
              )}
            </div>

            {isEditing ? (
              <MealTypeSelector meal={meal} setMeal={setMeal} />
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
                {isEditing ? (
                  <TextInput
                    meal={meal}
                    setMeal={setMeal}
                    type="date"
                    label="Date"
                    fieldName="date"
                    align=""
                  />
                ) : (
                  meal.date
                )}
              </div>
              <div>
                <FontAwesomeIcon icon={faClock} />{" "}
                {isEditing ? (
                  <TextInput
                    meal={meal}
                    setMeal={setMeal}
                    type="time"
                    label="Time"
                    fieldName="time"
                    align=""
                  />
                ) : (
                  meal.time
                )}
              </div>
            </div>
            <div className="action-container">
              {isEditing ? (
                <div>
                  <button onClick={toggleEditing}>Save</button>
                  <button onClick={discardEditing}>Discard</button>
                </div>
              ) : (
                <button onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              )}

              <button disabled={isBeingDeleted} onClick={deleteMeal}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MealCard;
