import "./Exercise.css";

import { useState } from "react";

import {
  defaultExerciseData,
  ExerciseData,
} from "../../context/types/ExerciseTypes";

import InputField from "../../components/inputs/InputField/InputField";
import Loadingspinner from "../../components/Loadingspinner/Loadingspinner";
import ExerciseTypeSelector from "../../components/inputs/ExerciseTypeSelector/ExerciseTypeSelector";

import { SupabaseManager } from "../../context/SupabaseManager";
import ExerciseCard from "../../components/ExerciseCard/ExerciseCard";

function Exercise() {
  //State
  const [errorString, setErrorString] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [hasBeenUploaded, setHasBeenUploaded] = useState(false);
  const [exercise, setExercise] = useState<ExerciseData>(defaultExerciseData);

  //Validation
  const exerciseIsValid = () => {
    let errors = [];
    if (exercise.name.trim() === "") {
      errors.push("Name cannot be empty.");
    }
    if (exercise.calories !== undefined && exercise.calories <= 0) {
      errors.push("Calories must be greater than 0.");
    }
    if (exercise.calories !== undefined && exercise.calories > 32767) {
      errors.push("Calories value is too large.");
    }
    setErrorString(errors.join("\n"));
    return errors.length === 0;
  };

  const submitData = async () => {
    if (exerciseIsValid()) {
      setIsUploading(true);
      let result: number | null = null;

      const supabaseManager = SupabaseManager.getInstance();
      result = await supabaseManager.createExercise(exercise);

      setIsUploading(false);
      setHasBeenUploaded(true);
      if (result != null) {
        setExercise((prev) => ({ ...prev, id: result }));
      }
    } else {
      console.log("Input not valid!!");
    }
  };

  return (
    <div className="track-page page">
      {hasBeenUploaded ? <h1>Exercise uploaded!</h1> : <h1>Add an exercise</h1>}
      {!hasBeenUploaded ? (
        <div className="upload-container">
          {isUploading ? (
            <Loadingspinner />
          ) : (
            <div className="flex-col flex-center gap20">
              <div className="upload-data">
                <div className="upload-element">
                  <InputField
                    item={exercise}
                    setItem={setExercise}
                    type="text"
                    label="Exercise Name"
                    fieldName="name"
                  />
                </div>
                <div className="upload-element">
                  <InputField
                    item={exercise}
                    setItem={setExercise}
                    type="date"
                    label="Date"
                    fieldName="date"
                  />
                </div>
                <div className="upload-element">
                  <InputField
                    item={exercise}
                    setItem={setExercise}
                    type="time"
                    label="Time"
                    fieldName="time"
                  />
                </div>
                <div className="upload-element">
                  <InputField
                    item={exercise}
                    setItem={setExercise}
                    type="text"
                    label="Duration"
                    fieldName="duration"
                  />
                </div>
                <div className="upload-element">
                  <InputField
                    item={exercise}
                    setItem={setExercise}
                    type="number"
                    label="Calories Burned"
                    fieldName="calories"
                  />
                </div>
                <ExerciseTypeSelector
                  exercise={exercise}
                  setExercise={setExercise}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <ExerciseCard exercise={exercise} />
      )}

      <div style={{ color: "var(--primary-color)" }}>{errorString}</div>
      {!hasBeenUploaded ? (
        <button
          className="submit primary"
          onClick={submitData}
          disabled={isUploading}
        >
          Upload your exercise!
        </button>
      ) : (
        <button
          className="submit primary"
          onClick={() => window.location.reload()}
        >
          Track another exercise
        </button>
      )}
    </div>
  );
}

export default Exercise;
