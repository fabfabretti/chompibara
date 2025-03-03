import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { COLORS } from "../../context/macroColors";

type MealData = {
  id: number;
  photo?: string;
  title: string;
  date: string;
  time: string;
  mealtype: string;
  calories: number | null;
  carbos: number | null;
  fats: number | null;
  protein: number | null;
};

type MacroDonutChartProps = {
  meals: MealData[];
  height?: number;
  legendPosition?: "side" | "bottom";
};

const MacroDonutChart: React.FC<MacroDonutChartProps> = ({
  meals,
  height = 200,
  legendPosition = "side",
}) => {
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

  if (
    (totalCarbs != 0 || totalFats != 0 || totalProtein != 0) &&
    totalCalories === 0
  )
    totalCalories = totalCarbs * 4 + totalFats * 9 + totalProtein * 4;
  console.log(totalCarbs, totalCalories);
  const isEmptyMacros =
    totalCarbs === 0 && totalFats === 0 && totalProtein === 0;
  const isMissingCalories = totalCalories === 0;

  const data = isEmptyMacros
    ? [{ name: "No Data", value: 1, color: COLORS.greyedOut }]
    : [
        { name: "Carbs", value: totalCarbs, color: COLORS.carbos },
        { name: "Fats", value: totalFats, color: COLORS.fats },
        { name: "Protein", value: totalProtein, color: COLORS.protein },
      ];

  const chartSize = height * 0.9;
  const fontSize = height * 0.12;

  return (
    <div
      className="macrodonutchart"
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
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ResponsiveContainer width={chartSize} height={chartSize}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="80%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
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
          {isMissingCalories ? "Missing calories" : `${totalCalories} kcal`}
        </div>
      </div>

      {/* Legend - Hidden when macros are empty */}
      {!isEmptyMacros && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          {data.map(({ name, value, color }) => (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: `${fontSize * 0.7}px`,
                fontWeight: "bold",
              }}
            >
              <span
                style={{
                  width: `${fontSize * 0.5}px`,
                  height: `${fontSize * 0.5}px`,
                  backgroundColor: color,
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "6px",
                }}
              />
              {value}g {name.toLowerCase()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MacroDonutChart;
