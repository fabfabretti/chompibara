import "./MealTypeSelector.css";
import {
  faAppleWhole,
  faBowlFood,
  faCookie,
  faPizzaSlice,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MealData from "../../../types/MealData";

type MealTypeSelectorProps = {
  meal: MealData;
  setMeal: React.Dispatch<React.SetStateAction<MealData>>;
};

function MealTypeSelector({ meal, setMeal }: MealTypeSelectorProps) {
  const mealOptions = [
    { value: "Other", icon: faQuestion },
    { value: "Breakfast", icon: faCookie },
    { value: "Lunch", icon: faBowlFood },
    { value: "Snack", icon: faAppleWhole },
    { value: "Dinner", icon: faPizzaSlice },
  ];

  return (
    <div className="upload-element meal-selector">
      {mealOptions.map(({ value, icon }) => (
        <label
          key={value}
          className={`meal-option ${meal.mealtype === value ? "selected" : ""}`}
        >
          <input
            type="radio"
            name="mealtype"
            value={value}
            checked={meal.mealtype === value}
            onChange={() => setMeal((prev) => ({ ...prev, mealtype: value }))}
          />
          <FontAwesomeIcon icon={icon} size="2x" />
          <span>{value}</span>
        </label>
      ))}
    </div>
  );
}

export default MealTypeSelector;
