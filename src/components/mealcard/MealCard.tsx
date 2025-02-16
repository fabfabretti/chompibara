import "./MealCard.css";
import MealData from "../../type/MealData";
import mockData from "../../mockdata/mockmeals";

//Const

function MealCard() {
  return (
    <div className="mealcard flexcol">
      <div className="firstrow flexrow">
        <div className="imgandinfo flexrow gap20">
          <img src="https://placehold.co/150x150" alt="food image" />
          <div className="flexcol">
            <p> 11/11/2024 - 23.30 - Snack - 450g</p>
            <h1 className="mealtitle">Piatto con sticazzi fritti e altro</h1>
            <p>Mele, pere, arance, banane, qualcosa, qualcos'altro</p>
          </div>
        </div>
        <img src="https://placehold.co/150x50" alt="food image" />
        <img src="https://placehold.co/150x150" alt="food image" />
      </div>
      <div className="secondrow flexrow gap20">
        <div className="flexrow gap20">
          <div>Tag</div>
          <div>Tag</div>
          <div>Tag</div>
        </div>
        <div className="gap20 flexrow">
          <p>Edit</p>
          <p> Show details </p>
        </div>
      </div>

      {/** Ingredient */}
      <div className="flexrow gap20 ">
        <div>Pasta 80g</div>
        <div>50%----</div>
        <div>50%----</div>
        <div>50%----</div>
      </div>
    </div>
  );
}

export default MealCard;
