import { PieChart, Pie, Cell } from "recharts";
import COLORS from "../../context/macroColors";

type MacroProgressRingProps = {
  label: string;
  value: number;
  target: number;
  size?: number;
};

function MacroProgressRing({
  label,
  value,
  target,
  size = 70,
}: MacroProgressRingProps) {
  // State
  const displayedPercentage = Math.min((value / target) * 100, 100);
  const realPercentage = (value / target) * 100;
  4;

  //Style
  const color =
    label === "Protein"
      ? COLORS.protein
      : label === "Fats"
      ? COLORS.fats
      : COLORS.carbos;
  const fontSize = size * 0.25;

  //Data
  const data = [
    { value: displayedPercentage, color: color },
    { value: 100 - displayedPercentage, color: "#efefef20" },
  ];

  //Render
  return (
    <div
      className="macroprogressring-component"
      style={{
        textAlign: "center",
        minWidth: size,
        minHeight: size,
        position: "relative",
        padding: "0px 20px 0 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PieChart width={size} height={size} className="chart-container">
        <Pie
          className="chart"
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="75%"
          outerRadius="100%"
          startAngle={240}
          endAngle={-60}
          dataKey="value"
          stroke="none"
          cornerRadius={size * 0.1}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
      <div
        className="percentagesInRing-container"
        style={{
          position: "absolute",
          left: "32px",
          top: "23px",
          fontSize: fontSize,
          whiteSpace: "nowrap",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: fontSize * 3,
        }}
      >
        {Math.round(realPercentage)}%
      </div>
      <div
        className="macroslabel-container"
        style={{
          color: color,
          fontSize: fontSize,
          whiteSpace: "nowrap",
          marginTop: "-10px",
        }}
      >
        {label}
      </div>
      <div
        className="macrograms-container"
        style={{ fontSize: fontSize - 4, whiteSpace: "nowrap" }}
      >
        {value}g / {target}g
      </div>
    </div>
  );
}

export default MacroProgressRing;
