import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Track.css";
import {
  faAppleWhole,
  faBowlFood,
  faCookie,
  faPizzaSlice,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import FileLoader from "../../components/FileLoader/FileLoader";
import MealData from "../../type/MealData";

const defaultMeal: MealData = {
  id: 1,
  photo: undefined,
  title: "",
  tags: [""],
  comment: "",
  mark: -1,
  mealtype: "Other",
  ingredients: [],
  date: "",
  time: "",
};

function Track() {
  //State
  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toTimeString().slice(0, 5);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState(now);
  const [image, setImage] = useState<File | null>(null);

  const [meal, setMeal] = useState(defaultMeal);

  //Effects
  useEffect(() => {}, [date, time]);

  // Functions

  const submitData = () => {};

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
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                }}
                id="time"
              ></input>
            </label>
            <button id="timeNowButton" className="secondary-button">
              Set to now
            </button>
          </div>
        </div>
      </div>
      <button className="submit primary">Analyze it!</button>
    </div>
  );
}

export default Track;
