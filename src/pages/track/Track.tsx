import "./Track.css";

import { useState } from "react";

import { SupabaseManager } from "../../components/supabaseManager";

import FileLoader from "../../components/FileLoader/FileLoader";
import MealData from "../../type/MealData";
import MealTypeSelector from "../../components/inputs/MealTypeSelector/MealTypeSelector";
import TextInput from "../../components/inputs/TextInput/TextInput";

// Render
function Track() {
  //State
  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toTimeString().slice(0, 5);
  const [image, setImage] = useState<File | null>(null);
  const [errorString, setErrorString] = useState("");

  const defaultMeal: MealData = {
    id: 1,
    photo: undefined,
    title: "",
    mealtype: "Other",
    date: today,
    time: now,
    calories: null,
    fats: null,
    carbos: null,
    protein: null,
  };
  const [meal, setMeal] = useState(defaultMeal);

  // Functions
  const isValid = () => {
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

  const submitData = async () => {
    console.log("Initiating upload");
    const supabaseManager = SupabaseManager.getInstance();

    if (isValid()) {
      if (image) {
        supabaseManager.createMeal(meal, image);
        console.log("Uploaded with image");
      } else {
        supabaseManager.createMeal(meal);
        console.log("Uploaded with NO image");
      }
    } else {
      console.log("Input not valid!!");
    }
  };

  //Render
  return (
    <div className="track-page page">
      <h1 className="page-title">Add a meal</h1>

      <div className="upload-container">
        {/* Upload file */}
        <FileLoader image={image} setImage={setImage} />

        <div className="upload-data">
          <div className="flex-row space-around">
            <MealTypeSelector meal={meal} setMeal={setMeal} />

            {/* Date selector */}
            <div className="upload-element">
              <TextInput
                meal={meal}
                setMeal={setMeal}
                type="date"
                label="Date"
                fieldName="date"
              />
            </div>

            {/* Time selector */}
            <div className="upload-element">
              <TextInput
                meal={meal}
                setMeal={setMeal}
                type="time"
                label="Time"
                fieldName="time"
              />
            </div>
          </div>

          {/* Title selector */}
          <div className="upload-element">
            <TextInput
              meal={meal}
              setMeal={setMeal}
              type="text"
              label="Meal Name"
              fieldName="title"
            />
          </div>

          {/* Calories selector */}
          <div className="upload-element">
            <TextInput
              meal={meal}
              setMeal={setMeal}
              type="number"
              label="Calories"
              fieldName="calories"
            />
          </div>

          <div className="flex-row space-around">
            <div className="upload-element">
              <TextInput
                meal={meal}
                setMeal={setMeal}
                type="number"
                label="Carbohydrates (g)"
                fieldName="carbos"
              />
            </div>

            <div className="upload-element">
              <TextInput
                meal={meal}
                setMeal={setMeal}
                type="number"
                label="Fats (g)"
                fieldName="fats"
              />
            </div>

            <div className="upload-element">
              <TextInput
                meal={meal}
                setMeal={setMeal}
                type="number"
                label="Proteins (g)"
                fieldName="protein"
              />
            </div>
          </div>
        </div>
      </div>
      <div>{errorString}</div>
      <button className="submit primary" onClick={submitData}>
        Analyze it!
      </button>
    </div>
  );
}

export default Track;
