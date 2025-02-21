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

function Track() {
  //State
  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toTimeString().slice(0, 5);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState(now);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //Functions
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
    }
  };

  //Effects
  useEffect(() => {
    console.log("Date updated:", date);
    console.log("Time updated:", time);
  }, [date, time]);

  //Functions

  //Render
  return (
    <div className="track-page">
      <h1 className="page-title">Add a meal</h1>

      {/* Upload file */}
      <div className="upload-container">
        <div className="upload-file" onClick={handleUploadClick}>
          <div className="filedropper-text1">
            Drop your picture to import your meal
          </div>
          <div className="filedropper-text2">or click to browse</div>
          <input type="file" ref={fileInputRef} />
        </div>

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
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
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
