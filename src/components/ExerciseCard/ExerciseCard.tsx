import { useState } from "react";

import { ExerciseData } from "../../types/ExerciseTypes";
import { SupabaseManager } from "../../context/supabaseManager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faClock,
  faCalendar,
  faDumbbell,
  faHeartbeat,
  faRunning,
  faTrash,
  faEdit,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";

import Chip from "../Chip/Chip";
import ExerciseTypeSelector from "../inputs/ExerciseTypeSelector/ExerciseTypeSelector";
import Loadingspinner from "../Loadingspinner/Loadingspinner";
import InputField from "../inputs/MealInput/MealInput";

// Props
type ExerciseCardProp = {
  exercise: ExerciseData;
};
type ExerciseType = "other" | "cardio" | "strength" | "endurance" | "complete";

function ExerciseCard({ exercise: propExercise }: ExerciseCardProp) {
  const [exercise, setExercise] = useState<ExerciseData>(propExercise);
  const [isBeingDeleted, setIsBeingDeleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [oldExercise, setOldExercise] = useState(propExercise);
  const [deleted, setDeleted] = useState(false);
  const [errorString, setErrorString] = useState("");

  const getExerciseIcon = (exerciseType: string) => {
    const key = exerciseType.toLowerCase() as ExerciseType;
    return icons[key] || icons.other;
  };

  const icons = {
    other: <FontAwesomeIcon icon={faQuestion} />,
    cardio: <FontAwesomeIcon icon={faHeartbeat} />,
    strength: <FontAwesomeIcon icon={faDumbbell} />,
    endurance: <FontAwesomeIcon icon={faRunning} />,
    complete: <FontAwesomeIcon icon={faDumbbell} />,
  };

  const supabaseManager = SupabaseManager.getInstance();

  const deleteExercise = () => {
    setIsBeingDeleted(true);
    supabaseManager.deleteExercise(exercise.id).then((result) => {
      if (result) {
        setIsBeingDeleted(false);
        setDeleted(true);
      }
    });
  };

  const saveEditing = async () => {
    setIsUpdating(true);
    try {
      await supabaseManager.updateExercise(exercise);
    } catch (error) {
      console.error("Errore durante l'update dell'esercizio", error);
    }
    setIsUpdating(false);
    setIsEditing(false);
  };

  const discardEditing = () => {
    setExercise(oldExercise);
    setIsEditing(false);
  };

  return (
    <div
      className={`shadow-[0px_4px_0px_rgba(0,0,0,0.31)] border-3 border-[var(--primary-color)] bg-white rounded-lg p-4 transition-transform duration-200 hover:-translate-y-1 ${
        deleted
          ? "opacity-0 max-h-0 overflow-hidden p-0 m-0 border-0 transition-all duration-300"
          : ""
      }`}
      style={deleted ? { pointerEvents: "none" } : {}}
      onTransitionEnd={(e) => {
        if (deleted) e.currentTarget.style.display = "none";
      }}
    >
      {isUpdating ? (
        <Loadingspinner />
      ) : (
        <div className="flex flex-row gap-5 fadein-card">
          <div className="flex flex-col justify-around gap-2 flex-grow">
            <div>
              {isEditing ? (
                <InputField
                  item={exercise}
                  setItem={setExercise}
                  type="text"
                  label="Exercise Name"
                  fieldName="name"
                  align=""
                />
              ) : (
                <h2 className="font-caprasimo text-2xl">{exercise.name}</h2>
              )}
            </div>

            {isEditing ? (
              <ExerciseTypeSelector
                exercise={exercise}
                setExercise={setExercise}
              />
            ) : (
              <Chip
                icon={getExerciseIcon(exercise.type)}
                label={exercise.type}
                color="var(--primary-color)"
              />
            )}

            <div className="flex flex-col text-gray-800 text-sm gap-1">
              <div>
                {isEditing ? (
                  <InputField
                    item={exercise}
                    setItem={setExercise}
                    type="date"
                    label="Date"
                    fieldName="date"
                    align=""
                  />
                ) : (
                  <div>
                    <FontAwesomeIcon icon={faCalendar} /> {exercise.date}
                  </div>
                )}
              </div>
              <div>
                {isEditing ? (
                  <InputField
                    item={exercise}
                    setItem={setExercise}
                    type="time"
                    label="Time"
                    fieldName="time"
                    align=""
                  />
                ) : (
                  <div>
                    <FontAwesomeIcon icon={faClock} />{" "}
                    {exercise.time.substring(0, 5)}
                  </div>
                )}
              </div>
              <div>
                {isEditing ? (
                  <InputField
                    item={exercise}
                    setItem={setExercise}
                    type="string"
                    label="Burnt calories"
                    fieldName="calories"
                    align=""
                  />
                ) : (
                  <div>
                    {exercise.calories
                      ? `${exercise.calories} kcal`
                      : "Burnt calories not set"}
                  </div>
                )}
              </div>
              <div>
                {isEditing ? (
                  <InputField
                    item={exercise}
                    setItem={setExercise}
                    type="text"
                    label="Duration"
                    fieldName="duration"
                    align=""
                  />
                ) : (
                  <div>{exercise.duration}</div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              {isEditing ? (
                <>
                  <button onClick={saveEditing}>Save</button>
                  <button onClick={discardEditing}>Discard</button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setOldExercise(exercise);
                    setIsEditing(true);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              )}
              <button disabled={isBeingDeleted} onClick={deleteExercise}>
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

export default ExerciseCard;
