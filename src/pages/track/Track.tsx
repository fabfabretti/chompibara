import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Track.css";
import { useState } from "react";
import FileLoader from "../../components/FileLoader/FileLoader";
import MealData from "../../type/MealData";
import supabase from "../../components/supabaseManager";
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

    console.log("File uploaded:", response.data, publicUrl);
    setImageUploaded(true);
    meal.photo = publicUrl;
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
    if (!imageUploaded) {
      errors.push("An image must be uploaded.");
    }

    setErrorString(errors.join("\n"));
    return errors.length === 0;
  };

  const submitMealData = async () => {
    console.log("submitting meal...");
    console.log(meal);
    const { data, error } = await supabase
      .from("MealDataDB") // Assicurati che il nome della tabella sia corretto
      .insert([
        {
          title: meal.title,
          photo: meal.photo, // L'URL dell'immagine è già presente in meal.photo
          mealtype: meal.mealtype,
          date: meal.date,
          time: meal.time,
          calories: meal.calories,
          fats: meal.fats,
          carbs: meal.carbos,
          protein: meal.protein,
        },
      ]);

    if (error) {
      console.error("Error inserting data:", error.message);
      alert("Error saving meal. Please try again." + error.message);
    } else {
      console.log("Meal saved successfully:", data);
    }
  };

  const submitData = async () => {
    console.log("sumbitting data");
    if (image) {
      await uploadFile(image);
      console.log("uploaded?");
    }
    if (isValid()) {
      submitMealData();
    }
    return;
  };

  //Render
  return (
    <div className="track-page page">
      <h1 className="page-title">Add a meal</h1>

      <div className="upload-container">
        {/* Upload file */}
        <FileLoader image={image} setImage={setImage} />

        {/*Meal Selector*/}
        <div className="upload-data">
          <label className="upload-element">
            <label className="meal-option">
              <input type="radio" name="mealtype" value="0" />
              <FontAwesomeIcon icon={faQuestion} />
              Other
            </label>
            <label className="meal-option">
              <input type="radio" name="mealtype" value="1" />
              <FontAwesomeIcon icon={faCookie} />
              Breakfast
            </label>
            <label className="meal-option">
              <input type="radio" name="mealtype" value="2" />
              <FontAwesomeIcon icon={faBowlFood} />
              Lunch
            </label>
            <label className="meal-option">
              <input type="radio" name="mealtype" value="3" />
              <FontAwesomeIcon icon={faAppleWhole} />
              Snack
            </label>
            <label className="meal-option">
              <input type="radio" name="mealtype" value="4" />
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
