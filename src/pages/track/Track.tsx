import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Track.css";
import { useState } from "react";
import FileLoader from "../../components/FileLoader/FileLoader";
import MealData from "../../type/MealData";
import supabase, { SupabaseManager } from "../../components/supabaseManager";
import {
  faAppleWhole,
  faBowlFood,
  faCookie,
  faPizzaSlice,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";

// Types

// Render
function Track() {
  //State
  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toTimeString().slice(0, 5);
  const [image, setImage] = useState<File | null>(null);
  const [imageUploaded, setImageUploaded] = useState(false);
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

  const uploadFile = async (file: File) => {
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `uploads/${timestamp}.${fileExtension}`;

    const response = await supabase.storage
      .from("meal-images")
      .upload(`uploads/${fileName}`, file);

    if (response.error) {
      alert(
        "Error during upload: please refresh page" + response.error.message
      );
      return;
    }

    const publicUrl = supabase.storage
      .from("meal-images")
      .getPublicUrl(response.data.path).data.publicUrl;

    console.log("File uploaded:", publicUrl);
    setMeal((prev) => ({ ...prev, photo: publicUrl }));
    setImageUploaded(true);
  };

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
        console.log("Image loaded");
        supabaseManager.createMeal(meal, image);
      } else {
        console.log("No image loaded");
        supabaseManager.createMeal(meal);
      }
    } else {
      console.log("Uploaded");
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
          <label className="upload-element">
            <label className="meal-option">
              {/*Meal Selector*/}
              <input type="radio" name="mealtype" value="0" />
              <FontAwesomeIcon icon={faQuestion} />
              Other
            </label>
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
          </label>

          <div className="flex-row space-around">
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
              <button id="dateNowButton" className="secondary-button">
                Set to today
              </button>
            </div>

            {/* Time selector */}
            <div className="upload-element">
              <label>
                Time
                <input
                  type="time"
                  value={meal.time}
                  onChange={(e) => {
                    setMeal((prev) => ({ ...prev, time: e.target.value }));
                  }}
                  id="time"
                ></input>
              </label>
              <button id="timeNowButton" className="secondary-button">
                Set to now
              </button>
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
