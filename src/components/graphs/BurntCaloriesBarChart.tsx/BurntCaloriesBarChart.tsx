import React from "react";
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
  let chartData: any[] = [];
  let xAxisKey = "date";

  // Check if all exercises are on the same day.
  const sameDay =
    exercises.length > 0 &&
    exercises.every((ex) => ex.date === exercises[0].date);

  if (sameDay) {
    xAxisKey = "time";
    chartData = exercises.map((ex) => ({
      time: ex.time,
      calories: ex.calories || 0,
      name: ex.name,
    }));
  } else if (!startDate || !endDate) {
    chartData = exercises.map((ex) => ({
      date: ex.date,
      calories: ex.calories || 0,
      name: ex.name,
    }));
  } else {
    // Group exercises by day between startDate and endDate.
    const groupedData: Record<string, { calories: number; names: string[] }> =
      {};

    // Initialize each day in the range.
    for (
      let d = new Date(startDate);
      d <= new Date(endDate);
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      groupedData[dateStr] = { calories: 0, names: [] };
    }

    // Sum calories and accumulate exercise names.
    exercises.forEach((ex) => {
      if (groupedData.hasOwnProperty(ex.date)) {
        groupedData[ex.date].calories += ex.calories || 0;
        if (ex.name) groupedData[ex.date].names.push(ex.name);
      }
    });

    chartData = Object.entries(groupedData).map(
      ([date, { calories, names }]) => ({
        date,
        calories,
        name: names.join(", "),
      })
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip
          formatter={(value: number, name: string, props: any) => {
            return [`Calories: ${value}, exercise: ${props.payload.name}`, ""];
          }}
        />
        <Bar dataKey="calories" fill="var(--primary-color)" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BurntCaloriesBarChart;
