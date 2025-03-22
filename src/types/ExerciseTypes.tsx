export type ExerciseData = {
  id?: number;
  name: string;
  date: string;
  time?: string;
  duration?: string;
  calories?: number;
  type: string;
};

const today = new Date().toISOString().split("T")[0];

export const defaultExerciseData = {
  name: "",
  date: today,
  type: "Other",
};
