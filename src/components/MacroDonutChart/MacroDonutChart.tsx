import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import COLORS from "../../context/macroColors";
import MealData from "../../type/MealData";

type MacroDonutChartProps = {
  meals: MealData[];
  height?: number;
  legendPosition?: "side" | "bottom";
  targetCalories?: number;
  average?: boolean;
};

function MacroDonutChart({
  meals,
  height = 200,
  legendPosition = "side",
  targetCalories: targetcalories,
  average = false,
}: MacroDonutChartProps) {
  // Compute macros
  const totalCarbs = meals.reduce((sum, meal) => sum + (meal.carbos || 0), 0);
  const totalFats = meals.reduce((sum, meal) => sum + (meal.fats || 0), 0);
  const totalProtein = meals.reduce(
    (sum, meal) => sum + (meal.protein || 0),
    0
  );
  let totalCalories = meals.reduce(
    (sum, meal) => sum + (meal.calories || 0),
    0
  );

  const numberOfDays = [...new Set(meals.map((meal) => meal.date))].length;

  const avgCalories =
    meals.length > 0
      ? meals.reduce((sum, meal) => sum + (meal.calories || 0), 0) /
        numberOfDays
      : 0;

  // If macros are present but not calories, compute calories
  if (
    (totalCarbs !== 0 || totalFats !== 0 || totalProtein !== 0) &&
    totalCalories === 0
  )
    totalCalories = totalCarbs * 4 + totalFats * 9 + totalProtein * 4;

  // Check if calories are present
  const isEmptyMacros =
    totalCarbs === 0 && totalFats === 0 && totalProtein === 0;
  const isMissingCalories = totalCalories === 0;

  // Define calorie background ring
  const calorieData = [
    {
      name: "Consumed",
      value: totalCalories,
      color: targetcalories ? "#ffffff" : "#00000000",
    },
    {
      name: "Remaining",
      value: Math.max((targetcalories ?? 0) - totalCalories, 0),
      color: "#efefef20",
    },
  ];

  // Define macro segments based on calorie consumption
  const data = isEmptyMacros
    ? [{ name: "No Data", value: 1, color: COLORS.greyedOut }]
    : [
        {
          name: "Carbs",
          value: Math.min(totalCarbs * 4, totalCalories),
          color: COLORS.carbos,
        },
        {
          name: "Protein",
          value: Math.min(totalProtein * 4, totalCalories),
          color: COLORS.protein,
        },
        {
          name: "Fats",
          value: Math.min(totalFats * 9, totalCalories),
          color: COLORS.fats,
        },
      ];

  const chartSize = height * 0.9;
  const fontSize = height * 0.12;

  return (
    <div
      className="macrodonutchart-component"
      style={{
        display: "flex",
        flexDirection: legendPosition === "bottom" ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "12px",
      }}
    >
      {/* Donut Chart */}
      <div
        className="donutchart-container"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ResponsiveContainer width={chartSize} height={chartSize}>
          <PieChart>
            {/* Background calorie ring */}
            <Pie
              data={calorieData}
              cx="50%"
              cy="50%"
              innerRadius="75%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
              cornerRadius={100}
              paddingAngle={2}
            >
              {calorieData.map((entry, index) => (
                <Cell key={`bg-cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {/* Foreground macro ring */}
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="74%"
              outerRadius="101%"
              startAngle={90}
              endAngle={
                90 -
                Math.min(
                  (totalCalories / (targetcalories || totalCalories)) * 360,
                  360
                )
              }
              dataKey="value"
              stroke="none"
              cornerRadius={100}
              paddingAngle={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Calories Text */}
        <div
          className="caloriesText-container"
          style={{
            position: "absolute",
            fontSize: isMissingCalories
              ? `${fontSize * 0.9}px`
              : `${fontSize}px`,
            fontWeight: "bold",
            transform: "translate(-50%, -50%)",
            top: "50%",
            left: "50%",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {isMissingCalories ? (
            "Missing calories"
          ) : average ? (
            <div>
              {Math.round(avgCalories)} kcal
              <br />
              <div style={{ fontSize: "12px" }}>daily average</div>
            </div>
          ) : (
            <div className="kcalAndPercentage-container">
              {totalCalories} kcal
              <br />
              {targetcalories
                ? `${Math.round((totalCalories / targetcalories) * 100)}%`
                : ""}
            </div>
          )}
        </div>
      </div>
      {/* Legend - Hidden when macros are empty */}
      {!isEmptyMacros && (
        <div
          className="legend-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          {data.map(({ name, value, color }) =>
            name == "Target" ? (
              ""
            ) : (
              <div
                className="legendMacro-container"
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: `${fontSize * 0.7}px`,
                  fontWeight: "bold",
                }}
              >
                <span
                  className="legendmacrolabel-container"
                  style={{
                    width: `${fontSize * 0.5}px`,
                    height: `${fontSize * 0.5}px`,
                    backgroundColor: color,
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "6px",
                  }}
                />
                {average
                  ? Math.round(value / numberOfDays) +
                    " kcal in " +
                    name.toLocaleLowerCase() +
                    " (average)"
                  : Math.round(value) + " kcal in " + name.toLowerCase()}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default MacroDonutChart;
