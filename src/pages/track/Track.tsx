import "./Track.css";

import { useState } from "react";

import { SupabaseManager } from "../../components/supabaseManager";

import FileLoader from "../../components/FileLoader/FileLoader";
import MealData from "../../type/MealData";
import MealTypeSelector from "../../components/inputs/MealTypeSelector/MealTypeSelector";

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
    if (meal.calories !== null && meal.calories <= 0) {
      errors.push("Calories must be greater than 0.");
    }
    if (meal.fats !== null && meal.fats < 0) {
      errors.push("Fats cannot be negative.");
    }
    if (meal.carbos !== null && meal.carbos < 0) {
      errors.push("Carbohydrates cannot be negative.");
    }
    if (meal.protein !== null && meal.protein < 0) {
      errors.push("Protein cannot be negative.");
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
              <label>
                Date
                <input
                  type="date"
                  value={meal.date}
                  onChange={(e) => {
                    setMeal((prev) => ({ ...prev, date: e.target.value }));
                  }}
                  id="date"
                ></input>
              </label>
            </div>

            {/* Time selector */}
            <div className="upload-element">
              <label>
                Timek
                <input
                  type="time"
                  value={meal.time}
                  onChange={(e) => {
                    setMeal((prev) => ({ ...prev, time: e.target.value }));
                  }}
                  id="time"
                ></input>
              </label>
            </div>
          </div>

          {/* Title selector */}
          <div className="upload-element">
            <label>
              Meal name
              <input
                type="text"
                value={meal.title}
                onChange={(e) => {
                  setMeal((prev) => ({ ...prev, title: e.target.value }));
                }}
                id="title"
              ></input>
            </label>
          </div>

          {/* Calories selector */}
          <div className="upload-element">
            <label>
              Calories
              <input
                type="number"
                value={meal.calories !== null ? meal.calories.toString() : ""}
                onChange={(e) => {
                  setMeal((prev) => ({
                    ...prev,
                    calories: parseInt(e.target.value),
                  }));
                }}
                id="title"
              ></input>
            </label>
          </div>

          <div className="flex-row space-around">
            <div className="upload-element">
              <label>
                Carbohydrates (g)
                <input
                  type="number"
                  value={meal.carbos !== null ? meal.carbos.toString() : ""}
                  onChange={(e) => {
                    setMeal((prev) => ({
                      ...prev,
                      carbos: parseInt(e.target.value),
                    }));
                  }}
                  id="title"
                ></input>
              </label>
            </div>

            <div className="upload-element">
              <label>
                Fats (g)
                <input
                  type="number"
                  value={meal.fats !== null ? meal.fats.toString() : ""}
                  onChange={(e) => {
                    setMeal((prev) => ({
                      ...prev,
                      fats: parseInt(e.target.value),
                    }));
                  }}
                  id="title"
                ></input>
              </label>
            </div>

            <div className="upload-element">
              <label>
                Protein (g)
                <input
                  type="number"
                  value={meal.protein !== null ? meal.protein.toString() : ""}
                  onChange={(e) => {
                    setMeal((prev) => ({
                      ...prev,
                      protein: parseInt(e.target.value),
                    }));
                  }}
                  id="title"
                ></input>
              </label>
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
