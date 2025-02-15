import "./Homepage.css";

function App() {
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
            <button> About Chompi</button>
            <button> Add a meal</button>
          </div>
        </div>
        <div className="animation-container">
          <img src="https://placehold.co/600x600"></img>
        </div>
      </div>
      <p>(c) fabsfabsfabs 2024</p>
    </div>
  );
}

export default App;
