import "./MealCard.css";
import MealData from "../../type/MealData";
import mockData from "../../mockdata/mockmeals";
import Chip from "../Chip/Chip";

//Const
const meal: MealData = mockData;

function MealCard() {
  return (
    <div className="mealcard flexcol">
      <div className="firstrow flexrow gap20">
        <div className=" flexrow gap20">
          <img className="mealphoto" src={meal.photo} alt="food image" />
          <div className="flexcol">
            <p>
              {" "}
              {meal.datetime} - {meal.mealtype}
            </p>
            <h1 className="mealtitle">{meal.title}</h1>
            <p className="mealingredients">
              {meal.ingredients.map((ingredient) => ingredient.name + ",  ")}
            </p>
          </div>
        </div>
        <img src="https://placehold.co/150x50" alt="food image" />
        <img src="https://placehold.co/150x150" alt="food image" />
      </div>
      <div className="secondrow flexrow gap20">
        <div className="flexrow gap20">
          {meal.tags.map((tag) => {
            return (
              <div>
                <Chip name={tag} />
              </div>
            );
          })}
        </div>
        <div className="gap20 flexrow">
          <p>Edit</p>
          <p> Show details </p>
        </div>
      </div>

      {/** Ingredient */}

      {meal.ingredients.map((ingredient) => {
        return (
          <div className="flexrow gap20">
            <div>{ingredient.name}</div>
            <div>{ingredient.carb}</div>
            <div>{ingredient.fat}</div>
            <div>{ingredient.protein}</div>
          </div>
        );
      })}
    </div>
  );
}

export default MealCard;
