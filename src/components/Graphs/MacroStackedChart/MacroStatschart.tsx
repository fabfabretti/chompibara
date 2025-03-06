import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
  Label,
} from "recharts";
import MealData from "../../../type/MealData";
import COLORS from "../../../context/macroColors";

// Props per il componente
type MealChartProps = {
  meals: MealData[]; // array di MealData che verrà passato al componente
  target?: number; // obiettivo giornaliero di calorie (opzionale)
};

const MacroStackedChart: React.FC<MealChartProps> = ({ meals, target }) => {
  // Trova la data minima e massima tra i pasti
  const minDate = new Date(
    Math.min(...meals.map((meal) => new Date(meal.date).getTime()))
  );
  const maxDate = new Date(
    Math.max(...meals.map((meal) => new Date(meal.date).getTime()))
  );

  // Crea una funzione per generare tutti i giorni tra la data minima e massima
  const generateDateRange = (start: Date, end: Date) => {
    const dateArray = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  };

  // Genera tutti i giorni tra il primo e l'ultimo pasto
  const allDates = generateDateRange(minDate, maxDate);

  // Raggruppa i pasti per giorno, convertendo le macro in calorie
  const groupedMeals = meals.reduce(
    (
      acc: {
        [key: string]: {
          date: string;
          carbs: number;
          fats: number;
          protein: number;
          calories: number;
        };
      },
      meal
    ) => {
      const date = meal.date;
      if (!acc[date])
        acc[date] = { date, carbs: 0, fats: 0, protein: 0, calories: 0 };

      // Conversione delle macro in calorie
      const mealCalories = {
        carbs: (meal.carbos || 0) * 4,
        fats: (meal.fats || 0) * 9,
        protein: (meal.protein || 0) * 4,
      };

      acc[date].carbs += mealCalories.carbs;
      acc[date].fats += mealCalories.fats;
      acc[date].protein += mealCalories.protein;
      acc[date].calories +=
        mealCalories.carbs + mealCalories.fats + mealCalories.protein;

      return acc;
    },
    {}
  );

  // Converte l'oggetto in un array e include anche i giorni senza pasti
  const data = allDates.map((date) => {
    const formattedDate = date.toISOString().split("T")[0]; // formato "YYYY-MM-DD"
    return (
      groupedMeals[formattedDate] || {
        date: formattedDate,
        carbs: 0,
        fats: 0,
        protein: 0,
        calories: 0,
      }
    );
  });

  // Ordina i dati per data crescente
  data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
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
        {/* Se target è presente, aggiungi la ReferenceLine */}
        {target !== undefined && (
          <ReferenceLine
            y={target}
            stroke={COLORS.greyedOut}
            strokeDasharray="3 3"
          >
            <Label value="Target" position="insideTop" offset={10} />
          </ReferenceLine>
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MacroStackedChart;
