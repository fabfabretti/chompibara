import "./MealCard.css";
import { useState } from "react";

import { MealData } from "../../context/types/MealTypes";
import { SupabaseManager } from "../../context/SupabaseManager";
import MacroDonutChart from "../graphs/MacroDonutChart/MacroDonutChart";
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
import InputField from "../inputs/InputField/InputField";
import FileLoader from "../FileLoader/FileLoader";

//Props
type MealCardProp = {
  meal: MealData;
};
type MealType = "other" | "breakfast" | "lunch" | "snack" | "dinner";

function MealCard(props: MealCardProp) {
  //States
  const [meal, setMeal] = useState<MealData>(props.meal);
  const [image, setImage] = useState<File | null>(null);

  const [isBeingDeleted, setIsBeingDeleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false); //User is editing the component
  const [isUpdating, setIsUpdating] = useState(false); // User has clicked "Confirm" after editing
  const [oldMeal, setOldMeal] = useState(meal);
  const [deleted, setDeleted] = useState(false);

  const [errorString, setErrorString] = useState("");

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

  // Functions
  const isValid = () => {
    let errors = [];

    if (meal.title.trim() === "") {
      errors.push("Title cannot be empty.");
    }
    if (meal.calories) {
      if (meal.calories <= 0) {
        errors.push("Calories must be greater than 0.");
      }
      if (meal.calories > 32767) {
        errors.push("Calories value is too large.");
      }
    }
    if (meal.fats) {
      if (meal.fats < 0) {
        errors.push("Fats cannot be negative.");
      }
      if (meal.fats > 32767) {
        errors.push("Fats value is too large.");
      }
    }
    if (meal.carbos) {
      if (meal.carbos < 0) {
        errors.push("Carbohydrates cannot be negative.");
      }
      if (meal.carbos > 32767) {
        errors.push("Carbohydrates value is too large.");
      }
    }
    if (meal.protein) {
      if (meal.protein < 0) {
        errors.push("Protein cannot be negative.");
      }
      if (meal.protein > 32767) {
        errors.push("Protein value is too large.");
      }
    }

    setErrorString(errors.join("\n"));
    return errors.length === 0;
  };
  const deleteMeal = () => {
    setIsBeingDeleted(true);
    supabaseManager.deleteMeal(meal.id).then((result) => {
      if (result == true) {
        setIsBeingDeleted(false);
        setDeleted(true);
      }
    });
  };

  const saveEditing = async () => {
    if (!isValid()) return;

    setIsUpdating(true);

    let updatedMeal = meal;

    if (image) {
      try {
        const resultUrl = await supabaseManager.uploadMealFile(image);
        updatedMeal = { ...updatedMeal, photo: resultUrl };
      } catch (error) {
        console.error("Errore durante l'upload dell'immagine", error);
        setIsUpdating(false);
        return;
      }
    }

    try {
      await supabaseManager.updateMeal(updatedMeal);
    } catch (error) {
      console.error("Errore durante l'update del pasto", error);
    }

    setIsUpdating(false);
    setIsEditing(false);
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
              <FileLoader image={image} setImage={setImage} />
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
                <InputField
                  item={meal}
                  setItem={setMeal}
                  type="number"
                  label="Carbohydrates (g)"
                  fieldName="carbos"
                />

                <InputField
                  item={meal}
                  setItem={setMeal}
                  type="number"
                  label="Fats (g)"
                  fieldName="fats"
                />

                <InputField
                  item={meal}
                  setItem={setMeal}
                  type="number"
                  label="Proteins (g)"
                  fieldName="protein"
                />

                <InputField
                  item={meal}
                  setItem={setMeal}
                  type="number"
                  label="Calories (kcal)"
                  fieldName="calories"
                />
              </div>
            ) : (
              <MacroDonutChart
                meals={[meal]}
                height={100}
                legendPosition="bottom"
              />
            )}
          </div>
          <div className="mealinfo">
            <div>
              {isEditing ? (
                <InputField
                  item={meal}
                  setItem={setMeal}
                  type="text"
                  label="Meal Name"
                  fieldName="title"
                  align=""
                />
              ) : (
                <h2 className="mealtitle">{meal.title} </h2>
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
                  <InputField
                    item={meal}
                    setItem={setMeal}
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
                  <InputField
                    item={meal}
                    setItem={setMeal}
                    type="time"
                    label="Time"
                    fieldName="time"
                    align=""
                  />
                ) : (
                  meal.time.substring(0, 5)
                )}
              </div>
            </div>
            <div className="action-container">
              {isEditing ? (
                <div>
                  <button onClick={saveEditing}>Save</button>
                  <button onClick={discardEditing}>Discard</button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              )}

              <button disabled={isBeingDeleted} onClick={deleteMeal}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              {isEditing ? errorString : ""}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MealCard;
