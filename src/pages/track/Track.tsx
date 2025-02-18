import MealCard from "../../components/mealcard/MealCard";
import mockData from "../../mockdata/mockmeals";

function Track() {
  return (
    <div>
      <h1>Add a meal</h1>

      <div className="upload-container">
        <div className="file-dropper">
          <h2>Drag your picture to import your meal</h2>
          <p>or click to browse</p>
        </div>

        <div className="input-data">
          <label>
            Meal type
            <select id="mealtype">
              <option value="1">Colazione</option>
              <option value="2">Merenda</option>
              <option value="3">Spuntino</option>
              <option value="4">Cena</option>
            </select>
          </label>

          <label>
            Date
            <input type="date" id="date"></input>
          </label>
          <label>
            Time
            <input type="time" id="time"></input>
          </label>
        </div>
        <button className="primary">Analyze it!</button>
      </div>
    </div>
  );
}

export default Track;
