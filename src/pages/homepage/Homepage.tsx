import "./Homepage.css";
import { useNavigate } from "react-router";

function Homepage() {
  // Constants
  const navigate = useNavigate();

  // Render
  return (
    <div className="homepage">
      <div className="content-container">
        <div className="text-container">
          <h2 className="overtitle">Say hi to...</h2>
          <h1 className="title">Chompibara</h1>

          <p className="paragraph">
            Whether you want to track your food to change your physique, connect
            symptoms or just to be more mindful with what you eat, Chompi has
            you covered.
          </p>

          <div className="button-container">
            <button className="primary" onClick={() => navigate("/track")}>
              {" "}
              Add a meal
            </button>
          </div>
        </div>
        <div className="animation-container">
          <img className="plate-img" src="src/assets/plate.png"></img>
          <img className="orange1-img" src="src/assets/orange1.png"></img>
          <img className="orange2-img" src="src/assets/orange2.png"></img>
        </div>
      </div>
      <footer>
        <p>(c) fabsfabsfabs 2024</p>
      </footer>
    </div>
  );
}

export default Homepage;
