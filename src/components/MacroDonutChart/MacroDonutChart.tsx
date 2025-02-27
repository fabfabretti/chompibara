import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import MealData from "../../type/MealData";

type MacroDonutchartProps = {
  meal: MealData;
};

type macroData = { name: string; value: number };

const defaultData = [
  { name: "Proteine", value: 0 },
  { name: "Grassi", value: 0 },
  { name: "Carbo", value: 0 },
];

const COLORS = ["#0088FE", "#FFBB28", "#FF8042"];

export default function DonutChart(props: MacroDonutchartProps) {
  const [macroData, setMacroData] = useState(defaultData);

  //Memo
  useMemo(() => {
    setMacroData([
      { name: "Protein", value: props.meal.protein ?? 0 },
      { name: "Fats", value: props.meal.fats ?? 0 },
      { name: "Carbohydrates", value: props.meal.carbos ?? 0 },
    ]);
  }, []);

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
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius="70%"
            outerRadius="100%"
            paddingAngle={3}
            dataKey="value"
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
