import {
  faAppleWhole,
  faBowlFood,
  faCookie,
  faPizzaSlice,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MealData from "../../type/MealData";

type MealTypeSelectorProps = {
  meal: MealData;
  setMeal: React.Dispatch<React.SetStateAction<MealData>>;
};

function MealTypeSelector({ meal, setMeal }: MealTypeSelectorProps) {
  return (
    <div className="upload-element meal-selector">
      {/*Meal Selector*/}
      <label className="meal-option">
        <input
          type="radio"
          name="mealtype"
          value="Other"
          checked={meal.mealtype === "Other"}
          onChange={(e) =>
            setMeal((prev) => ({ ...prev, mealtype: e.target.value }))
          }
        />
        <FontAwesomeIcon icon={faQuestion} />
        Other
      </label>
      <label className="meal-option">
        <input
          type="radio"
          name="mealtype"
          value="Breakfast"
          checked={meal.mealtype === "Breakfast"}
          onChange={(e) =>
            setMeal((prev) => ({ ...prev, mealtype: e.target.value }))
          }
        />
        <FontAwesomeIcon icon={faCookie} />
        Breakfast
      </label>
      <label className="meal-option">
        <input
          type="radio"
          name="mealtype"
          value="Lunch"
          checked={meal.mealtype === "Lunch"}
          onChange={(e) =>
            setMeal((prev) => ({ ...prev, mealtype: e.target.value }))
          }
        />
        <FontAwesomeIcon icon={faBowlFood} />
        Lunch
      </label>
      <label className="meal-option">
        <input
          type="radio"
          name="mealtype"
          value="Snack"
          checked={meal.mealtype === "Snack"}
          onChange={(e) =>
            setMeal((prev) => ({ ...prev, mealtype: e.target.value }))
          }
        />
        <FontAwesomeIcon icon={faAppleWhole} />
        Snack
      </label>
      <label className="meal-option">
        <input
          type="radio"
          name="mealtype"
          value="Dinner"
          checked={meal.mealtype === "Dinner"}
          onChange={(e) =>
            setMeal((prev) => ({ ...prev, mealtype: e.target.value }))
          }
        />
        <FontAwesomeIcon icon={faPizzaSlice} />
        Dinner
      </label>
    </div>
  );
}

export default MealTypeSelector;
