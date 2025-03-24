import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type ExerciseData = {
  id: number;
  name: string;
  date: string;
  time: string;
  duration?: string;
  calories?: number;
  type: string;
};

type Props = {
  exercises: ExerciseData[];
  startDate: string;
  endDate: string;
};

const BurntCaloriesBarChart: React.FC<Props> = ({
  exercises,
  startDate,
  endDate,
}) => {
  const chartData = [];

  for (
    let d = new Date(startDate);
    d <= new Date(endDate);
    d.setDate(d.getDate() + 1)
  ) {
    const dateStr = d.toISOString().split("T")[0];
    const totalCalories = exercises
      .filter((ex) => ex.date === dateStr)
      .reduce((sum, ex) => sum + (ex.calories || 0), 0);

    chartData.push({ date: dateStr, calories: totalCalories });
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
};

export default BurntCaloriesBarChart;
