import "./ExerciseTypeSelector.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDumbbell,
  faRunning,
  faHeartbeat,
  faStar,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { ExerciseData } from "../../../context/types/ExerciseTypes";

type ExerciseTypeSelectorProps = {
  exercise: ExerciseData;
  setExercise: React.Dispatch<React.SetStateAction<ExerciseData>>;
};

function ExerciseTypeSelector({
  exercise,
  setExercise,
}: ExerciseTypeSelectorProps) {
  const exerciseOptions = [
    { value: "Other", icon: faQuestion },
    { value: "Cardio", icon: faHeartbeat },
    { value: "Strength", icon: faDumbbell },
    { value: "Endurance", icon: faRunning },
    { value: "Complete", icon: faStar },
  ];

  return (
    <div className="upload-element exercise-selector flex-row flex-center flex-wrap">
      {exerciseOptions.map(({ value, icon }) => (
        <label
          key={value}
          className={`exercise-option ${
            exercise.type === value ? "selected" : ""
          }`}
        >
          <input
            type="radio"
            name="exerciseType"
            value={value}
            checked={exercise.type === value}
            onChange={() => setExercise((prev) => ({ ...prev, type: value }))}
          />
          <FontAwesomeIcon icon={icon} size="2x" />
          <span>{value}</span>
        </label>
      ))}
    </div>
  );
}

export default ExerciseTypeSelector;
