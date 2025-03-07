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
  const percentage = Math.min((value / target) * 100, 100);
  const realPercentage = (value / target) * 100;
  const color =
    label === "Protein"
      ? COLORS.protein
      : label === "Fats"
      ? COLORS.fats
      : COLORS.carbos;

  const data = [
    { value: percentage, color: color },
    { value: 100 - percentage, color: "#efefef20" },
  ];

  return (
    <div
      style={{
        textAlign: "center",
        width: size,
        height: size,
        position: "relative",
        padding: "10px",
      }}
    >
      <PieChart width={size} height={size}>
        <Pie
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
        style={{
          position: "absolute",
          left: "30px",
          top: "35px",
        }}
      >
        {Math.round(realPercentage)}%
      </div>
      <div style={{ color: color }}>{label}</div>
      <div>
        {value}g /{target}g
      </div>
    </div>
  );
}

export default MacroProgressRing;
