import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { ExerciseData } from "../../../context/types/ExerciseTypes";

type BurntCaloriesBarChartProps = {
  exercises: ExerciseData[];
  startDate?: string;
  endDate?: string;
};

function BurntCaloriesBarChart({
  exercises,
  startDate,
  endDate,
}: BurntCaloriesBarChartProps) {
  let chartData = [];

  if (!startDate || !endDate) {
    chartData = exercises.map((ex) => ({
      date: ex.date,
      calories: ex.calories || 0,
    }));
  } else {
    const groupedData: Record<string, number> = {};

    for (
      let d = new Date(startDate);
      d <= new Date(endDate);
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      groupedData[dateStr] = 0;
    }

    exercises.forEach((ex) => {
      if (groupedData.hasOwnProperty(ex.date)) {
        groupedData[ex.date] += ex.calories || 0;
      }
    });

    chartData = Object.entries(groupedData).map(([date, calories]) => ({
      date,
      calories,
    }));
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="calories" fill="var(--primary-color)" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BurntCaloriesBarChart;
