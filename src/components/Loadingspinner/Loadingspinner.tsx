function Loadingspinner() {
  return (
    <div className="flex-col flex-center">
      <img
        style={{ width: "70px" }}
        src="src/assets/logo_animated.svg"
        alt="Loading..."
      />
      <div style={{ color: "var(--primary-color)" }}>Loading...</div>
    </div>
  );
}
export default Loadingspinner;
