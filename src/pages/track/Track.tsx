import "./Track.css";

import { useState } from "react";

import { SupabaseManager } from "../../context/SupabaseManager";

import FileLoader from "../../components/FileLoader/FileLoader";
import { defaultMeal } from "../../context/types/MealTypes";
import MealTypeSelector from "../../components/inputs/MealTypeSelector/MealTypeSelector";
import InputField from "../../components/inputs/InputField/InputField";
import Loadingspinner from "../../components/Loadingspinner/Loadingspinner";
import MealCard from "../../components/MealCard/MealCard";

// Render
function Track() {
  //State
  const [image, setImage] = useState<File | null>(null);
  const [errorString, setErrorString] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [hasBeenUploaded, setHasBeenUploaded] = useState(false);
  const [meal, setMeal] = useState(defaultMeal);

  // Functions

  // Check input
  const mealIsValid = () => {
    let errors = [];

    if (meal.title.trim() === "") {
      errors.push("Title cannot be empty.");
    }
    if (meal.calories !== null) {
      if (meal.calories <= 0) {
        errors.push("Calories must be greater than 0.");
      }
      if (meal.calories > 32767) {
        errors.push("Calories value is too large.");
      }
    }
    if (meal.fats !== null) {
      if (meal.fats < 0) {
        errors.push("Fats cannot be negative.");
      }
      if (meal.fats > 32767) {
        errors.push("Fats value is too large.");
      }
    }
    if (meal.carbos !== null) {
      if (meal.carbos < 0) {
        errors.push("Carbohydrates cannot be negative.");
      }
      if (meal.carbos > 32767) {
        errors.push("Carbohydrates value is too large.");
      }
    }
    if (meal.protein !== null) {
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

  // Upload data and image if present
  const submitData = async () => {
    if (mealIsValid()) {
      console.log("Initiating upload");
      setIsUploading(true);
      let result: number | null = null;

      const supabaseManager = SupabaseManager.getInstance();
      if (image) {
        result = await supabaseManager.createMeal(meal, image);
        console.log("Uploaded with image");
      } else {
        result = await supabaseManager.createMeal(meal);
        console.log("Uploaded with NO image");
      }
      setIsUploading(false);
      setHasBeenUploaded(true);
      if (result != null) {
        setMeal((prev) => ({ ...prev, id: result }));
      }
    } else {
      console.log("Input not valid!!");
    }
  };

  //Render
  return (
    <div className="track-page page">
      {hasBeenUploaded ? <h1>Meal uploaded!</h1> : <h1>Add a meal</h1>}

      {!hasBeenUploaded ? (
        <div className="upload-container ">
          {isUploading ? (
            <Loadingspinner />
          ) : (
            <div className="flex-col flex-center gap20">
              {/* Upload file */}
              <FileLoader image={image} setImage={setImage} />

              <div className="upload-data">
                <div className="flex-row space-around">
                  <MealTypeSelector meal={meal} setMeal={setMeal} />

                  {/* Date selector */}
                  <div className="upload-element">
                    <InputField
                      item={meal}
                      setItem={setMeal}
                      type="date"
                      label="Date"
                      fieldName="date"
                    />
                  </div>

                  {/* Time selector */}
                  <div className="upload-element">
                    <InputField
                      item={meal}
                      setItem={setMeal}
                      type="time"
                      label="Time"
                      fieldName="time"
                    />
                  </div>
                </div>

                {/* Title selector */}
                <div className="upload-element">
                  <InputField
                    item={meal}
                    setItem={setMeal}
                    type="text"
                    label="Meal Name"
                    fieldName="title"
                  />
                </div>

                {/* Calories selector */}
                <div className="upload-element">
                  <InputField
                    item={meal}
                    setItem={setMeal}
                    type="number"
                    label="Calories"
                    fieldName="calories"
                  />
                </div>

                <div
                  className="calories-element flex-row space-between"
                  style={{ justifyContent: "center" }}
                >
                  <div className="upload-element">
                    <InputField
                      item={meal}
                      setItem={setMeal}
                      type="number"
                      label="Carbohydrates (g)"
                      fieldName="carbos"
                    />
                  </div>

                  <div className="upload-element">
                    <InputField
                      item={meal}
                      setItem={setMeal}
                      type="number"
                      label="Fats (g)"
                      fieldName="fats"
                    />
                  </div>

                  <div className="upload-element">
                    <InputField
                      item={meal}
                      setItem={setMeal}
                      type="number"
                      label="Proteins (g)"
                      fieldName="protein"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <MealCard meal={meal} />
      )}

      <div>{errorString}</div>
      {!hasBeenUploaded ? (
        <button
          className="submit primary"
          onClick={submitData}
          disabled={isUploading}
        >
          Upload your meal!
        </button>
      ) : (
        <button
          className="submit primary"
          onClick={() => window.location.reload()}
        >
          Track another meal
        </button>
      )}
    </div>
  );
}

export default Track;
