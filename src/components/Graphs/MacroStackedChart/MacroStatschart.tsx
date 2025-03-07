import React, { useRef, useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Label,
} from "recharts";
import MealData from "../../../type/MealData";
import COLORS from "../../../context/macroColors";

interface MealChartProps {
  meals: MealData[];
  target?: number;
  cumulative?: boolean;
}

function MacroStackedChart({
  meals,
  target,
  cumulative = false,
}: MealChartProps) {
  if (!meals || meals.length === 0) {
    return <p>No meal data available.</p>;
  }

  const mealDataPoints = meals.map(createMealDataPoint).sort(sortByDateTime);

  const augmentedDataPoints = augmentDataPoints(mealDataPoints, cumulative);
  const dataPoints = cumulative
    ? calculateCumulativeCalories(augmentedDataPoints)
    : augmentedDataPoints;

  const isSingleDay = isSameDay(meals);
  const xAxisFormatter = createXAxisFormatter(isSingleDay);

  const maxYValue = Math.max(
    ...dataPoints.flatMap((point) => [
      point.carbs,
      point.fats,
      point.protein,
      target || 0,
    ])
  );

  const referenceLineStyle = {
    stroke: "currentColor",
    strokeWidth: 2,
  };

  const gridLineStyle = {
    stroke: "currentColor",
    strokeOpacity: 0.2,
  };

  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const updateChartWidth = () => {
      if (chartRef.current) {
        setChartWidth(chartRef.current.offsetWidth);
      }
    };

    updateChartWidth();
    window.addEventListener("resize", updateChartWidth);

    return () => {
      window.removeEventListener("resize", updateChartWidth);
    };
  }, []);

  return (
    <div ref={chartRef} style={{ width: "100%" }}>
      <AreaChart width={chartWidth} height={300} data={dataPoints}>
        <CartesianGrid {...gridLineStyle} />
        <XAxis dataKey="dateTime" tickFormatter={xAxisFormatter} />
        <YAxis domain={[0, maxYValue * 1.1]} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="carbs"
          stackId="1"
          stroke={COLORS.carbos}
          fillOpacity={0.6}
          fill={COLORS.carbos}
        />
        <Area
          type="monotone"
          dataKey="fats"
          stackId="1"
          stroke={COLORS.fats}
          fillOpacity={0.6}
          fill={COLORS.fats}
        />
        <Area
          type="monotone"
          dataKey="protein"
          stackId="1"
          stroke={COLORS.protein}
          fillOpacity={0.6}
          fill={COLORS.protein}
        />
        {target !== undefined && (
          <ReferenceLine y={target} style={referenceLineStyle}>
            <Label value="Target" position="insideTop" offset={10} />
          </ReferenceLine>
        )}
      </AreaChart>
    </div>
  );
}

function createMealDataPoint(meal: MealData) {
  const combinedDateTime = new Date(`${meal.date}T${meal.time}`).toISOString();
  return {
    dateTime: combinedDateTime,
    carbs: (meal.carbos || 0) * 4,
    fats: (meal.fats || 0) * 9,
    protein: (meal.protein || 0) * 4,
  };
}

function sortByDateTime(a: { dateTime: string }, b: { dateTime: string }) {
  return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
}

function isSameDay(meals: MealData[]) {
  const firstDate = new Date(meals[0].date);
  const lastDate = new Date(meals[meals.length - 1].date);
  return firstDate.toDateString() === lastDate.toDateString();
}

function createXAxisFormatter(isSingleDay: boolean) {
  return (dateTime: string) => {
    const date = new Date(dateTime);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    if (isSingleDay) {
      const hours = date.getHours().toString().padStart(2, "0");
      return `${hours}:00`;
    } else {
      return date.toLocaleDateString();
    }
  };
}

function calculateCumulativeCalories(
  dataPoints: {
    dateTime: string;
    carbs: number;
    fats: number;
    protein: number;
  }[]
) {
  let cumulativeCarbs = 0;
  let cumulativeFats = 0;
  let cumulativeProtein = 0;

  return dataPoints.map((point) => {
    cumulativeCarbs += point.carbs;
    cumulativeFats += point.fats;
    cumulativeProtein += point.protein;

    return {
      dateTime: point.dateTime,
      carbs: cumulativeCarbs,
      fats: cumulativeFats,
      protein: cumulativeProtein,
    };
  });
}

function augmentDataPoints(
  dataPoints: {
    dateTime: string;
    carbs: number;
    fats: number;
    protein: number;
  }[],
  cumulative: boolean
) {
  if (dataPoints.length === 0) return [];

  const firstDateTime = new Date(dataPoints[0].dateTime);
  const lastDateTime = new Date(dataPoints[dataPoints.length - 1].dateTime);

  const startOfDay = new Date(firstDateTime);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(lastDateTime);
  endOfDay.setHours(23, 59, 59, 999);

  const augmentedData = [
    { dateTime: startOfDay.toISOString(), carbs: 0, fats: 0, protein: 0 },
    ...dataPoints,
    { dateTime: endOfDay.toISOString(), carbs: 0, fats: 0, protein: 0 },
  ];

  return augmentedData;
}

export default MacroStackedChart;
