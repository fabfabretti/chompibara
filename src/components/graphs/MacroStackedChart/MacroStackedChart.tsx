import { useRef, useEffect, useState } from "react";
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

import { MealData } from "../../../context/types/MealTypes";
import COLORS from "../../../context/macroColors";

type MealChartProps = {
  meals: MealData[];
  target?: number;
  cumulative?: boolean;
  startDay?: string;
  endDay?: string;
};

type dataPoint = {
  dateTime: string;
  carbs: number;
  fats: number;
  protein: number;
  unassigned: number;
};

function MacroStackedChart({
  meals,
  target,
  cumulative = false,
  startDay,
  endDay,
}: MealChartProps) {
  if (!meals || meals.length === 0) {
    return (
      <p style={{ color: "var(--greyed-out)", textAlign: "center" }}>
        No meals recorded on this day.
      </p>
    );
  }

  const isSingleDay =
    startDay && endDay ? startDay === endDay : isSameDay(meals);

  let mealDataPoints = meals.map(createMealDataPoint).sort(sortByDateTime);

  if (!isSingleDay) {
    if (startDay && endDay) {
      const groupedPoints: { [key: string]: dataPoint } = {};
      mealDataPoints.forEach((point) => {
        const date = point.dateTime.split("T")[0];
        if (!groupedPoints[date]) {
          groupedPoints[date] = {
            dateTime: date,
            carbs: 0,
            fats: 0,
            protein: 0,
            unassigned: 0,
          };
        }
        groupedPoints[date].carbs += point.carbs;
        groupedPoints[date].fats += point.fats;
        groupedPoints[date].protein += point.protein;
        groupedPoints[date].unassigned += point.unassigned;
      });

      const startDateObj = new Date(startDay);
      const endDateObj = new Date(endDay);
      for (
        let d = new Date(startDateObj);
        d <= endDateObj;
        d.setDate(d.getDate() + 1)
      ) {
        const dayStr = d.toISOString().split("T")[0];
        if (!groupedPoints[dayStr]) {
          groupedPoints[dayStr] = {
            dateTime: dayStr,
            carbs: 0,
            fats: 0,
            protein: 0,
            unassigned: 0,
          };
        }
      }
      mealDataPoints = Object.values(groupedPoints).sort(sortByDateTime);
    } else {
      mealDataPoints = Object.values(
        mealDataPoints.reduce(
          (acc: { [key: string]: dataPoint }, point: dataPoint) => {
            const date = point.dateTime.split("T")[0];
            if (!acc[date]) {
              acc[date] = {
                dateTime: date,
                carbs: 0,
                fats: 0,
                protein: 0,
                unassigned: 0,
              };
            }
            acc[date].carbs += point.carbs;
            acc[date].fats += point.fats;
            acc[date].protein += point.protein;
            acc[date].unassigned += point.unassigned;
            return acc;
          },
          {} as { [key: string]: dataPoint }
        )
      ).sort(sortByDateTime);
    }
  }

  // If startDay and endDay were not provided, we still augment the data with an empty datapoint at the start and end of the range.
  const dataPoints =
    startDay && endDay ? mealDataPoints : augmentDataPoints(mealDataPoints);
  const cumulativeMealDataPoints = calculateCumulativeCalories(dataPoints);
  const finalDataPoints = cumulative ? cumulativeMealDataPoints : dataPoints;

  const maxYValue = Math.max(
    ...finalDataPoints.flatMap((point) => [
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
  const xAxisFormatter = createXAxisFormatter(isSingleDay);

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
      <AreaChart width={chartWidth} height={250} data={finalDataPoints}>
        <CartesianGrid {...gridLineStyle} />
        <XAxis dataKey="dateTime" tickFormatter={xAxisFormatter} />
        <YAxis
          domain={[0, maxYValue * 1.2]}
          ticks={[
            ...Array(Math.floor(maxYValue / 500))
              .fill(0)
              .map((_, i) => i * 500),
            target || 0,
          ]}
        />
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
        <Area
          type="monotone"
          dataKey="unassigned"
          stackId="1"
          stroke={COLORS.greyedOut}
          fillOpacity={0.6}
          fill={COLORS.greyedOut}
        />
        {target !== undefined && (
          <ReferenceLine y={target} style={referenceLineStyle}>
            <Label value="Daily target" position="insideTop" offset={10} />
          </ReferenceLine>
        )}
      </AreaChart>
    </div>
  );
}

function createMealDataPoint(meal: MealData): dataPoint {
  const combinedDateTime = new Date(`${meal.date}T${meal.time}`).toISOString();
  const unassignedCalories =
    (meal.calories || 0) -
    ((meal.carbos || 0) * 4 + (meal.fats || 0) * 9 + (meal.protein || 0) * 4);
  return {
    dateTime: combinedDateTime,
    carbs: (meal.carbos || 0) * 4,
    fats: (meal.fats || 0) * 9,
    protein: (meal.protein || 0) * 4,
    unassigned: unassignedCalories > 0 ? unassignedCalories : 0,
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

function calculateCumulativeCalories(dataPoints: dataPoint[]) {
  let cumulativeCarbs = 0;
  let cumulativeFats = 0;
  let cumulativeProtein = 0;
  let cumulativeUnassigned = 0;
  return dataPoints.map((point) => {
    cumulativeCarbs += point.carbs;
    cumulativeFats += point.fats;
    cumulativeProtein += point.protein;
    cumulativeUnassigned += point.unassigned;
    return {
      dateTime: point.dateTime,
      carbs: cumulativeCarbs,
      fats: cumulativeFats,
      protein: cumulativeProtein,
      unassigned: cumulativeUnassigned,
    };
  });
}

function augmentDataPoints(dataPoints: dataPoint[]) {
  if (dataPoints.length === 0) return [];
  const firstDateTime = new Date(dataPoints[0].dateTime);
  const lastDateTime = new Date(dataPoints[dataPoints.length - 1].dateTime);
  const startOfDay = new Date(firstDateTime);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(lastDateTime);
  endOfDay.setHours(23, 59, 59, 999);
  const augmentedData = [
    {
      dateTime: startOfDay.toISOString(),
      carbs: 0,
      fats: 0,
      protein: 0,
      unassigned: 0,
    },
    ...dataPoints,
    {
      dateTime: endOfDay.toISOString(),
      carbs: 0,
      fats: 0,
      protein: 0,
      unassigned: 0,
    },
  ];
  return augmentedData;
}

export default MacroStackedChart;
