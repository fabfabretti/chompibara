import "./ExerciseCard.css";
import { useState } from "react";

import { ExerciseData } from "../../context/types/ExerciseTypes";
import { SupabaseManager } from "../../context/SupabaseManager";
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
import InputField from "../inputs/InputField/InputField";

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
      className={`exercisecard ${deleted ? "fade-out" : ""}`}
      style={deleted ? { pointerEvents: "none" } : {}}
      onTransitionEnd={(e) => {
        if (deleted) e.currentTarget.style.display = "none";
      }}
    >
      {isUpdating ? (
        <Loadingspinner />
      ) : (
        <div className="flexrow gap20 fadein-card">
          <div className="exerciseinfo">
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
                <h2 className="exercisetitle">{exercise.name}</h2>
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

            <div
              className="flex-col"
              style={{ color: "#12121", fontSize: "0.8em", gap: "5px" }}
            >
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
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesomeIcon icon={faCalendar} />
                    {exercise.date}
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
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesomeIcon icon={faClock} />
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
                    {exercise.calories ? exercise.calories + " kcal" : ""}
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

            <div className="action-container">
              {isEditing ? (
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                  }}
                >
                  <button onClick={saveEditing}>Save</button>
                  <button onClick={discardEditing}>Discard</button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setOldExercise(exercise), setIsEditing(true);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              )}

              <button
                disabled={isBeingDeleted}
                onClick={() => {
                  setExercise(oldExercise), deleteExercise();
                }}
              >
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
