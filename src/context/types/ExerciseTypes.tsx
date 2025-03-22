const today = new Date().toISOString().split("T")[0];
const now = new Date().toTimeString().slice(0, 5);
export type ExerciseData = {
  id: number;
  name: string;
  date: string;
  time: string;
  duration?: string;
  calories?: number;
  type: string;
};

export const defaultExerciseData: ExerciseData = {
  id: 0,
  name: "",
  date: today,
  time: now,
  type: "Other",
};
