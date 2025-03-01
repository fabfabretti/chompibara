import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import MealData from "../../type/MealData";

type MacroDonutchartProps = {
  meal?: MealData;
  meals?: Array<MealData>;
};

export type MacroData = Array<{ name: string; value: number }>;

const defaultData = [
  { name: "Protein", value: 0 },
  { name: "Fats", value: 0 },
  { name: "Carbos", value: 0 },
];

const COLORS = ["#0088FE", "#FFBB28", "#FF8042"];

export default function DonutChart(props: MacroDonutchartProps) {
  const [macroData, setMacroData] = useState(defaultData);

  //Memo
  useEffect(() => {
    if (props.meal) {
      setMacroData([
        { name: "Protein", value: props.meal.protein ?? 0 },
        { name: "Fats", value: props.meal.fats ?? 0 },
        { name: "Carbohydrates", value: props.meal.carbos ?? 0 },
      ]);
    }
    if (props.meals) {
      console.log(props.meals);
      let totalCalories = 0;
      let totalCarbos = 0;
      let totalFats = 0;
      let totalProtein = 0;
      props.meals.forEach((meal) => {
        totalCalories += meal.calories ?? 0;
        totalCarbos += meal.carbos ?? 0;
        totalFats += meal.fats ?? 0;
        totalProtein += meal.protein ?? 0;
      });
      console.log(totalProtein);

      setMacroData([
        { name: "Protein", value: totalProtein },
        { name: "Fats", value: totalFats },
        { name: "Carbohydrates", value: totalCarbos },
      ]);
    }
  }, [props.meal, props.meals]);

  return (
    <div
      className="macrodonutchart-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        minWidth: "100px",
        height: "auto",
      }}
    >
      {/* Legend */}
      <div
        className="macrodonutchart-legend"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          fontSize: "12px",
        }}
      >
        {macroData.map((entry, index) => (
          <div
            key={"macrodonutchart" + "ID" + entry.name}
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: COLORS[index],
                borderRadius: "50%",
              }}
            />
            <span>
              {entry.name}: {entry.value}g
            </span>
          </div>
        ))}
      </div>
      {/* PieChart con dimensioni minime */}
      <ResponsiveContainer
        width="25%"
        height={100}
        style={{
          position: "absolute",
          top: "30px",
        }}
      >
        <PieChart>
          <Pie
            data={macroData}
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
            {macroData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
