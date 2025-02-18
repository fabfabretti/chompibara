import "./MealCard.css";
import MealData from "../../type/MealData";
import mockData from "../../mockdata/mockmeals";
import Chip from "../Chip/Chip";
//Prop
type MealCardProp = {
  meal: MealData;
};

function MealCard(props: MealCardProp) {
  //Const
  const meal: MealData = props.meal;

  //Render
  return (
    <div className="mealcard flexcol">
      <div className="firstrow flexrow gap20">
        <div className="flexrow gap20">
          <img className="mealphoto" src={meal.photo} alt="food image" />
          <div className="mealinfo">
            <div>
              {" "}
              {meal.datetime} - {meal.mealtype}
            </div>
            <div>
              <h1 className="mealtitle">{meal.title}</h1>
            </div>
            <div className="mealingredients">
              {meal.ingredients.map((ingredient) => (
                <span key={meal.id + ingredient.name}>{ingredient.name} </span>
              ))}
            </div>
          </div>
        </div>
        {/*
        <img src="https://placehold.co/150x50" alt="food image" />
        <img src="https://placehold.co/150x150" alt="food image" />
      */}
      </div>
      {props.meal.tags.length != 0 ? (
        <div className=" tagcontainer">
          {meal.tags.map((tag) => {
            return <Chip name={tag} key={meal.id + tag} />;
          })}
        </div>
      ) : (
        ""
      )}
      <div className="action-container">
        <button>Edit</button>
        <button>Show details</button>
      </div>
      {/** Ingredient 

      {meal.ingredients.map((ingredient) => {
        return (
          <div className="flexrow gap20">
            <div>{ingredient.name}</div>
            <div>{ingredient.carb}</div>
            <div>{ingredient.fat}</div>
            <div>{ingredient.protein}</div>
          </div>
        );
      })}*/}
    </div>
  );
}

export default MealCard;
