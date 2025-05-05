import "./Track.css";

import { useState } from "react";

import { SupabaseManager } from "../../context/SupabaseManager";

import FileLoader from "../../components/FileLoader/FileLoader";
import { defaultMeal, MealData } from "../../context/types/MealTypes";
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
  const [isMagicFilling, setIsMagicFilling] = useState(false);
  const [magicFillError, setMagicFillError] = useState("");

  // Functions

  // Check input
  const mealIsValid = () => {
    const errors = [];

    if (meal.title.trim() === "") {
      errors.push("Title cannot be empty.");
    }
    if (meal.calories) {
      if (meal.calories <= 0) {
        errors.push("Calories must be greater than 0.");
      }
      if (meal.calories > 32767) {
        errors.push("Calories value is too large.");
      }
    }
    if (meal.fats) {
      if (meal.fats < 0) {
        errors.push("Fats cannot be negative.");
      }
      if (meal.fats > 32767) {
        errors.push("Fats value is too large.");
      }
    }
    if (meal.carbos) {
      if (meal.carbos < 0) {
        errors.push("Carbohydrates cannot be negative.");
      }
      if (meal.carbos > 32767) {
        errors.push("Carbohydrates value is too large.");
      }
    }
    if (meal.protein) {
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
      let uploadedMeal: MealData | null = null;

      const supabaseManager = SupabaseManager.getInstance();
      if (image) {
        uploadedMeal = await supabaseManager.createMeal(meal, image);
        console.log("Uploaded with image");
      } else {
        uploadedMeal = await supabaseManager.createMeal(meal);
        console.log("Uploaded with NO image");
      }
      setIsUploading(false);
      setHasBeenUploaded(true);

      if (uploadedMeal != null) {
        setMeal(uploadedMeal);
      }
    } else {
      console.log("Input not valid!!");
    }
  };

  //Magic fill
  const magicFill = async (file: File) => {
    setIsMagicFilling(true);
    const reader = new FileReader();
    const base64 = await new Promise<string>((resolve, reject) => {
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

    const body = {
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
  You will be provided with an image of a meal and the time it was consumed. Your task is to respond with a JSON object containing the following fields:
  - title: Name of the dish (string)
  - mealtype: One of the following categories: Breakfast, Dinner, Lunch, Other, Snack (string). Consider the provided time of day when choosing.
  - calories: Estimated number of calories in the meal (integer)
  - carbos: Estimated grams of carbohydrates (integer)
  - fats: Estimated grams of fats (integer)
  - protein: Estimated grams of protein (integer)
  
  If the image does not contain food, return a JSON object like:
  {error: "This image does not contain food."}
  
  The meal was consumed at ${meal.time}.
            `.trim(),
            },
            {
              type: "image_url",
              image_url: {
                url: base64,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      alert(`API Error: ${response.status}\n${errorBody}`);
      setMagicFillError(
        "Something went wrong :( You can still enter your meal manually!"
      );
      setIsMagicFilling(false);
      return;
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const cleaned = content.replace(/```json|```/g, "").trim();
    let parsed: Partial<MealData> = {};

    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      alert("Error parsing response. Please enter your meal manually.");
      console.error("Parsing error:", e, cleaned);
      setMagicFillError("Error parsing response");
      setIsMagicFilling(false);
      return;
    }

    const validMealTypes = ["Breakfast", "Dinner", "Lunch", "Other", "Snack"];
    if (
      typeof parsed.title !== "string" ||
      !validMealTypes.includes(parsed.mealtype as string) ||
      typeof parsed.calories !== "number" ||
      typeof parsed.carbos !== "number" ||
      typeof parsed.fats !== "number" ||
      typeof parsed.protein !== "number"
    ) {
      alert("Invalid response format. Please enter your meal manually.");
      setMagicFillError("Invalid response format");
      setIsMagicFilling(false);
      return;
    }

    setMeal((prev) => ({ ...prev, ...parsed }));
    setIsMagicFilling(false);
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

              {image ? (
                isMagicFilling ? (
                  <Loadingspinner />
                ) : (
                  <div className="flex-col">
                    <button
                      className="primary"
                      title="Hello"
                      onClick={() => magicFill(image)}
                    >
                      Ask Chompibara to fill it for you!
                    </button>
                    {magicFillError}
                  </div>
                )
              ) : (
                ""
              )}

              <div className="upload-data">
                <div
                  className="flex-row space-around"
                  style={{ flexWrap: "wrap" }}
                >
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
                  className="calories-element flex-row flex-center space-between"
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

      <div style={{ color: "var(--primary-color)" }}>{errorString}</div>
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
